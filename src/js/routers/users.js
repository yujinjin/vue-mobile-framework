/**
 * 作者：yujinjin9@126.com
 * 时间：2018-02-24
 * 描述：个人中心路由配置
 */

export default function(modules){
	return [{
		path: '/users/login', //登录-绑定手机
		name: "login",
		meta: {
			authType: 0,
			title: "绑定手机"
		},
		components: resolve => require(['../../views/users/login.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}, {
		path: '/users/user-center', //用户中心
		name: "user-center",
		meta: {
			authType: 1,
			title: "个人中心",
			navbarStatus: {
				isShowFoot: true
			}
		},
		components: resolve => require(['../../views/users/user-center.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}, {
		path: '/users/user-info', //个人资料
		name: "user-info",
		meta: {
			title: "个人资料"
		},
		components: resolve => require(['../../views/users/user-info.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}, {
		path: '/users/choose-coupons', //选择优惠券
		name: "choose-coupons",
		meta: {
			title: "选择优惠券"
		},
		components: resolve => require(['../../views/users/choose-coupons.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}, {
		path: '/users/address/choose-address', //选择地址
		name: "choose-address",
		meta: {
			title: "选择地址"
		},
		components: resolve => require(['../../views/users/address/choose-address.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}, {
		path: '/users/address-manager', //地址管理
		name: "address-manager",
		meta: {
			title: "地址管理"
		},
		components: resolve => require(['../../views/users/address/address-manager.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}, {
		path: '/users/add-or-edit-address', //添加修改地址
		name: "add-or-edit-address",
		meta: {
			title: "修改地址"
		},
		components: resolve => require(['../../views/users/address/add-or-edit-address.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}, {
		path: '/users/message-center', //消息中心
		name: "message-center",
		meta: {
			title: "消息中心",
			isDefaultTitle: false
		},
		components: resolve => require(['../../views/users/message/message-center.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}, {
		path: '/users/message-list/:typeCode', //消息列表
		name: "message-list",
		meta: {
			title: "消息列表",
			isDefaultTitle: false
		},
		components: resolve => require(['../../views/users/message/message-list.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}, {
		path: '/users/message-details/:id', //消息列表
		name: "message-details",
		meta: {
			title: "消息内容"
		},
		components: resolve => require(['../../views/users/message/message-details.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}, {
		path: '/users/system-message-details/:id', // 公告消息详情
		name: "system-message-details",
		meta: {
			title: '公告消息'
		},
		component: resolve => require(['../../views/users/message/system-message-details.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}, {
		path: '/users/my-collections', //我的收藏
		name: "my-collections",
		meta: {
			authType: 1,
			title: "我的收藏"
		},
		components: resolve => require(['../../views/users/my/my-collections.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}];
}
