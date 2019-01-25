/**
 * 作者：yujinjin9@126.com
 * 时间：2017-01-19
 * 描述：站点log日志
 */
const levels = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    FATAL: 4
};
let level = levels.ERROR;

const info = {
	"DeviceTimeStamp": 0, // 设备时间点
  	"BrowerName": "string", // 浏览器名称
  	"DeviceType": "string", // 设备的类型
  	"UserId": "string", // 用户信息
  	"LocationHref": "string", // 当前链接
  	"PageName": "string", // 页面名称
  	"RouterName": "string", // 路由名称
  	"Message": "string", // 消息
  	"LogLevel": 0, // 日志级别
  	"Env": "string", // 当前项目环境
  	"ProjectName": "string" //项目名称
}

const sendLogMessage = function(message, level){
	info.DeviceTimeStamp = (new Date()).getTime();
	info.LocationHref = window.location.href;
	info.PageName = window.document.title;
	try {
		info.RouterName = app.vueApp.$route.meta.title;
	} catch(e) {}
	info.LogLevel = level;
	info.Message = message;
	try {
		if(app.globalService.getStoreLoginUserInfo().userId) {
			info.UserId = app.globalService.getStoreLoginUserInfo().userId;
		}
	} catch(e){ }
	// return app.api.common.sendLogMessage(info);
	return Promise.resolve(true);
}

export default {
	// 初始化
	init(){
		if(config.isDebug) {
			level = levels.DEBUG;
		}
		try{
			info.BrowerName = window.navigator.userAgent;
			if(app.Config.device.isIOS) {
				info.DeviceType = "iOS";
			} else if(app.Config.device.isAndroid) {
				info.DeviceType = "Android";
			} else if((window.navigator.platform == "Win32") || (window.navigator.platform == "Windows")) {
				info.DeviceType = "window";
			} else if((window.navigator.platform == "Mac68K") || (window.navigator.platform == "MacPPC") || (window.navigator.platform == "Macintosh") || (window.navigator.platform == "MacIntel")) {
				info.DeviceType = "MAC";
			} else if(window.navigator.userAgent.toLowerCase().match(/android/i) == "android"){
				info.DeviceType = "Android";
			} else if(window.navigator.userAgent.toLowerCase().match(/ipad/i) == "ipad"){
				info.DeviceType = "ipad";
			} else if(window.navigator.userAgent.toLowerCase().match(/iphone/i) == "iphone"){
				info.DeviceType = "iphone";
			} else if(window.navigator.userAgent.toLowerCase().match(/midp/i) == "midp"){
				info.DeviceType = "midp";
			} else if(window.navigator.userAgent.toLowerCase().match(/ipod/i) == "ipod"){
				info.DeviceType = "ipod";
			} else if(window.navigator.userAgent.toLowerCase().match(/symbianos/i) == "symbianos"){
				info.DeviceType = "SymbianOS";
			} else if(window.navigator.userAgent.toLowerCase().match(/windows phone/i) == "windows phone"){
				info.DeviceType = "Windows Phone";
			} else if(window.navigator.platform == "X11") {
				info.DeviceType = "Unix";
			} else if(String(window.navigator.platform).indexOf("Linux") > -1){
				info.DeviceType = "Linux";
			}
			info.Env = config.env;
			info.ProjectName = "jk724mobile";
		} catch(e) {
			this.error("获取浏览器信息或设备信息异常....");
		}
	},
	
  	log(logObject, logLevel, isSend) {
  		if(isSend != false && (config.env === "PRD" || logLevel > levels.WARN)) {
  			if(typeof(logObject) === "object"){
	  			sendLogMessage(JSON.stringify(logObject), logLevel);
	  		} else {
	  			sendLogMessage(logObject, logLevel);
	  		}
  		}
        if (!window.console || !window.console.log) {
            return;
        }
        if (logLevel != undefined && logLevel < level) {
            return;
        }
        console.log(logObject);
    },
	
	debug(logObject){
        this.log("DEBUG: ", levels.DEBUG, false);
        this.log(logObject, levels.DEBUG);		
	},
	
	info(logObject){
        this.log("INFO: ", levels.INFO, false);
        this.log(logObject, levels.INFO);
	},
	
	warn(logObject){
        this.log("WARN: ", levels.WARN, false);
        this.log(logObject, levels.WARN);
	},
	
	error(logObject){
        this.log("ERROR: ", levels.ERROR, false);
        this.log(logObject, levels.ERROR);
	},
	
	fatal(logObject){
        this.log("FATAL: ", levels.FATAL, false);
        this.log(logObject, levels.FATAL);
	}
}
