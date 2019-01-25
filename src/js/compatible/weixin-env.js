/**
 * 作者：yujinjin9@126.com
 * 时间：2016-08-08
 * 描述：H5 微信环境
 */
import abstractEnv from './abstract-env'

export default class weiXinEnv extends abstractEnv {
	// 构造器
	constructor() {
		super();
	}
	
	// 初始化vueApp初始化
	initVue(initVueFun){
		// 如果是调试模式或者用户已经微信授权登录了，就不再去微信自动登录
		if(app.Config.isDebug || app.globalService.getLoginUserToken()) {
			initVueFun();
			return;
		}
		//如果当前环境是微信，而且是非调试模式
		if(!app.globalService.getWxAuthenticateInfo().authenticateId){
			// 而且本地localStorage没有权限id
			// 初次进入到724平台
			let {code, hashName} = app.utils.parseUrl(window.location.href).params;
			if(code) {
				let jump_href = window.location.href;
				// 删除code、state、hashName参数
				jump_href = jump_href.replace(eval('/(\\?|\\&)(code=)([^&]*)&*/gi'), function(parame, a){return a;}).replace(eval('/(\\?|\\&)(state=)([^&]*)&*/gi'), function(parame, a){return a;});
				if(hashName) {
					jump_href = jump_href.replace(eval('/(\\?|\\&)(hashName=)([^&]*)&*/gi'), function(parame, a){return a;}).replace("?", "#"+hashName+"?")
				}
				if(jump_href.substr(jump_href.length-1) === "?") {
					jump_href = jump_href.substring(0, jump_href.length-1);
				}
				app.api.user.loginByWxCode({providerCode: code, referralCode: app.globalService.getInvitationCode() || app.utils.parseUrl(window.location.href).params.icd}).then((result)=>{
					if(result.providerKey) {
						//TODO: 由于后端接口人员不提供providerKey，这样会导致用户登录过期会再次刷白屏请求4次去登录
						app.globalService.setWxAuthenticateInfo({authenticateId: result.providerKey, expiredTime: 60 * 60 * 24 * 365});
					}
					if(result && result.authToken) {
						app.globalService.setUserInfo({referralCode:result.referralCode, token:result.authToken, expiredTime: result.expiredIn, info: result.userInfo, isBindMobile: result.isBindMobile});
					}
					window.location.href = jump_href;
		        }).catch(()=>{
		        	app.log.error({message: "authenticateByProviderCode 接口数据调试 异常"});
		        	window.location.href = jump_href;
		        });
			} else {
				// 由于微信网页授权"#"是特殊字符不能被转换，得转换成参数
				let current_href = window.location.href;
				if(current_href.indexOf("#") > 0){
					hashName = current_href.substring(current_href.indexOf("#") + 1, current_href.indexOf("?")==-1?current_href.length:current_href.indexOf("?"));
				}
				if(hashName) {
					current_href = current_href.replace("#"+hashName, "");
					if(current_href.indexOf("?") === -1){
						current_href = current_href + "?";
					} else {
						current_href = current_href + "&";
					}
					current_href = current_href + "hashName=" + hashName;
				}
				app.api.user.getWxAuthorizeURL({"redirect_URI": current_href, "response_Type": "code", "status": "1"}).then((result)=>{
		        	window.location.href = result;
		        }).catch(()=>{mui.toast('微信登录授权获取失败...')});
			}
		} else {
			// 如果没有登录自动去登录
			app.api.user.loginByWxCode({providerCode: app.globalService.getWxAuthenticateInfo().authenticateId, referralCode: app.globalService.getInvitationCode() || app.utils.parseUrl(window.location.href).params.icd}, {isShowError: false}).then((result)=>{
				if(result && result.authToken) {
					app.globalService.setUserInfo({referralCode: result.referralCode, token:result.authToken, expiredTime:result.expiredIn, info: result.userInfo, isBindMobile: result.isBindMobile});
				}
				initVueFun();
	        }).catch((error)=>{
	        	if(error && error.response && error.response.data && error.response.data.error && error.response.data.error.code === 90) {
	        		// 微信openID错误，刷新页面重新连接
	        		app.globalService.setWxAuthenticateInfo({});
	        		window.location.reload();
	        		return;
	        	}
	        	initVueFun();
	        });
		}
	}
	
	// 路由
	routers = {
		// 初始化routes配置
		initRoutes(routes){
			return routes;
		},
		//创建路由
		createRouter(store){
			//　由于单页应用中iOS 微信Landing Page是从第一次进入页面开始算的，所以这里记录iOS 微信中Landing Page的地址，目前主要用于支付授权目录判断使用
			if (app.Config.isWeiXin && /ip(hone|od|ad)/i.test(navigator.userAgent)) {
				store.dispatch("updateLocationInfo", {key: "landingPage", value: window.location.pathname});
			}
		},
		//路由访问之前的钩子函数
		beforeEach(){
			if (app.Config.isWeiXin && !app.globalService.getWxAuthenticateInfo().authenticateId) {
			//app.log.error("微信环境下竟然没有获取到code,服务出错！");
			}
		},
		afterEach(){
			var mobile = navigator.userAgent.toLowerCase();
			if (/iphone|ipad|ipod/.test(mobile)) {
				var iframe = document.createElement('iframe');
				iframe.style.display = 'none';
				// 替换成站标favicon路径或者任意存在的较小的图片即可
				iframe.setAttribute('src', require("../../imgs/favicon/favicon.ico"));
				var iframeCallback = function () {
		      		setTimeout(function () {
		        		iframe.removeEventListener('load', iframeCallback)
		        		document.body.removeChild(iframe)
		      		}, 0);
				}
				iframe.addEventListener('load', iframeCallback)
		    	document.body.appendChild(iframe);
			}
		}
	}
	
	// vuex store
	store = {
		//修改导航标题
		updateNavbarTitle(title){},
		
		//修改导航状态
		updateNavbarStatus(navbar){},
		
		//修改头部导航
		updateHeader(header){},
		
		//重置header内容
		resetHeader(){}
	}
	
	// 分享
	share(shareInfo, callbackFun){
		app.api.common.wxShare(shareInfo, (result)=>{
			if(callbackFun && typeof(callbackFun) === "function"){
				callbackFun(result);
			}
		});
	}
	
	// 通过事件触发分享
	shareEvent(shareInfo, callbackFun, isChange, shareEventInstance){
		if(isChange) {
			app.share(shareInfo, callbackFun);
		}
		shareEventInstance.show();
	}
}