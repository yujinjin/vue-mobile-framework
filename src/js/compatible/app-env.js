/**
 * 作者：yujinjin9@126.com
 * 时间：2017-08-09
 * 描述：H5 app环境
 */
import abstractEnv from './abstract-env'
import hybrid from '../utils/hybrid'
import store from '../store/'
import dataReport from '../services/data-report'

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
		hybrid.getNativeData({actions: "referrerPage"}, function(data){
			try {
				data = JSON.parse(data);
				dataReport.setReferrer(data.referrerPage);
			} catch(e){
				app.log.error("解析app的协议失败:" + e.message + "协议内容：" + data);
			}
		});
		hybrid.getNativeData({actions: "sessionId"}, function(data){
			try {
				data = JSON.parse(data);
				app.globalService.setSessionId(data.sessionId);
			} catch(e){
				app.log.error("解析app的协议失败:" + e.message + "协议内容：" + data);
			}
		});
		hybrid.getNativeData({actions: "cookieId"}, function(data){
			try {
				data = JSON.parse(data);
				app.globalService.setUserKey(data.cookieId);
			} catch(e){
				app.log.error("解析app的协议失败:" + e.message + "协议内容：" + data);
			}
		});
		hybrid.getNativeData({actions: "deviceInfo"}, function(data){
			try {
				data = JSON.parse(data);
				app.globalService.setDeviceId(data.deviceId);
			} catch(e){
				app.log.error("解析app的协议失败:" + e.message + "协议内容：" + data);
			}
		});
		//查询页面路由配置列表数据
		app.api.common.queryRoutesList().then((data)=>{
			this.routers.routeList = data || [];
			// 查询当前APP用户登录信息
			hybrid.getUserInfo((userInfo)=>{
				let _token = app.globalService.getLoginUserToken();
				try {
					userInfo = JSON.parse(userInfo);
					if(userInfo.success === true) {
						userInfo = userInfo.data || {};
					}
				} catch(e){}
				// TODO: 确认当前APP用户存储的登录信息内容
				if(userInfo.authToken) {
					// 页面初始化时如果当前APP有用户登录信息就以当前登录用户的信息为准，设置H5的登录信息
					app.globalService.setUserInfo({
						referralCode: userInfo.referralCode,
						token: userInfo.authToken,
						expiredTime: userInfo.expiredIn,
						isBindMobile: true,
						info: {
							"userId": userInfo.userInfo.userId,
							"name": userInfo.userInfo.name,
						    "profile": {
						        "birthday": userInfo.userInfo.profile.birthday, //生日
						        "gender": userInfo.userInfo.profile.gender //性别
						    },
						    "fullName": userInfo.userInfo.fullName,
						    "headImgURL": userInfo.userInfo.headImgURL,
						    "idCardNumber": userInfo.userInfo.idCardNumber,
						    "weChatQRCodeImgURL": userInfo.userInfo.weChatQRCodeImgURL
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

		// TODO: 重写globalService.setUserInfo方法
		app.globalService.setUserInfo = function({referralCode, token, expiredTime = -1, info = {}, isBindMobile = false}, isAppLogin = true){
			let _login_user_info = this.getSiteLocalStorage("userInfo");
	    	if(expiredTime > 0) {
				if(_login_user_info == null || typeof(_login_user_info) != "object"){
					_login_user_info = {};
				}
				expiredTime = new Date().getTime() + (expiredTime - 60) * 1000;
	            Object.assign(_login_user_info, {referralCode, token, isBindMobile: false, expiredTime, version: app.Config.innerVersion, info: info});
	            this.setSiteLocalStorage("userInfo", _login_user_info);
	            store.dispatch("updateLocationInfo", {key: "loginUserInfo", value: {token, expiredTime, referralCode, isBindMobile, userId: info.userId, name: info.name, headImgURL: info.headImgURL}});
	    		store.dispatch("trigger",{eventName: "setUserInfo", args: [_login_user_info]});
	    		// APP去登录
				if(isAppLogin) {
					hybrid.login({referralCode, token, expiredTime: expiredTime, info});
				}
	    	} else if(_login_user_info){
	            this.setSiteLocalStorage("userInfo");
	            store.dispatch("updateLocationInfo", {key: "loginUserInfo", value: null});
	            // 触发设置用户信息时的事件
	    		store.dispatch("trigger",{eventName: "setUserInfo", args: []});
	    	}
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
		hybrid.showHeader({translucent: true});
		hybrid.updateFooterState({isShow: false});
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
				}
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
			//TODO: 判断当前路由是否需要跳转native
			let _to_name = to.name;
			// 当前版本号低于5.0.0，当前的健康商城全部跳转到首页
			if(_to_name === "shopping-home" && app.Config.version.split(".")[0] < 5) {
				_to_name = "home";
			}
			let _find_item = this.routeList.find((item) => {return _to_name == item.name});
			if(_find_item && _find_item.isNative == true){
				next(false);
				let _temp_param = {};
				// 说明当前页面是从native进来的，而现在要在H5中转一下再跳转到navtive replace为true
				if(_to_name === "order-confirmation") {
					// h5的详情页到原生的订单确认页参数要特殊处理
					_temp_param = app.globalService.getShoppingCartOrderPreviewInfo(to.query.id);
				} else if(_to_name === "login") {
					// 加这个参数主要用于注册页面的数据上报，判断当前用户注册是因为
					_temp_param = {fromPageName: from.name};
				}
				hybrid.forward({topage: _find_item.name, type: "native", replace: (store.state.appData.direction == "replace" || to.query.fromApp === "true" || to.query.fromApp === true), urlParam: Object.assign({}, to.query, to.params, _temp_param)});
				return false;
			}
			if(scrollNavbarStatusEvent.isAdded) {
				scrollNavbarStatusEvent.removeEvent();
			}
			if(to.meta.navbarStatus && to.meta.navbarStatus.isAlwaysTransparentHead == false) {
				scrollNavbarStatusEvent.addEvent();
			}
			return true;
		},
		afterEach(route, store){
			switch (route.name) {
				case 'home':
					store.dispatch("updateHeader",{left: {actions: 'empty', isShow: false}});
					//.updateHeaderLeft({actions: 'empty'});
			}
		}
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
		updateHeader({left, center, right, opacity, translucent}){
			if (left && typeof(left) === "object") {
				left.actions =  left.actions || "empty";
				left.value =  left.value || "";
			}
			if (center && typeof(center) === "object") {
				center.actions =  center.actions || "empty";
				center.value =  center.value || "";
			}
			if (right && typeof(right) === "object") {
				right.actions =  right.actions || "empty";
				right.value =  right.value || "";
			}
			hybrid.updateHeader({left, center, right});
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

	// 通过事件触发分享
	shareEvent({shareTitle, shareLink, shareDes, shareImg, onShareAppMessageSuccess, onShareTimelineSuccess}, callbackFun) {
		hybrid.share({title: shareTitle, url: shareLink, desc: shareDes, img: shareImg, onShareAppMessageSuccess, onShareTimelineSuccess}, callbackFun);
	}
}
