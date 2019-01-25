/**
 * 作者：yujinjin9@126.com
 * 时间：2017-03-04
 * 描述：常用API接口
 */
export default {
	//图片上传
	"imageUpload": function(ajaxOptions, inputData) {
		let formData = new FormData();
		if(inputData && typeof(inputData) === "object"){
			for(let key in inputData){
				formData.append(key, inputData[key]);
			}
		}
		if(ajaxOptions && ajaxOptions.isShowLoading) {
			app.showLoading();
		}
		return app.ajax.axios.post(config.uploadImgServer, formData,
			Object.assign({
				headers: {'Content-Type': 'multipart/form-data'}
			}, ajaxOptions)).then((response)=>{
				if(ajaxOptions && ajaxOptions.isShowLoading) {
					app.hideLoading();
				}
				return response;
			}).catch((error)=>{
				if(ajaxOptions && ajaxOptions.isShowLoading) {
					app.hideLoading();
				}
				const xhr = error.response && error.response.data;
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
				return Promise.reject(error);
			});
	},

	wxSDK(jsApiList){
		return new Promise((resolve, reject) => {
			app.utils.loadScript("https://res.wx.qq.com/open/js/jweixin-1.4.0.js", "jweixin", function (result) {
				if(!result){
					reject(false);
					return;
				}
				app.ajax({
					url: app.Config.webapiDomain + "api/weixinconfig",
					params: { url: window.location.href.split('#')[0]}
				}).then((result)=>{
					wx.config({
						debug: false,
						appId: result.appId,
						timestamp: result.timestamp,
						nonceStr: result.nonceStr,
						signature: result.signature,
						jsApiList: jsApiList
					});
					wx.ready(function() {
						resolve(true);
					});
					wx.error(function(rwx) {
						reject(false);
					});
				}).catch(()=>{
					reject(false);
				});
			});
		});
	},

	//微信分享 shareTitle|shareLink|shareDes|shareImg
	wxShare({shareTitle, shareLink, shareDes, shareImg, onShareAppMessageSuccess, onShareTimelineSuccess}, callbackFun) {
		this.wxSDK(['checkJsApi', 'onMenuShareAppMessage', 'onMenuShareTimeline']).then(result => {
			wx.checkJsApi({
				jsApiList: ['onMenuShareAppMessage', "onMenuShareTimeline"], // 需要检测的JS接口列表，所有JS接口列表见附录2,
			    success: function(res) {
			    	// 以键值对的形式返回，可用的api值true，不可用为false
			        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
					// if(res.onMenuShareAppMessage && res.onMenuShareTimeline) {}
			    	if(typeof(callbackFun) === "function") callbackFun(res.errMsg === "checkJsApi:ok");
			    }
			});
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
		}).catch(e => {
			if(typeof(callbackFun) === "function") callbackFun(e);
		});
	},
	
	// log消息
	"sendLogMessage": function(inputData) {
		return Promise.resolve(true);
	},
	
	// 获取当前app中H5和navtive的路由配置
	"queryRoutesList": function(){
		return Promise.resolve([{
			"name": "home",
			"isNative": true
		}, {
			"name": "product-category",
			"isNative": true
		}, {
			"name": "search",
			"isNative": true
		}, {
			"name": "product-brand",
			"isNative": true
		}, {
			"name": "discovery-list",
			"isNative": true
		}, {
			"name": "shopping-cart",
			"isNative": true
		}, {
			"name": "login",
			"isNative": true
		}]);
	}
}