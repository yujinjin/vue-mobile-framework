/**
 * 作者：yujinjin9@126.com
 * 时间：2017-05-23
 * 描述：微信-微信分享 , app-app微信
 */
export default (function(){
	return {
		install(Vue, options) {
			app = app || {};
			//微信分享 shareTitle|shareLink|shareDes|shareImg
			app.share = Vue.prototype.$share = function({shareTitle='vue 移动端框架', shareLink=window.location.href, shareDes='您好，这是一个vue 移动端框架微信分享测试', shareImg=config.localDomain + require("../../imgs/logo.jpeg"), onShareAppMessageSuccess, onShareTimelineSuccess} = {}, callbackFun){
				app.utils.loadScript("https://res.wx.qq.com/open/js/jweixin-1.2.0.js", "jweixin", function (result) {
					if(!result){
						if(typeof(callbackFun) === "function") callbackFun(false);
						return;
					}
					let [share_link, userKey] = [shareLink, app.globalService.getUserKey()];
					if(userKey) {
						if(share_link.match(/(\?|&)shareKey=([^&]*)/)) {
							share_link = share_link.replace(eval('/(shareKey=)([^&]*)/gi'), 'shareKey=' + userKey);
						} else if(share_link.indexOf('?') == -1) {
							share_link = share_link + '?' + 'shareKey=' + userKey;
						} else {
							share_link = share_link + '&' + 'shareKey=' + userKey;
						}
					}
					app.api.common.weixinconfig({url: window.location.href.split('#')[0]}).then((result) => {
						wx.config({
							debug: false,
							appId: result.appId,
							timestamp: result.timestamp,
							nonceStr: result.nonceStr,
							signature: result.signature,
							jsApiList: ['checkJsApi', 'onMenuShareAppMessage', 'onMenuShareTimeline']
						});
						wx.ready(function() {
							wx.checkJsApi({
			    				jsApiList: ['onMenuShareAppMessage', "onMenuShareTimeline"], // 需要检测的JS接口列表，所有JS接口列表见附录2,
							    success: function(res) {
							    	// 以键值对的形式返回，可用的api值true，不可用为false
							        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
							    	if(res.onMenuShareAppMessage && res.onMenuShareTimeline) {
							    		if(typeof(callbackFun) === "function") callbackFun(false);
							    	}
							    }
							});
							//TODO: 需调试验证
							// 分享给朋友
							wx.onMenuShareAppMessage({
								title: shareTitle,
								desc: shareDes,
								link: share_link,
								imgUrl: shareImg,
								type: '', // music video link
								dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
								success: function() {
									// 用户确认分享后执行的回调函数
									if(onShareAppMessageSuccess && $.isFunction(onShareAppMessageSuccess)) {
										onShareAppMessageSuccess();
									}
								},
								cancel: function() {
									// 用户取消分享后执行的回调函数
								}
							});
							// 分享到朋友圈
							wx.onMenuShareTimeline({
								title: shareTitle,
								link: share_link,
								imgUrl: shareImg,
								success: function() {
									// 用户确认分享后执行的回调函数
									if(onShareTimelineSuccess && $.isFunction(onShareTimelineSuccess)) {
										onShareTimelineSuccess();
									}
								}
							});
						});
						wx.error(function(rwx) {
							if(typeof(callbackFun) === "function") callbackFun(false);
						});
					}).catch(()=>{
						if(typeof(callbackFun) === "function") callbackFun(false);
					});
				});
				app.compatible.share({shareTitle, shareLink, shareDes, shareImg, onShareAppMessageSuccess, onShareTimelineSuccess}, callbackFun);
			}
		}
	}
})();
