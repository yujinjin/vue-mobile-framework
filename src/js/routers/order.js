/**
 * 作者：yujinjin9@126.com
 * 时间：2019-01-25
 * 描述：订单路由配置
 */
export default function(modules){
	return [{
		path: '/order/order-confirmation', //确认订单
		name: "order-confirmation",
		meta: {
			title: "确认订单"
		},
		components: resolve => require(['../../views/order/order-confirmation.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}, {
		path: '/order-list', //我的订单
		name: "order-list",
		meta: {
			title: "我的订单"
		},
		components: resolve => require(['../../views/order/order-list.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}, {
		path: '/order/order-details/:orderNumber', //订单详情
		name: "order-details",
		meta: {
			title: "订单详情"
		},
		components: resolve => require(['../../views/order/order-details.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}];
}