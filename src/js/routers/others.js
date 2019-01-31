/**
 * 作者：yujinjin9@126.com
 * 时间：2018-02-24
 * 描述：其他路由配置
 */

export default function(modules){
	return [{
		path: '/others/third-part', //第三方站页面
		name: "third-party",
		meta: {
			authType: 0,
			title: "第三方站点"
		},
		components: resolve => require(['../../views/others/third-party.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}, {
		path: '*', //未发现该页面
		name: "notFound",
		meta: {
			authType: 0,
			title: "未发现该页面"
		},
		components: resolve => require(['../../views/others/error/404.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}];
}
