/**
 * 作者：yujinjin9@126.com
 * 时间：2019-01-25
 * 描述：商品路由配置
 */

export default function(modules){
	return [{
		path: '/product-category', //商品分类
		name: "product-category",
		meta: {
			authType: 0,
			title: "商品分类",
            isDefaultShare: false,
            navbarStatus: {
                isShowFoot: true
            }
		},
		components: resolve => require(['../../views/product/product-category.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}, {
		path: '/search', //商品搜索
		name: "search",
		meta: {
			authType: 0,
			title: "搜索页面",
			navbarStatus: {
				isShowHead: false
			}
		},
		components: resolve => require(['../../views/product/search.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}, {
		path: '/product-brand', //商品列表
		name: "product-brand",
		meta: {
			authType: 0,
			title: "商品列表",
			isDefaultShare: false,
			isDefaultTitle: false
		},
		components: resolve => require(['../../views/product/product-brand.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}, {
		path: '/product/product-details/:id', //商品详情
		name: "product-details",
		meta: {
			authType: 0,
			title: "商品详情",
			navbarStatus: {
				isShowHead: true,
				isShowBack: true
			},
			isDefaultShare: false,
			isDefaultTitle: false
		},
		components: resolve => require(['../../views/product/product-details.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}, {
		path: '/shopping-cart', //购物车
		name: "shopping-cart",
		meta: {
			authType: 1,
			navbarStatus: {
				isShowFoot: true
			},
			isDefaultShare: false
		},
		components: resolve => require(['../../views/product/shopping-cart.vue'], function(component) {
			resolve(modules.extend(component));
		})
	}];
}