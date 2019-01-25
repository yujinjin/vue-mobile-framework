/**
 * 作者：yujinjin9@126.com
 * 时间：2018-02-24
 * 描述：测试路由配置
 */

export default function(modules){
	return [{
		path: '/test/hybrid', //hybrid协议测试
		name: "hybrid",
		meta: {
			authType: 0,
			title: "hybrid协议测试"
		},
		components: resolve => require(['../../views/test/hybrid.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}, {
		path: '/test/cl', //清理本地缓存
		name: "clear-localstorage",
		meta: {
			authType: 0,
			title: "清理本地缓存"
		},
		components: resolve => require(['../../views/test/clear-localstorage.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}];
}