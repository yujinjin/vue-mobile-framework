/**
 * 作者：yujinjin9@126.com
 * 时间：2017-08-09
 * 描述：H5 app环境
 */
import abstractEnv from './abstract-env'
import hybrid from '../utils/hybrid'
import store from '../store/'

//header 加入滚动事件，用于判断header逐渐显示/隐藏,透明的功能,目前主要用于APP环境
let scrollNavbarStatusEvent = {
	opacity: -1,
	isAdded: false,
	eventFun(e){
		let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
		if(scrollTop > 65) {
			let opacity = (scrollTop-64)/200 > 1 ? 1 : (scrollTop-64)/200;
			if(app.vueApp.$store.state.appData.isShowHead != true) {
				scrollNavbarStatusEvent.opacity = opacity;
				app.vueApp.$store.dispatch("updateNavbarStatus", {isShowHead: true, isShowFoot: app.vueApp.$store.state.appData.isShowFoot, headerOpacity: opacity, isTranslucent: false});
			} else if(scrollNavbarStatusEvent.opacity != opacity){
				scrollNavbarStatusEvent.opacity = opacity;
				app.hybrid.updateHeaderOpacity({opacity: scrollNavbarStatusEvent.opacity, translucent: app.vueApp.$route.meta.navbarStatus.isTranslucent != false})
			}
		} else if(app.vueApp.$store.state.appData.isShowHead != false) {
			scrollNavbarStatusEvent.opacity = 0;
			app.vueApp.$store.dispatch("updateNavbarStatus", {isShowHead: false, isShowFoot: app.vueApp.$store.state.appData.isShowFoot, headerOpacity:  0, isTranslucent: false});
		}
	},
	addEvent(){
		if(scrollNavbarStatusEvent.isAdded){
			return;
		}
		scrollNavbarStatusEvent.isAdded = true;
		if(document.addEventListener) {
			document.addEventListener('scroll', scrollNavbarStatusEvent.eventFun, false);
		} else if(document.attachEvent) {
			document.attachEvent('scroll', scrollNavbarStatusEvent.eventFun);
		}
	},
	removeEvent(){
		this.opacity = -1;
		scrollNavbarStatusEvent.isAdded = false;
		if(document.removeEventListener) {
			document.removeEventListener('scroll', scrollNavbarStatusEvent.eventFun);
		} else if(document.detachEvent) {
			document.detachEvent('scroll', scrollNavbarStatusEvent.eventFun);
		}
	}
}

export default class appEnv extends abstractEnv {
	// 构造器
	constructor() {
		super();
	}
	
	// 初始化vueApp初始化
	initVue(initVueFun){
		app.hybrid = hybrid;
		//查询页面路由配置列表数据
		app.api.common.queryRoutesList().then((data)=>{
			this.routers.routeList = data || [];
			// 查询当前APP用户登录信息
			hybrid.getUserInfo((userInfo)=>{
				let _token = app.globalService.getLoginUserInfo().token;
				try {
					userInfo = JSON.parse(userInfo);
				} catch(e){}
				// TODO: 确认当前APP用户存储的登录信息内容
				if(userInfo.authToken) {
					// 页面初始化时如果当前APP有用户登录信息就以当前登录用户的信息为准，设置H5的登录信息
					app.globalService.setUserInfo({
						referralCode: userInfo.referralCode, 
						token: userInfo.authToken, 
						usernameOrEmailAddress: "", 
						expiredTime: userInfo.expiredIn, 
						info: {
							"name": userInfo.name,
						    "profile": {
						        "birthday": userInfo.userInfo.profile.birthday, //生日
						        "gender": userInfo.userInfo.profile.gender //性别
						    },
						    "fullName": userInfo.userInfo.fullName,
						    "headImgURL": userInfo.userInfo.headImgURL ,
						    "idCardNumber": userInfo.userInfo.idCardNumber,
						    "weChatQRCodeImgURL": userInfo.weChatQRCodeImgURL
						}
					}, false);
				} else if(_token){
					// 如果当前APP用户未登录就设置当前的H5登录信息也为空
					app.globalService.setUserInfo({});
				}
				initVueFun();
			});
		});
		// TODO: 重写utils.localStorage方法
//		app.utils.localStorage = function(key, value){
//			if(arguments.length === 0) {
//				app.log.warn("没有参数");
//				return;
//			}
//			if(!window || !window.localStorage) {
//				//TODO: 修改弹窗提示
//				alert("您开启了秘密浏览或无痕浏览模式，请关闭!");
//				return;
//			}
//			if(arguments.length === 1 || typeof(value) === "undefined") {
//				hybrid.getStorage({name: key}, function(dateValue){
//					if(dateValue != window.localStorage.getItem(key)){
//						app.log.warn("app 环境中storage的" + key + "值不一致, APP:" + dateValue + "  H5:"+value);
//					}
//				});
//				return window.localStorage.getItem(key);
//			} else if(value === null || value === '') {
//				hybrid.getStorage({name: key});
//				window.localStorage.removeItem(key);
//			} else if(typeof(value) === "object") {
//				hybrid.setStorage({name: key, data: JSON.stringify(value)});
//				window.localStorage.setItem(key, JSON.stringify(value));
//			} else {
//				hybrid.setStorage({name: key, data: value});
//				window.localStorage.setItem(key, value);
//			}
//		}
		// 获取APP的storage的方法
		app.utils.getAppStorage = function(key, callbackFun){
			hybrid.getStorage({name: key}, callbackFun);
		}
		// TODO: 重写globalService.getLoginUserInfo方法
		app.globalService.getLoginUserInfo = function(){
			const [_currentTime, _userInfo] = [(new Date()).getTime(), app.getSiteLocalStorage().userInfo || {}];
	    	//如果没有邀请码肯定是要重新登录的。
	    	if(_userInfo.expiredTime && (_userInfo.expiredTime - _currentTime) > 0 && _userInfo.referralCode && _userInfo.info) {
	    		return _userInfo;
	    	} else {
	    		app.globalService.setUserInfo({});
	    		return {};
	    	}
		},
		
		// TODO: 重写globalService.setUserInfo方法
		app.globalService.setUserInfo = function({referralCode, token, usernameOrEmailAddress, expiredTime = -1, info = {}}, isAppLogin = true){
			const _site_local_storage = app.getSiteLocalStorage(), _expiredTime = expiredTime;
    		let _is_save = true;
	    	if(expiredTime > 0) {
				if(_site_local_storage.userInfo == null || typeof(_site_local_storage.userInfo) != "object"){
					_site_local_storage.userInfo = {};
				}
				expiredTime = (new Date()).getTime() + (expiredTime - 60) * 1000;
				Object.assign(_site_local_storage.userInfo, {referralCode, token, usernameOrEmailAddress, expiredTime, version: app.Config.innerVersion, info: info});
				// APP去登录
				if(isAppLogin) {
					hybrid.login({referralCode, token, usernameOrEmailAddress, expiredTime: _expiredTime, info});
				}
	    	} else if(JSON.stringify(_site_local_storage.userInfo) !== "{}"){
	    		_site_local_storage.userInfo = {};
	    	} else {
	    		_is_save = false;
	    	}
	    	if(_is_save) {
	    		app.utils.localStorage("siteLocalStorage", JSON.stringify(_site_local_storage));
	    	}
	    	// 触发设置用户信息时的事件
    		store.dispatch("trigger",{eventName: "setUserInfo", args: [_site_local_storage.userInfo]});
		}
		//必须重置APP header、footer状态
		this.store.resetHeader({
			left: {
				actions: 'back',
    			value: '',
			},
			center: {actions: 'empty'},
	    	right: {actions: 'empty'}
		});
	}
	
	// 路由
	routers = {
		// 初始化routes配置
		initRoutes(routes){
			// 路由meta配置项
			let _routes = {
				"home": {
					navbarStatus: {
						isAlwaysTransparentHead: false // 默认true, 是否让header一直透明，该参数只用于app环境，因为app的header都是透明到不透明之间切换的
					}
				},
				"product": {
					isShowAppShare: true // 是否显示分享
				},
				"register-by-code": {
					isShowAppShare: true // 邀請好友是否显示分享
				},
				"brand-story": {
					isShowAppShare: true // 品牌故事是否显示分享
				},
//				"my-profit": {
//					navbarStatus: {isShowHead: true, isTranslucent: false, headerOpacity: 0}
//				}
			}
			routes.forEach((item) => {
				if(_routes[item.name]) {
					item.meta = app.utils.extend(true, {}, item.meta, _routes[item.name]);
					return true;
				}
				return false;
			});
			return routes;
		},
		//创建路由
		createRouter(){
			
		},
		//路由访问之前的钩子函数
		beforeEach(to, from, next, store){
			if(hybrid && hybrid.clearWebviewFun){
				//TODO: 兼容
				//hybrid.clearWebviewFun();
			}
			if(scrollNavbarStatusEvent.isAdded) {
				scrollNavbarStatusEvent.removeEvent();
			}
			//TODO: 判断当前路由是否需要跳转native
			let _find_item = this.routeList.find((item) => {return to.name == item.name});
			if(_find_item && _find_item.isNative == true){
				next(false);
				hybrid.forward({topage: _find_item.name, type: "native", urlParam: Object.assign({}, to.query, to.params)});
				return false;
			}
			if(to.meta.navbarStatus && to.meta.navbarStatus.isAlwaysTransparentHead == false) {
				scrollNavbarStatusEvent.addEvent();
			}
			return true;
		},
		afterEach(){}
	}
	
	// vuex store
	store = {
		//修改导航标题
		updateNavbarTitle(title){
			hybrid.updateHeaderTitle(title);
		},
		
		//修改导航状态
		updateNavbarStatus(oldNavbar, newNavbar){
			// 是否显示修改Header状态
			if (oldNavbar.isShowHead != newNavbar.isShowHead || oldNavbar.isTranslucent != newNavbar.isTranslucent) {
				if(newNavbar.isShowHead){
					hybrid.showHeader({translucent: newNavbar.isTranslucent});
				} else {
					hybrid.hideHeader();
				}
			}
			// 是否修改header透明度
			if(oldNavbar.headerOpacity != newNavbar.headerOpacity) {
				hybrid.updateHeaderOpacity({opacity: newNavbar.headerOpacity});
			}
			// 修改底部导航状态
			if(oldNavbar.isShowFoot != newNavbar.isShowFoot) {
				hybrid.updateFooterState({isShow: newNavbar.isShowFoot});
			}
		},
		
		//修改头部导航
		updateHeader(header){
			let param = {
				left: {
					actions: header.left.actions?header.left.actions:"empty",
					value: header.left.value || "",
					icon: header.left.icon,
					callback: header.left.callback
				},
				center: {
					actions: header.center.actions?header.center.actions:"empty",
					value: header.center.value || "",
					icon: header.center.icon,
					callback: header.center.callback
				},
				right: {
					actions: header.right.actions?header.right.actions:"empty",
					value: header.right.value || "",
					icon: header.right.icon,
					callback: header.right.callback
				}
			}
			hybrid.updateHeader(param);
		},
		
		//重置header内容
		resetHeader(header, callbackFun){
//			if(callbackFun && typeof(callbackFun) === "function"){
//				
//			} else {
			this.updateHeader(header);
			hybrid.showHeader({translucent: true}, (data)=>{app.log.info(data);});
	    	hybrid.updateHeaderOpacity({opacity:1}, (data)=>{app.log.info(data);});
//			}
		}
	}
	
	// 分享
	share({shareTitle, shareLink, shareDes, shareImg, onShareAppMessageSuccess, onShareTimelineSuccess}, callbackFun){
		if(app.vueApp.$route.meta.isShowAppShare === true) {
			hybrid.updateHeaderRight({
				actions: 'share',
				value: {
					title: shareTitle, //分享的标题
					desc: shareDes, //分享的描述
					img: shareImg, //分享的图片地址
					url: shareLink //分享的URL地址
				}
			}, callbackFun);
		} else if(app.vueApp.$store.state.appData.isShowAppShare != false) {
			hybrid.updateHeaderRight({actions: 'empty'}, callbackFun);
		}
		app.vueApp.$store.dispatch("updateShowAppShareStatus", app.vueApp.$route.meta.isShowAppShare === true);
	}
}
