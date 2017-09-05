/**
 * 作者：yujinjin9@126.com
 * 时间：2017-05-23
 * 描述：加载动画插件
 */
import Vue from 'vue';
export default (function(){
	let LoadingConstructor = Vue.extend(require('./views/loading.vue'));
	// 实例
	let loadingInstance = null;
	
	//获取实例
	const getInstance = function(){
		// 如果实例还未创建就创建新实例
		if(!loadingInstance){
			loadingInstance = new LoadingConstructor({
				el: document.createElement('div')
			});
			document.body.appendChild(loadingInstance.$el);
		}
		return loadingInstance;
	}
	
	return {
		install(Vue, options) {
			app = app || {};
			// 显示动画
			app.showLoading = Vue.prototype.$showLoading = function(){
				getInstance().show();
			}
			// 隐藏动画
			app.hideLoading = Vue.prototype.$hideLoading = function(){
				getInstance().hide();
			}
		}
	}
})()
