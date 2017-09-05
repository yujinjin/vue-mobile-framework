/**
 * 作者：yujinjin9@126.com
 * 时间：2017-01-19
 * app数据管理
 */
export default {
	state: {
		isLoading: false,
		// direction: 'forward',
		direction: null, //going：前进|backing后退|replace
		transition: "next", //动画方向
		navbarTitle: "首页", //app的导航页标题
		isShowHead: true, //是否显示app 的导航栏
		isShowFoot: false, //是否显示foot栏
		headerOpacity: 1, // 默认1, header透明度，该参数只用于app环境，这里要和header里的opacity分开
		isTranslucent: true, // 是否让header一直从状态栏开始，APP专用，目前是对iOS有效，这里要和header里的translucent分开
		isShowAppShare: false, // 是否显示App分享，APP专用
		headerState: false, // header修改状态 主要用于判断页面重置修改的header状态
		locationInfo: {
		}, //app临时数据
		header: {
			left: {
				actions: 'back', // 动作协议，作用于APP
				icon: "back", // native图标，作用于APP
				value: "", // native文案，作用于APP
				className: "mui-icon-back", // 左边class名称
				isShow: true, // 是否显示
				contents: "", // 左边标签内容
				callback: null, // 左边回调函数
			},
			center: {
				actions: 'title', // 动作协议，作用于APP
				icon: "", // native图标，作用于APP
				value: "", // native文案，作用于APP
				className: null, // 中部class名称
				isShow: true, // 是否显示
				contents: "", // 中部标签内容
				callback: null // 中部回调函数
			},
			right: {
				actions: "", // 动作协议，作用于APP
				icon: "", // native图标，作用于APP
				value: "", // native文案，作用于APP
				className: null, // 右边class名称
				isShow: false, // 是否显示
				contents: "", // 右边标签内容
				callback: null, // 右边回调函数
			},
			opacity: 1, //头部透明度
			translucent: true // 是否是从状态栏开始，作用于APP
		} //头部标签对象
	},
	mutations: {
		updateLoadingStatus(state, payload) {
			state.isLoading = payload.isLoading
		},
		//修改app临时数据
		updateLocationInfo(state, {key, value}) {
			state.locationInfo[key] = value;
		},
		//修改导航标题
		updateNavbarTitle(state, navbarTitle) {
			state.header.center.contents = navbarTitle;
			state.navbarTitle = navbarTitle;
			// 环境兼容修改导航标题
			app.compatible.store.updateNavbarTitle(navbarTitle);
		},
		//修改导航状态
		updateNavbarStatus(state, {isShowHead = true, isShowFoot = true, isTranslucent, headerOpacity} = {}) {
			// 环境兼容修改导航状态
			if(isShowHead) {
				if(typeof(isTranslucent) === "undefined") isTranslucent = true;
				if(typeof(headerOpacity) === "undefined") headerOpacity = 1;
			} else {
				isTranslucent = false;
				if(typeof(headerOpacity) === "undefined") headerOpacity = 0;
			}
			app.compatible.store.updateNavbarStatus({isShowFoot: state.isShowFoot, isShowHead: state.isShowHead, isTranslucent: state.isTranslucent, headerOpacity: state.headerOpacity}, {isShowFoot, isShowHead, isTranslucent, headerOpacity});
			if (state.isShowHead != isShowHead) {
				state.isShowHead = isShowHead;
			}
			if (state.isShowFoot != isShowFoot) {
				state.isShowFoot = isShowFoot;
			}
			if (state.isTranslucent != isTranslucent) {
				state.isTranslucent = isTranslucent;
			}
			if (state.headerOpacity != headerOpacity) {
				state.headerOpacity = headerOpacity;
			}
		},
		//修改路由的方向
		updateDirection(state, direction = "going") {
			state.direction = direction;
			if (direction) {
				// state.transition = (direction === "backing" ? "prev" : "next");
				state.transition = (direction === "backing" ? "prev" : "next");
			}
		},
		//修改动画Transition
		updateTransition(state, transition) {
			state.transition = transition;
		},
		// 修改是否显示分享状态
		updateShowAppShareStatus(state, isShowAppShare){
			if (state.isShowAppShare != isShowAppShare) {
				state.isShowAppShare = isShowAppShare;
			}
		},
		//修改头部导航
		updateHeader(state, {left, center, right, opacity, translucent}) {
			state.headerState = true;
			if (left && typeof(left) === "object") {
				state.header.left.className = left.className || null;
				state.header.left.isShow = (left.isShow == false ? false : true);
				state.header.left.contents = left.contents || "";
				state.header.left.actions = left.actions || "";
				state.header.left.icon = left.icon || "";
				state.header.left.value = left.value || "";
				state.header.left.callback = left.callback || null;
			}
			if (center && typeof(center) === "object") {
				state.header.center.className = center.className || null;
				state.header.center.isShow = (center.isShow == false ? false : true);
				state.header.center.contents = center.contents || "";
				state.header.center.actions = center.actions || "";
				state.header.center.icon = center.icon || "";
				state.header.center.value = center.value || "";
				state.header.center.callback = center.callback || null;
			}
			if (right && typeof(right) === "object") {
				state.header.right.className = right.className || null;
				state.header.right.isShow = (right.isShow == true ? true : false);
				state.header.right.contents = right.contents || "";
				state.header.right.actions = right.actions || "";
				state.header.right.icon = right.icon || "";
				state.header.right.value = right.value || "";
				state.header.right.callback = right.callback || null;
			}
			if (opacity || typeof(opacity) === "number") {
				state.header.opacity = opacity;
			}
			if(typeof(translucent) === "boolean") {
				state.header.translucent = translucent;
			}
			// 环境兼容修改导航状态
			app.compatible.store.updateHeader(app.utils.extend({}, state.header));
		},
		//重置header内容
		resetHeader(state) {
			state.header = {
				left: {
					actions: 'back', // 动作协议，作用于APP
					icon: "back", // native图标，作用于APP
					value: "", // native文案，作用于APP
					className: null, // 左边class名称
					isShow: true, // 是否显示
					contents: "", // 左边标签内容
					callback: null, // 左边回调函数
				},
				center: {
					actions: 'title', // 动作协议，作用于APP
					icon: "", // native图标，作用于APP
					value: "", // native文案，作用于APP
					className: null, // 中部class名称
					isShow: true, // 是否显示
					contents: "", // 中部标签内容
					callback: null // 中部回调函数
				},
				right: {
					actions: '', // 动作协议，作用于APP
					icon: "", // native图标，作用于APP
					value: "", // native文案，作用于APP
					className: null, // 右边class名称
					isShow: false, // 是否显示
					contents: "", // 右边标签内容
					callback: null, // 右边回调函数
				},
				opacity: 1, //头部透明度
				translucent: true // 是否是从状态栏开始，作用于APP
			};
			state.isShowHead = true;
			state.headerOpacity = 1;
			state.isTranslucent = true;
			state.headerState = false;
			// 环境兼容修改导航状态
			app.compatible.store.resetHeader(app.utils.extend({}, state.header));
		}
	},
	actions: {
		updateLocationInfo({commit}, {key, value}) {
			commit("updateLocationInfo", {key, value});
		},
		updateNavbarTitle({commit}, navbarTitle) {
			commit("updateNavbarTitle", navbarTitle);
		},
		updateNavbarStatus({commit}, navbarStatusObject) {
			commit("updateNavbarStatus", navbarStatusObject);
		},
		updateShowAppShareStatus({commit}, isShowAppShare){
			commit("updateShowAppShareStatus", isShowAppShare);
		},
		updateDirection({commit}, direction) {
			commit("updateDirection", direction);
		},
		updateTransition({commit}, transition) {
			commit("updateTransition", transition);
		},
		updateHeader({commit}, header) {
			commit("updateHeader", header);
		},
		resetHeader({commit}) {
			commit("resetHeader");
		}
	}
}
