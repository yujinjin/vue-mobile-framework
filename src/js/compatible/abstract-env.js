/**
 * 作者：yujinjin9@126.com
 * 时间：2016-03-03
 * 描述：H5环境抽象类
 */
export default class abstractEnv {
	// 构造器
	constructor() {}
	
	// 初始化vueApp初始化
	initVue(initVueFun){
		initVueFun();
	}
	
	// 路由
	routers = {
		// 初始化routes配置
		initRoutes(routes){
			return routes;
		},
		//创建路由
		createRouter(store){},
		//路由访问之前的钩子函数
		beforeEach(to, from, next, store){},
		afterEach(router, store){}
	}
	
	// vuex store
	store = {
		//修改导航标题
		updateNavbarTitle(title){},
		
		//修改导航状态
		updateNavbarStatus(oldNavbar, newNavbar){},
		
		//修改头部导航
		updateHeader(header){},
		
		//重置header内容
		resetHeader(){}
	}
	
	// 分享
	share({shareTitle, shareLink, shareDes, shareImg, onShareAppMessageSuccess, onShareTimelineSuccess}, callbackFun){
		if(callbackFun && typeof(callbackFun) === "function"){
			callbackFun(true);
		}
	}
	
	// 通过事件触发分享
	shareEvent(shareInfo, callbackFun, isChange, shareEventInstance){
		app.message.warning("请在微信或APP里分享");
	}
}
