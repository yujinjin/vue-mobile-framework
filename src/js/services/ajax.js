/**
 * 作者：yujinjin9@126.com
 * 时间：2017-03-29
 * 描述：交互式数据请求
 */
import axios from 'axios'
import globalService from './global-service'

export default function(){
	//axios.defaults.baseURL = 'https://api.example.com';
	//axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
	const instance = axios.create({
		// 是否让框架自动显示错误提示信息
		isShowError: true,
		//是否处理返回的response数据，默认系统框架会处理数据
		isResultData: true, 
		//请求成功
		success: null,
		//请求失败
		error: null,
		// 将被添加到`url`前面，除非`url`是绝对的。
   		baseURL: config.webapiDomain,
   		//是发出请求时使用的请求方法
		method: 'post',
		//请求超时时间
   		timeout: 30000,
   		//服务器返回的数据类型
   		responseType: 'json',
   		//定义允许的http响应内容的最大大小
		maxContentLength: 200000,
		// 允许返回的数据传入then/catch之前进行处理
		transformResponse: [function (data) {
    		return data;
  		}],
		// `auth'表示应该使用 HTTP 基本认证，并提供凭据。
		// 这将设置一个`Authorization'头，覆盖任何现有的`Authorization'自定义头，使用`headers`设置。
		//auth: {},
		//指示是否跨站点访问控制请求,应该是用证书
		withCredentials: false, 
		validateStatus: function (status) {
		    return status >= 200 && status < 300; // default
		},
		//作为请求主体发送的数据,仅适用于请求方法“PUT”，“POST”和“PATCH”
		// data: {},
		//作为get请求数据参数对象
		params: {},
		//要发送的自定义 headers,{'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/x-www-form-urlencoded'},
		headers: {'Content-Type': 'application/json'},
	});
	//添加请求拦截器
	instance.interceptors.request.use(function (config) {
	    //在发送请求之前做某事
	    if(globalService.getLoginUserToken()){
	    	config.headers["Authorization"] = globalService.getLoginUserToken();
	    }
	    if(app.Config.isApp) {
	    	config.headers["Abplus-SysCode"] = app.Config.device.isIOS ? 'IPhone':'Android';
	    	// 国产一期时候发现身份证号、姓名app要兼容老版本，但H5不用所以把这个注释掉，指定所有H5的调用全部用最新版本号
	    	//config.headers["Abplus-ClientVersion"] = app.Config.version;
	    }
	    config.headers["Abplus-ClientVersion"] = app.Config.innerVersion;
	    //如果配置传入显示加载选项就显示加载项
	    if(config.isShowLoading === true) {
	    	config.showLoadingTimerId = setTimeout(()=>app.showLoading(), 300);
	    }
	    return config;
	}, function (error) {
		if(error.config){
	    	// 直接JSON error对象在app环境中会报错，现在只能做config、xhr实例
	    	app.log.error("接口出错:"+JSON.stringify({config: error.config}));
	    }
	    //请求错误时做些事
	    return Promise.reject(error);
	});
	//添加响应拦截器
	instance.interceptors.response.use(function (response) {
	    //对响应数据做些事
	    let _response = response, isSuccess = true;
	    if(response.config.isResultData === false){
	    	_response = response;
	    } else if(response.data && response.data.success){
	    	_response = response.data.result;
	    }
	    if(response.config.isShowError && response.data && response.data.success === false) {
	    	isSuccess = false;
	    	if(response.data.error && response.data.error.message){
		    	app.modals.error(response.data.error.message);
		    } else {
		    	app.modals.error("小七带着服务器去保养喽，请稍后重试~");
		    }
		    app.log.error("接口出错:"+JSON.stringify(response.data.error));
	    }
	    if(isSuccess && typeof response.config.success === "function"){
	    	response.config.success(_response);
	    } else if(!isSuccess && typeof response.config.error === "function") {
	    	response.config.error(_response);
	    }
	    //如果配置传入显示加载选项就显示加载项
	    if(response.config.isShowLoading === true) {
	    	if(response.config.showLoadingTimerId) {
	    		clearTimeout(response.config.showLoadingTimerId);
	    	}
	    	app.hideLoading();
	    }
	    return _response;
	}, function (error) {
		if(error.response && error.response.status === 503) {
			// 状态503做特殊处理
			app.showQueueWaitedDialog();
			return Promise.reject(error);
		}
	    //请求错误时做些事
	    //app.log.debug(error);
	    const xhr = error.response && error.response.data;
	    if(error.config.isShowError) {
		    if (xhr && xhr.__abp && xhr.error) {
		    	if(xhr.error.message) {
		    		app.modals.error(xhr.error.message);
		    	} else if (xhr.error.validationErrors) {
	                var validationErrors = xhr.error.validationErrors;
	                var messages = "";
	                for (var i = 0; i < validationErrors.length; i++) {
	                    messages = messages + validationErrors[i].message + " ";
	                }
	                app.modals.error(messages);
	            }
	        } else {
	        	app.modals.error("小七带着服务器去保养喽，请稍后重试~");
	        }
	    }
	    if(typeof(error.config.error) === "function") {
	    	error.config.error(error);
	    }
	    //如果配置传入显示加载选项就显示加载项
	    if(error.config.isShowLoading === true) {
	    	if(error.config.showLoadingTimerId) {
	    		clearTimeout(error.config.showLoadingTimerId);
	    	}
	    	app.hideLoading();
	    }
	    if(error.config){
	    	// 直接JSON error对象在app环境中会报错，现在只能做config、xhr实例
	    	app.log.error("接口出错:"+JSON.stringify({config: error.config, data: xhr}));
	    }
	    return Promise.reject(error);
	});
	instance.axios = axios;
	return instance;
}
