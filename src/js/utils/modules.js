/**
 * 作者：yujinjin9@126.com
 * 时间：2015-03-24
 * 描述：模块控制器
 */
export default {
	/**
	 * 创建一个常用的查询VUE模块
	 * @param {Object} module 模块的对象
	 * @param {String} moduleName 当前模块的名称
	 */
	extend: function(module, moduleName){
		// 如果没有设置当前模块名称，默认为当前的路由名称
		moduleName = moduleName || app.vueApp.$route.name;
		// 本来想用extend，但不能深copy，如果用深copy存在function对象变成object
		let [_clone_module, _init_filter] = [Object.assign(Object.create(Object.getPrototypeOf(module || {})), module), {}];
		//深拷贝，只适用于当前模式主要是为了不破坏module的结构
		let deepCopy = function(target, source) {
			if(target instanceof Object && source instanceof Object){
				for(let key in source) {
					source[key] = deepCopy(target[key], source[key]);
				}
				for(let key in target) {
					if(!source.hasOwnProperty(key)) source[key] = target[key];
				}
			} else if(target instanceof Array && source instanceof Array) {
				for(let i = 0; i < source.length; i ++) {
					source[i] = deepCopy(target[i], source[i]);
				}
				if(target.length > source.length) {
					for(let i = source.length; i <　target.length;　i++) {
						source[i] = target[i];
					}
				}
			}
			return source;
		}
		let copy = function(source){
			let target;
			if(source instanceof Object){
				target = {};
				for(let key in source) {
					target[key] = copy(source[key]);
				}
			} else if(source instanceof Array) {
				target = [];
				for(let i = 0; i < source.length; i ++) {
					target[i] = copy(source[i]);
				}
			} else if(source instanceof Date) {
				target = new Date(source.getTime());
			} else {
				target = source;
			}
			return target;
		}
		let _common = {}
		let [_mounted, _beforeRouteUpdate, _beforeRouteEnter]= [_clone_module.mounted, _clone_module.beforeRouteUpdate, _clone_module.beforeRouteEnter];
		_clone_module.mounted = function(){
			if(_mounted) {
				Promise.all([_mounted.call(this)]).then(()=>{
					app.loadingAnimation.hide();
				}).catch(()=>{app.loadingAnimation.hide();});
			} else {
				app.loadingAnimation.hide();
			}
			if(this.$route.meta.isDefaultShare != false) {
				this.$share();
			}
		}
		_clone_module.beforeRouteUpdate = function(to, from, next){
			if(_beforeRouteUpdate) {
				Promise.all([_beforeRouteUpdate.call(this, to, from, next)]).then(()=>{
					app.loadingAnimation.hide();
				}).catch(()=>{app.loadingAnimation.hide();});
			} else {
				next();
				app.loadingAnimation.hide();
			}
		}
		return deepCopy(_common, _clone_module);
	}
}
