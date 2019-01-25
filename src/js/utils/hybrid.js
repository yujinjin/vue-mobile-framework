/**
 * 作者：yujinjin9@126.com
 * 时间：2017-04-01
 * 描述：hybrid
 */
import base64 from "./base64";

module.exports = (function(){
	//底层的协议对象
	const underlying = {
		//scheme 名称
		scheme: "www://",
		//全局回调函数名称
		webviewFunName: "jk724Fun",
		
		//获取app的基本信息
		getAppInfo(){
			var ua = window.navigator.userAgent.toLocaleLowerCase();
			//na.match();
		},
		
		/**
		 * 发送请求访问native的url
		 * @param url 请求的URL
		 */
		sendBridgeMsg(url){
			var iframe = document.createElement("IFRAME");
	        iframe.style.cssText = "display:none;border:0;width:0;height:0;";
	        iframe.setAttribute("src", url);
	        document.documentElement.appendChild(iframe);
	        setTimeout(()=>{
	        	iframe.parentNode.removeChild(iframe);
	        	iframe = null;
	        }, 1000)
		},
	
		/**
	     * 把请求的协议Json数据对象生成加密后处理成scheme格式
	     * @param agreement 协议对象
	     */
		generateNativeUrl(agreement){
			let [_this, url, paramStr] = [underlying, underlying.scheme + agreement.tagname + '?t=' + new Date().getTime(), ""];
			if(agreement.callback) {
				url += '&callback=' + agreement.callback;
			}
			if(agreement.param) {
				paramStr = typeof agreement.param == 'object' ? JSON.stringify(agreement.param) : agreement.param;
				url += '&param=' + encodeURIComponent(encodeURIComponent(base64.encode(paramStr)));
			}
			return url;
		},
		
		/**
	     * webkit 发送消息协议
	     * @param agreement 协议对象
	     */
		webkitPostMessage(agreement){
			if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.health && window.webkit.messageHandlers.health.postMessage) {
				window.webkit.messageHandlers.health.postMessage(JSON.stringify(Object.assign({service: "JKPlugin_native"}, agreement)));
			} else {
				app.log.error("webkit 发送消息协议对象不存在");
			}
		},
		
		/**
	     * 动态生成window函数
	     * @param agreement 协议对象
	     */
		generatorWebviewFun(callback, isDelete=true){
			if(!callback || typeof(callback) !== "function") {
				callback = function(data) {
					app.log.info(data);
				}
			}
			const randomId = "jk724_" + app.utils.generateRandomId();
			window[underlying.webviewFunName][randomId] = function(result){
				this.callback = randomId;
				if(callback && typeof(callback) === "function") {
					callback.call(this, result);
				}
				if(isDelete) {
					delete window[underlying.webviewFunName][randomId];
				}
			}
			return randomId;
		},
		
		/**
		 * 清除当前Webview下的回调函数
		 */
		clearWebviewFun(){
			for(let key in window[underlying.webviewFunName]) {
				delete window[underlying.webviewFunName][key];
			}
		},
		
		/**
	     * 根据协议请求app
	     * @param agreement 协议对象
	     * @return 回调函数ID
	     */
		requestHybrid(agreementName, param, callback){
			//console.info("协议对象:" + agreementName);
			if(!agreementName || !agreementName) {
				app.log.error("错误的请求协议，请检查协议的内容...");
				return;
			}
			//生成唯一执行函数，执行后销毁
			const [_this, agreement] = [underlying, {tagname: agreementName}];
			agreement.callback = _this.generatorWebviewFun(callback);
			if(param){
				agreement.param = param;
			}
			if(window.webkit){
				_this.webkitPostMessage(agreement);
			} else {
				_this.sendBridgeMsg(_this.generateNativeUrl(agreement));
			}
			return agreement.callback;
		},
		
		init(){
			window[underlying.webviewFunName] = window[underlying.webviewFunName] || {};
			// 定义固定函数，主要是用于native主动回调H5的方法
			window[underlying.webviewFunName].common = function(dataInfo){
				try {
					dataInfo = JSON.parse(dataInfo);
				} catch(e){
					app.log.error("解析app的协议失败:" + e.message + "协议内容：" + dataInfo);
				}
				if(dataInfo.tagname) {
					app.log.error("app的格式不正确，协议内容：" + JSON.stringify(dataInfo));
				}
				if(dataInfo.tagname === "login") {
					// native 登录
					let userInfo = dataInfo.param;
					app.globalService.setUserInfo({
						referralCode: userInfo.referralCode, 
						token: userInfo.authToken, 
						expiredTime: userInfo.expiredIn, 
						info: userInfo.userInfo,
						isBindMobile: true
					}, false);
				} else if(dataInfo.tagname === "logout") {
					// native 登出
					app.globalService.logOut();
				}
			}
			underlying.getAppInfo();
		}
	}
	
	underlying.init();
	
	return {
		// H5向前跳转navtive页面
		forward(param, callbackFun){
			if(!param || !param.topage){
				app.log.error({message: "H5向前跳转navtive页面协议内容错误", param});
				return;
			}
			param.type = param.type || "native";
			return underlying.requestHybrid("forward", param, callbackFun);
		},
		
		// H5向前跳转navtive页面
		back(param={}, callbackFun){
			if(!param){
				app.log.error({message: "H5向后跳转navtive页面协议内容错误", param});
				return;
			}
			return underlying.requestHybrid("back", param, callbackFun);
		},
		
		// header标题更新（针对于简单的更新title内容）
		updateHeaderTitle(title, callbackFun){
			//underlying.requestHybrid("updateheadertitle", {title}, callbackFun);
			return this.updateHeaderCenter({
				actions: 'title',
				value: title
			}, callbackFun);
		},
		
		// 更新Header左边内容
		updateHeaderLeft(param, callbackFun){
			if(!param || !param.actions) {
				app.log.error({message: "header左边内容更新协议错误", param});
				return;
			}
			if(param && param.callback && typeof(param.callback) === "function") {
				param.callback = underlying.generatorWebviewFun(param.callback, false);
			}
			return underlying.requestHybrid("updateheaderleft", param, callbackFun);
		},
		
		// 更新Header中间内容
		updateHeaderCenter(param, callbackFun){
			if(!param || !param.actions) {
				app.log.error({message: "header中间内容更新协议错误", param});
				return;
			}
			if(param && param.callback && typeof(param.callback) === "function") {
				param.callback = underlying.generatorWebviewFun(param.callback, false);
			}
			return underlying.requestHybrid("updateheadercenter", param, callbackFun);
		},
		
		// 更新Header中间内容
		updateHeaderRight(param, callbackFun){
			if(!param || !param.actions) {
				app.log.error({message: "header右边内容更新协议错误", param});
				return;
			}
			if(param && param.callback && typeof(param.callback) === "function") {
				param.callback = underlying.generatorWebviewFun(param.callback, false);
			}
			return underlying.requestHybrid("updateheaderright", param, callbackFun);
		},
		
		// 更新Header透明度 opacity: 透明度数, translucent:是否是从状态开始
		updateHeaderOpacity({opacity=0} = {}, callbackFun){
			return underlying.requestHybrid("updateheaderopacity", {opacity}, callbackFun);
		},
		
		// header标题更新（针对于复杂的header,目前只考虑左、中、右的图标显示）
		updateHeader(param, callbackFun){
			if(!param || (!param.left && !param.center && !param.right && typeof(param.opacity) != "number")){
				app.log.error({message: "header标题更新协议内容错误", param});
				return;
			}
			let _callback = {};
			if(param.left) {
				_callback.left = this.updateHeaderLeft(param.left, (param.center || param.right) ? null:callbackFun);
			}
			if(param.center) {
				_callback.center = this.updateHeaderCenter(param.center, param.right ? null:callbackFun);
			}
			if(param.right) {
				_callback.right = this.updateHeaderRight(param.right, callbackFun);
			}
			return _callback;
//			if(param.left && param.left.callback && typeof(param.left.callback) === "function") {
//				param.left.callback = underlying.generatorWebviewFun(param.left.callback, false);
//			}
//			if(param.center && param.center.callback && typeof(param.center.callback) === "function") {
//				param.center.callback = underlying.generatorWebviewFun(param.center.callback, false);
//			}
//			if(param.right && param.right.callback && typeof(param.right.callback) === "function") {
//				param.right.callback = underlying.generatorWebviewFun(param.right.callback, false);
//			}
//			underlying.requestHybrid("updateheader", param, callbackFun);
		},
		
		// 显示header
		showHeader({translucent=true} = {}, callbackFun){
			return underlying.requestHybrid("showheader", {translucent}, callbackFun);
		},
		
		// 隐藏header
		hideHeader({animate = true} = {}, callbackFun){
			return underlying.requestHybrid("hideheader", {animate}, callbackFun);
		},
		
		// 修改底部导航显示|隐藏状态
		updateFooterState({isShow=false} = {}, callbackFun){
			return underlying.requestHybrid("updatefooterstate", {isShow}, callbackFun);
		},
		
		// 显示加载层
		showLoading({isMask=true} = {}){
			return underlying.requestHybrid("showLoading", {isMask}, null);
		},
		
		// 关闭加载层
		hideLoading(){
			return underlying.requestHybrid("hideLoading", null, null);
		},
		
		// toast消息框
		showToast(param, callbackFun){
			param = param || {};
			if(!param.timer) {
				param.timer = 2000;
			}
			return underlying.requestHybrid("showToast", param, callbackFun);
		},
		
		// 用户登录
		login(param, callbackFun){
			if(!param || (!param.userName && !param.token && !param.expiredTime)){
				app.log.error({message: "用户登录协议内容错误", param});
				return;
			}
			return underlying.requestHybrid("login", param, callbackFun);
		},
		
		// 用户登出
		logout(callbackFun){
			return underlying.requestHybrid("logout", null, callbackFun);
		},
		
		// 获取用户登录信息
		getUserInfo(callbackFun){
			if(!callbackFun || typeof(callbackFun) != "function") {
				app.log.error({message: "获取用户登录信息内容错误", param: callbackFun});
				return;
			}
			return underlying.requestHybrid("getUserInfo", null, callbackFun);
		},
		
		// 用户分享
		share({title='要健康，上724', desc='健康中国，从自我保健开始，您的健康，从724开始', img=app.utils.getLocalImageUrl(), url=window.location.href}={}, callbackFun){
			if(!title && !desc && !img && !url){
				app.log.error({message: "用户分享协议内容错误"});
				return;
			}
			return underlying.requestHybrid("share", {title, desc, img, url}, callbackFun);
		},
		
		// 用户海报分享协议
		sharePoster({img = ""}, callbackFun){
			if(!img){
				app.log.error({message: "用户海报分享协议"});
				return;
			}
			return underlying.requestHybrid("sharePoster", {img}, callbackFun);
		},
		
		// 显示管理师发布文章、视频的弹窗
		showManagersReleasePopup(){
			return underlying.requestHybrid("showmanagersreleasepopup", {title, desc, img, url}, callbackFun);
		},
		
		// 设置数据存储
		setStorage(param, callbackFun){
			if(!param || (!param.name && !param.data)){
				app.log.error({message: "设置数据存储协议内容错误", param});
				return;
			}
			return underlying.requestHybrid("setstorage", param, callbackFun);
		},
		
		// 获取数据存储值
		getStorage(param, callbackFun){
			if(!param || !param.name || typeof(callbackFun) != "function"){
				app.log.error({message: "获取数据存储值协议内容错误", param});
				return;
			}
			return underlying.requestHybrid("getstorage", param, callbackFun);
		},
		
		// 移除数据存储值
		removeStorage(param, callbackFun){
			if(!param || !param.name){
				app.log.error({message: "移除数据存储值协议内容错误", param});
				return;
			}
			return underlying.requestHybrid("removestorage", param, callbackFun);
		}, 
		
		// 更新native数据 actions:sport-days|chooseCouponsIdList|isAgreeJk724Agreement
		updateNativeData(param, callbackFun){
			if(!param || !param.actions){
				app.log.error({message: "更新native数据协议内容错误", param});
				return;
			}
			return underlying.requestHybrid("updatenativedata", param, callbackFun);
		},
		
		// 获取native数据 actions:orderPreviewTotalPrice|orderPreviewProductIdList|sessionId|cookieId
		getNativeData(param, callbackFun){
			if(!param || !param.actions){
				app.log.error({message: "获取native数据协议内容错误", param});
				return;
			}
			return underlying.requestHybrid("getnativedata", param, callbackFun);
		},
		
		//清除webview下的回调函数
		clearWebviewFun(){
			underlying.clearWebviewFun();
		}
	}
})();
