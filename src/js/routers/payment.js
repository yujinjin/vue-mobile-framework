/**
 * 作者：yujinjin9@126.com
 * 时间：2019-01-25
 * 描述：支付路由配置
 */
export default function(modules){
	return [{
		path: '/payment/pay/:orderNumber', //支付中心
		name: "pay",
		meta: {
			title: "支付中心",
			isDefaultShare: false
		},
		components: resolve => require(['../../views/payment/pay.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}, {
		path: '/payment/alipay-wap', // 阿里支付
		name: "alipay-wap",
		meta: {
			title: "支付宝支付",
			isDefaultShare: false,
			authType: 0
		},
		component: resolve => require(['../../views/payment/alipay-wap.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}, {
		path: '/payment/alipay-wap-async', //支付宝支付后提示
		name: "alipay-wap-async",
		meta: {
			title: "支付提示",
			navbarStatus: {
				isShowHead: false
			},
			isDefaultShare: false,
			authType: 0
		},
		component: resolve => require(['../../views/payment/alipay-wap-async.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}, {
		path: '/payment/weixin-wap-async', //微信支付(在H5环境，微信支付完成后的异步页面)
		name: "weixin-wap-async",
		meta: {
			title: "微信支付确认",
			navbarStatus: {
				isShowHead: false
			},
			isDefaultShare: false
		},
		component: resolve => require(['../../views/payment/weixin-wap-async.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}, {
		path: '/payment/pay-success', //支付成功
		name: "payment-success",
		meta: {
			title: "支付成功",
			navbarStatus: {
				isShowHead: false
			},
			isDefaultShare: false
		},
		components: resolve => require(['../../views/payment/payment-success.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}, {
		path: '/payment/payment-failure', //支付失败
		name: "payment-failure",
		meta: {
			title: "支付失败",
			navbarStatus: {
				isShowHead: false
			},
			isDefaultShare: false
		},
		components: resolve => require(['../../views/payment/payment-failure.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}];
}