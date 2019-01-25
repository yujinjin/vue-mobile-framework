/**
 * 作者：yujinjin9@126.com
 * 时间：2017-05-23
 * 描述：微信-微信分享 , app-app微信
 */
import ShareEvent from './views/share-event.vue'

export default (function(){

	// 分享的事件
	let ShareEventConstructor = null, shareEventInstance = null;

	return {
		install(Vue, options) {
			app = app || {};
			app.share = Vue.prototype.$share = function({shareTitle, shareLink=window.location.href, shareDes, shareImg, onShareAppMessageSuccess, onShareTimelineSuccess} = {}, callbackFun){
				let invitationCode = null;
				if(!shareTitle) shareTitle = '要健康，上724';
				if(!shareDes) shareDes = '健康中国，从自我保健开始，您的健康，从724开始';
				if(!shareImg) shareImg = app.utils.getLocalImageUrl();
				// 如果当前用户是已登录状态就加入用户的邀请码
				if(app.globalService.isLogin()) {
					invitationCode = app.globalService.getStoreLoginUserInfo().referralCode;
				} else {
					// 如果用户未登录就获取之前别人分享过来的邀请码
					invitationCode = app.globalService.getInvitationCode();
				}
				if(invitationCode){
					if(shareLink.match(/(\?|&)icd=([^&]*)/)) {
						shareLink = shareLink.replace(eval('/(icd=)([^&]*)/gi'), 'icd=' + invitationCode);
					} else if(shareLink.indexOf('?') == -1) {
						shareLink = shareLink + '?' + 'icd=' + invitationCode;
					} else {
						shareLink = shareLink + '&' + 'icd=' + invitationCode;
					}
				}
				app.compatible.share({shareTitle, shareLink, shareDes, shareImg, onShareAppMessageSuccess, onShareTimelineSuccess}, callbackFun);
			}

			/**
			 * 通过事件触发分享
			 * @param {Boolean} isChange 微信环境下是否触发分享
			 */ 
			app.shareEvent = Vue.prototype.$shareEvent = function({shareTitle, shareLink=window.location.href, shareDes, shareImg, onShareAppMessageSuccess, onShareTimelineSuccess} = {}, isChange=false, callbackFun){
				if(!ShareEventConstructor) {
					ShareEventConstructor = Vue.extend(ShareEvent);
				}
				if(!shareEventInstance) {
					shareEventInstance = new ShareEventConstructor({
						el: document.createElement('div')
					});
					shareEventInstance.onClose = function(){
						if(shareEventInstance) {
							shareEventInstance.destroy();
							shareEventInstance.$el.parentNode.removeChild(shareEventInstance.$el)
							shareEventInstance = null;
						}
					}
					document.body.appendChild(shareEventInstance.$el);
				}
				app.compatible.shareEvent({shareTitle, shareLink, shareDes, shareImg, onShareAppMessageSuccess, onShareTimelineSuccess}, callbackFun, isChange, shareEventInstance);
			}
		}
	}
})();
