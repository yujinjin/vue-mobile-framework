/**
 * 作者：yujinjin9@126.com
 * 时间：2016-03-03
 * 描述：app 核心框架
 */
const site = {
	Config: {
		resourecePath: "", //资源服务路径
		serverPath: "", //服务路径
		version: "", //app版本
		releaseTime: "", //发布时间
		isDebug: true, //是否是前端调试状态
		innerVersion : "999.999.999", // 获得当前终端的版本号
		isInsideApp : false, // 是否在APP应用环境内
		isWeiXin : false, //是否在微信环境内
		isApp: false, //是否是在app内
		isPc: false, // 是否是PC环境内
		browser: null, //浏览器环境
		device: {
			isAndroid : false, //是否在安卓环境内
			isIOS : false, //是否在IOS环境内
			systemVersion: null, //系统版本号
			buildVersion: null //编译版本号
		}//设备信息
	},

	initApp() {
		//获取当前环境
		if(window.navigator && window.navigator.userAgent) {
			const ua = window.navigator.userAgent.toLocaleLowerCase();
			const _match = ua.match(/^.+;([a-zA-Z0-9]+)_app_([a-zA-Z0-9]+)_([\d+\.?]+)_([\d+\.?]+)_(\d+)$/);
			if(_match) {
				//app环境
				site.Config.isApp = true;
				if(_match[2] === "iphone") {
					//mozilla/5.0 (iphone; cpu iphone os 10_3 like mac os x) applewebkit/603.1.30 (khtml, like gecko);jk724_app_iphone_10.30_3.3.33_61
					site.Config.device.isIOS = true;
				} else if(_match[2] === "android") {
					site.Config.device.isAndroid = true;
				}
				site.Config.device.systemVersion = _match[3];
				site.Config.version = _match[4];
				site.Config.device.buildVersion = _match[5];
			} else if(ua.match(/MicroMessenger/i) == 'micromessenger') {
				site.Config.isWeiXin = true;
			} else if(ua.match(/UCWEB/i) || ua.match(/UCBrowser/i)) {
				// uc浏览器
				// TODO:未经过测试
				site.Config.browser = "uc";
			} else if(ua.match(/MQQBrowser/i)) {
				// qq浏览器
				// TODO:未经过测试
				site.Config.browser = "qq";
			} else if(ua.match(/FxiOS/i) || ua.match(/Firefox/i)) {
				// 火狐浏览器
				// TODO:未经过测试
				site.Config.browser = "firefox";
			} else if(ua.match(/MSIE/i) || ua.match(/IEMobile/i)) {
				// IE浏览器
				// TODO:未经过测试
				site.Config.browser = "IE";
			} else if(ua.match(/Chrome/i)) {
				// 谷歌浏览器
				// TODO:未经过测试
				site.Config.browser = "Chrome";
			}
			if(!site.Config.isApp && site.Config.isWeiXin && !(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent))){
				site.Config.isPc = true;
			}
		}
	},
	
	//获取站点本地存储信息
	getSiteLocalStorage: function(){
		var _site_local_storage = app.utils.localStorage("siteLocalStorage");
		if(_site_local_storage) {
			try {
				_site_local_storage = JSON.parse(_site_local_storage);
			}catch(e){
				app.log.error(e);
			}
		}
		if(_site_local_storage == null || typeof(_site_local_storage) != "object"){
			_site_local_storage = {};
		}
		return _site_local_storage;
	}
};
site.initApp();
module.exports = site;