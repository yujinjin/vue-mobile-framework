/**
 * 作者：yujinjin9@126.com
 * 时间：2017-05-23
 * 描述：页面转场切换时的动画插件
 */
import Vue from 'vue';
export default (function(){
	let RouterTransitionConstructor = Vue.extend(require('./views/router-transition.vue'));
	// 实例
	let routerTransitionInstance = null;
	
	//获取实例
	const getInstance = function(){
		// 如果实例还未创建就创建新实例
		if(!routerTransitionInstance){
			routerTransitionInstance = new RouterTransitionConstructor({
				el: document.createElement('div')
			});
			document.body.appendChild(routerTransitionInstance.$el);
		}
		return routerTransitionInstance;
	}
	
	return {
		install(Vue, options) {
			app = app || {};
			app.loadingAnimation = Vue.prototype.$loadingAnimation = {
				// 显示
		        show() {
		            getInstance().showTransition();
		        },
		
		        // 隐藏
		        hide() {
		            getInstance().endTransition();
		        }
			}
		}
	}
})()
