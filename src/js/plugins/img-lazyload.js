/**
 * 作者：yujinjin9@126.com
 * 时间：2017-07-24
 * 描述：图片懒加载
 */
import vueLazyload from '../lib/vue-lazyload';

export default (function() {
	return {
		install(Vue, options) {
			Vue.use(vueLazyload, Object.assign({
				preLoad: 1.3,
				error: require("../../imgs/error.jpg"),
				loading: require("../../imgs/loading-spin.svg"),
				attempt: 1, //出错时只尝试加载次数
				filter: {
					progressive(listener, options) {
						// 必须把不是设置背景图，就必须把bindType置空不然会被框架设置成样式
						if(listener.bindType != "background-image") {
							listener.size = listener.bindType || listener.size;
							listener.bindType = null;
						}
						listener.src = app.utils.getImageUrl(listener.src, listener.size);
						listener.el.setAttribute('lazy-progressive', 'true');
					},
					webp(listener, options) {
						if(!options.supportWebp) return
					}
				},
//				adapter: {
//					loaded({bindType, el, naturalHeight, naturalWidth, $parent, src, loading, error, Init }) {
//						console.info("loaded...");
//					},
//					loading(listender, Init) {
//						console.log('loading')
//					},
//					error(listender, Init) {
//						console.log('error')
//					}
//				}
			}, options || {}));
		}
	}
})();