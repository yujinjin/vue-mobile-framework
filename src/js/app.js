/**
 * 作者：yujinjin9@126.com
 * 时间：2016-03-03
 * 描述：app 核心框架
 */
export default {
	Config: {
		resourecePath: "", //资源服务路径
		serverPath: "", //服务路径
		version: "", //app版本
		releaseTime: "", //发布时间
		isDebug: false, //是否是前端调试状态
		innerVersion : "999.999.999", // 获得当前终端的版本号
		isWeiXin : false, //是否在微信环境内
		isApp: false, //是否是在app内
		isPc: false, // 是否是PC环境内
		browser: null, //浏览器环境
		sessionId: null, // 当做用户会话ID
		cookieId: null, // 当前用户的唯一标识
		platform: "H5", // 当前系统平台 H5,Android,IOS
		device: {
			id: null, // 设备ID 设备ID，H5自行生成一个设备号，永不过期
			isAndroid : false, //是否在安卓环境内，应该叫isAndroidApp
			isIOS : false, //是否在IOS环境内，应该叫isIOSApp
			systemVersion: null, //系统版本号
			operatingSystem: null, // 操作系统
			buildVersion: null, //编译版本号
			isAndroidDevice: false, // 是否是Android设备
			isIOSDevice: false // 是否是iOS设备
		}
	},

	initApp(globalService, store) {
		//获取当前环境
		if(window.navigator && window.navigator.userAgent) {
			const ua = window.navigator.userAgent.toLocaleLowerCase();
			const _match = ua.match(/^.+;([a-zA-Z0-9]+)_app_([a-zA-Z0-9]+)_([\d+\.?]+)_([\d+\.?]+)_(\d+)$/);
			if(_match) {
				//app环境
				this.Config.isApp = true;
				if(_match[2] === "iphone") {
					//mozilla/5.0 (iphone; cpu iphone os 10_3 like mac os x) applewebkit/603.1.30 (khtml, like gecko);jk724_app_iphone_10.30_3.3.33_61
					this.Config.device.isIOS = true;
					this.Config.browser = "jk724IOSApp";
					this.Config.platform = "IOS";
				} else if(_match[2] === "android") {
					this.Config.device.isAndroid = true;
					this.Config.browser = "jk724AndroidApp";
					this.Config.platform = "Android";
				}
				this.Config.device.systemVersion = _match[3];
				this.Config.version = _match[4];
				this.Config.device.buildVersion = _match[5];
			} else if(ua.match(/MicroMessenger/i) == 'micromessenger') {
				this.Config.isWeiXin = true;
			} else if(ua.match(/UCWEB/i) || ua.match(/UCBrowser/i)) {
				// uc浏览器
				// TODO:未经过测试
				this.Config.browser = "uc";
			} else if(ua.match(/MQQBrowser/i)) {
				// qq浏览器
				// TODO:未经过测试
				this.Config.browser = "qq";
			} else if(ua.match(/FxiOS/i) || ua.match(/Firefox/i)) {
				// 火狐浏览器
				// TODO:未经过测试
				this.Config.browser = "firefox";
			} else if(ua.match(/MSIE/i) || ua.match(/IEMobile/i)) {
				// IE浏览器
				// TODO:未经过测试
				this.Config.browser = "IE";
			} else if(ua.match(/Chrome/i)) {
				// 谷歌浏览器
				// TODO:未经过测试
				this.Config.browser = "Chrome";
			} else {
				this.Config.browser = "unknown";
			}
			if(!this.Config.isApp && !this.Config.isWeiXin && !(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent))){
				this.Config.isPc = true;
			}
			if(/(iphone|ipad|ipod|ios)/i.test(ua)) {
				this.Config.device.isIOSDevice = true;
			} else if(/(android)/i.test(ua)) {
				this.Config.device.isAndroidDevice = true;
			}
			if(/(windows)/i.test(ua)) {
				this.Config.device.operatingSystem = "windows";
			} else if(/(mac)/i.test(ua)) {
				this.Config.device.operatingSystem = "mac";
			} else if(/(linux)/i.test(ua)) {
				this.Config.device.operatingSystem = "linux";
			} else if(/(x11)/i.test(ua)) {
				this.Config.device.operatingSystem = "x11";
			}
		}
		// 初始化本地配置数据
		this.Config.sessionId = globalService.getSessionId();
		this.Config.cookieId = globalService.getUserKey();
		this.Config.device.id = globalService.getDeviceId();
		// 初始化本地登录信息存储到store
		let loginUserInfo = globalService.getLocalLoginUserInfo();
		if(loginUserInfo && loginUserInfo.token) {
		    store.dispatch("updateLocationInfo", {
		    	key: "loginUserInfo",
		    	value: {
		    		token: loginUserInfo.token, 
		    		expiredTime: loginUserInfo.expiredTime, 
		    		referralCode: loginUserInfo.referralCode, 
		    		isBindMobile: false, 
		    		userId: loginUserInfo.info.userId, 
		    		name: loginUserInfo.info.name, 
		    		headImgURL: loginUserInfo.info.headImgURL,
		    		fullName: loginUserInfo.info.fullName
		    	}
		    });
		}
	}
}