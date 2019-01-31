/**
 * 作者：yujinjin9@126.com
 * 时间：2019-01-25
 * 描述：营销活动路由配置
 */
export default function(modules){
	return [{
		path: '/active/code', //活动详情
		name: "active",
		meta: {
            authType: 0,
			title: "活动详情"
		},
		components: resolve => require(['../../views/marketing/active.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}];
}