/**
 * 作者：yujinjin9@126.com
 * 时间：2017-05-23
 * 描述：数据上报
 */
import utils from "../utils/utils"
import globalService from "./global-service"
import store from "../store/"

export default (function(){
	let conroller = {
		reportServiceUrl: window.location.protocol + "//wxdev.jk724.com/api/ubt", // 上报服务的URL
		// 基础信息对象，不用通过动态计算获取
		baseInfo: {
			openId: null, // 当前当前OpenId
			deviceId: null, // 设备ID 设备ID，H5自行生成一个设备号，永不过期
			sessionId: null, // 当做用户会话ID
			deviceType: null, // 设备类型：1.andriod 2.ipad 3.iphone 4.PC
			deviceName: null, // 设备名称 IOS Android H5 PC
			deviceVersion: null, // 设备的版本
			applicationVersion: null, // 应用程序版本号
			operatingSystem: null, // 当前操作系统
			browser: null, // 浏览器类型
			isApp: false, // 是否是724的app
			applicationName: "App", // 应用名称
			cookieId: null, // 当前用户的唯一标识
			icd: null, // 如果当前用户未登录，获取别人分享过来的邀请码
			userId: null // 当前登录用户的ID
		},
		// 动态计算获取到的信息
		computedInfo: {
			pageName: null, // 当前页面的名称
			//pageId: null, // 当前页面的唯一标识
			urlParameters: {}, // 事件传递
			//urlParameters: {}, // 当前页面的URL参数
			//action: "", // 用户动作名称 
			referPageName: "", //获取上一个页面的来源
			
		},
		constantParametersURL: null, // 常量URL
		// 初始化
		init(app){
			let env = config.env;
			if(env === "UAT") {
				conroller.reportServiceUrl = window.location.protocol + "//wxuat.jk724.com/api/ubt";
			} else if(env === "PRD") {
				conroller.reportServiceUrl = window.location.protocol + "//wx.jk724.com/api/ubt";
			}
			const ua = window.navigator.userAgent || window.navigator.userAgent.toLocaleLowerCase();
			if(ua){
				if(app.Config.isApp) {
					this.baseInfo.isApp = true;
					this.baseInfo.deviceType = (app.Config.device.isIOS?'iphone':'andriod');
					this.baseInfo.deviceName = (app.Config.device.isIOS?'IOS':'Android');
				} else if(/(android)/i.test(ua)) {
					this.baseInfo.deviceType = "andriod";
				} else if(/(iphone)/i.test(ua)) {
					this.baseInfo.deviceType = "iphone";
				} else if(/(ipad)/i.test(ua)) {
					this.baseInfo.deviceType = "ipad";
				} else if(app.Config.isPc) {
					this.baseInfo.deviceType = "pc";
					this.baseInfo.deviceName = "PC";
				}
			}
			this.baseInfo.openId = app.globalService.getWxAuthenticateInfo().authenticateId;
			if(!this.baseInfo.deviceName) {
				this.baseInfo.deviceName = "H5";
			}
			if(app.Config.device.systemVersion){
				this.baseInfo.deviceVersion = app.Config.device.systemVersion;
			}
			if(app.Config.version){
				this.baseInfo.applicationVersion = app.Config.version;
			} else {
				this.baseInfo.applicationVersion = app.Config.innerVersion;
			}
			if(app.Config.device.id) {
				this.baseInfo.deviceId = app.Config.device.id;
			}
			this.baseInfo.browser = app.Config.browser;
			this.baseInfo.cookieId = app.Config.cookieId;
			this.baseInfo.sessionId = app.Config.sessionId;
			this.baseInfo.operatingSystem = app.Config.device.operatingSystem;
			// 获取当前登录用户信息的userId
			this.baseInfo.icd = globalService.getInvitationCode();
			let _userInfo = globalService.getStoreLoginUserInfo();
			if(_userInfo && _userInfo.userId) {
				this.baseInfo.userId = _userInfo.userId;
			}
			let _this = this;
			store.dispatch("on", {
				eventName: "setUserInfo",
				callback: function(userInfo){
					if(userInfo.info && userInfo.info.userId) {
						_this.baseInfo.userId = userInfo.info.userId
					} else {
						_this.baseInfo.userId = null;
					}
					_this.constantParametersURL = _this.generateParametersUrl(_this.baseInfo);
				}
			});
			this.constantParametersURL = this.generateParametersUrl(this.baseInfo);
		},
		
		initPage($route){
			this.computedInfo.pageName = $route.name;
			// this.computedInfo.pageId = $route.name;
			this.computedInfo.urlParameters = utils.extend(true, {}, $route.params, $route.query);
			this.setReferrer(window.location.href);
			this.computedInfo.referPageName = this.getReferrerURL();
		},
		
		// 获取当前页面的URI参数
		getReferrerURL(){
			if(typeof(window.sessionStorage) === "undefined"){
				return null;
			}
			let referrerInfo = sessionStorage.getItem("referrerInfo");
			if(referrerInfo) {
				try {
					referrerInfo = JSON.parse(referrerInfo);
				} catch(e){
					referrerInfo = {};
				}
				return referrerInfo.next;
			}
			return null;
		},
		
		setReferrer(url){
			if(typeof(window.sessionStorage) === "undefined") {
				return;
			}
			let referrerInfo = sessionStorage.getItem("referrerInfo");
			if(referrerInfo) {
				try {
					referrerInfo = JSON.parse(referrerInfo);
				} catch(e){
					referrerInfo = {};
				}
				if(document.referrer && referrerInfo.referrer != document.referrer) {
					// 如果当前页面是通过外部站点进来的
					referrerInfo.next = document.referrer;
					referrerInfo.referrer = document.referrer;
				} else if(referrerInfo.current === url) {
					// 说明当前页面是在刷新
					return;
				} else {
					referrerInfo.next = referrerInfo.current;
				}
			} else if(document.referrer) {
				referrerInfo = {};
				// 直接是从外部站进来的
				referrerInfo.next = document.referrer;
			} else {
				referrerInfo = {};
			}
			referrerInfo.current = url;
			sessionStorage.setItem("referrerInfo", JSON.stringify(referrerInfo));
		},
		
		// 生成上报数据参数URL
		generateParametersUrl(parameters){
			let parametersArray = [];
			if(!parameters && typeof(parameters) != "object") {
				return "";
			}
			for(var key in parameters){
				if(parameters.hasOwnProperty(key) && parameters[key] !== "" && parameters[key] !== null){
					if(typeof(parameters[key]) == "object") {
						if(JSON.stringify(parameters[key]) !== "{}") {
							//let urlParameters = conroller.generateParametersUrl(parameters[key]);
							parametersArray.push(encodeURIComponent(key) + "=" + encodeURIComponent(JSON.stringify(parameters[key])));
						}
					} else {
						parametersArray.push(encodeURIComponent(key) + "=" + encodeURIComponent(parameters[key]));
					}
				}
			}
			if(parametersArray.length === 0){
				return "";
			}
			return parametersArray.join('&').replace(/%20/g, "+");
		},
		
		// 发送数据
		send(actionParametersURL, pageComputedParametersURL){
			// 其他环境数据上报不了了
  			if(config.env !== "PRD") return;
			var _img = document.createElement('img');
			_img.src = conroller.reportServiceUrl + "?" + conroller.constantParametersURL + "&" + actionParametersURL + "&" + pageComputedParametersURL + '&rd=' + (+new Date);
		}
	}

	return {
		pageComputedParametersURL: null, // 当前页面动态计算获取的URL
		
		init(app){
			conroller.init(app);
			let _this = this;
			// 页面离开事件
			window.onbeforeunload = function(){
				_this.push({eventName:'OnExit', actionName:'exit'});
			}
		},
		
		initPage($route){
			conroller.initPage($route);
			this.pageComputedParametersURL = conroller.generateParametersUrl(conroller.computedInfo);
			// 页面加载数据上报
			this.push();
		},
		
		// 设置当前页面的URI
		setReferrer(url){
			return conroller.setReferrer(url);
		},
		
		// 事件数据上报，另加一个参数parameters
		eventReport(actionParameters, eventParameters){
			if(typeof(actionParameters) === "string"){
				actionParameters = {'actionName': actionParameters};
			}
			if(!actionParameters.eventName && actionParameters.actionName){
				if(actionParameters.actionName.indexOf("go-") === 0){
					actionParameters.eventName = "OnGo";
				} else if(actionParameters.actionName.indexOf("select-") === 0) {
					actionParameters.eventName = "OnSelect";
				} else if(actionParameters.actionName.indexOf("slide-") === 0) {
					actionParameters.eventName = "OnSlide";
				} else {
					actionParameters.eventName = "OnClick";
				}
			} else if(!actionParameters.actionName) {
				actionParameters.actionName = "unknow";
			}
			if(eventParameters) {
				this.push(Object.assign({}, actionParameters, {parameters: eventParameters}));
			} else {
				this.push(actionParameters);
			}
		},
		
		// 指令中的事件上报
		eventDirectiveReport(parameters){
			// 当前的数据值一定要是静态的，如果是动态的绑定该数据拿到的值一定是初始化的值
			let actionParameters = {}, eventParameters = {}, isHasEventParameters = false;
			if(typeof(parameters) === "string"){
				this.eventReport(parameters);
				return;
			} 
			if(typeof(parameters) === "object"){
				for(var key in parameters){
					if(parameters.hasOwnProperty(key) && parameters[key] !== "" && parameters[key] !== null){
						if(key === 'actionName' || key === 'eventName') {
							actionParameters[key] = parameters[key];
						} else {
							isHasEventParameters = true;
							eventParameters[key] = parameters[key];
						}
					}
				}
				if(!actionParameters.actionName) {
					actionParameters.actionName = "unknow";
				}
			}
			if(isHasEventParameters) {
				this.eventReport(actionParameters, eventParameters);
			} else {
				this.eventReport(actionParameters);
			}
		},
		
		// 数据上报
		push({eventName='OnLoad', actionName='load', ...otherParameters} = {}){
			let urlParameters = "eventName=" + eventName + "&actionName=" + actionName;
			if(otherParameters && JSON.stringify(otherParameters) != "{}"){
				urlParameters += ("&" + conroller.generateParametersUrl(otherParameters));
			}
			conroller.send(urlParameters, this.pageComputedParametersURL);
		}
	}
})();
