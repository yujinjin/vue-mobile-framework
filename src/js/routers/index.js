/**
 * 作者：yujinjin9@126.com
 * 时间：2017-02-07
 * 描述：路由配置
 * meta: {
 * 	authType: 0, // 当前页面的登录权限，0: 游客权限（用户微信未登录授权，系统保存用户信息）， 1：访客权限（用户微信已授权，但未注册手机号）， 2： 登录权限（用户已注册手机号） 默认情况下是需要登录注册才能放访问的
 * 	title: "首页", // 当前页面的默认标题，包括页面的title共用
 * 	isDefaultShare: false, // 当前页面是否是默认分享，前端H5页面微信环境都要可以分享，默认是可以分享的，只有设置为false才会在特殊页面写自己的分享
 * 	isDefaultTitle: false, // 当前页面是否显示默认标题，默认情况下都是显示默认标题的，只有设置为false才会在当前页面的header设置为"",页面自己实现更新title
 * 	navbarStatus: {
 * 		isShowHead: false, // 是否显示header，默认是都是显示header的，只有设置为false隐藏header
 * 		isShowShare: false, // 是否显示分享，APP专用
 * 		isAlwaysTransparentHead: true, // 是否让header一直透明，该参数只用于app环境，因为app的header都是透明到不透明之间切换的
 * 		isTranslucent: true, // 是否让header一直透明从状态栏开始，该参数只用于app环境。
 * 		isShowFoot: false // 是否显示底部导航栏,默认为: false
 * 	}
 * }
 */

import globalService from '../services/global-service'
import modules from '../utils/modules'
import test from './test'
import users from './users'
import others from './others'

export default (function(){
    let routers = {
        routes: [{
            path: '/', //首页
            name: "home",
            meta: {
                authType: 0,
                title: "首页",
                navbarStatus: {
                    isShowHead: false,
                    isShowFoot: true
                }
            },
            components: resolve => require(['../../views/home.vue'], function(component) {
                resolve(modules.extend(component));
            })
        }],
        //使用前端路由，当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置，就像重新加载页面那样。
        scrollBehavior(to, from, savedPosition) {
            if(savedPosition) {
                return savedPosition;
            } else {
                return {
                    x: 0,
                    y: 0
                };
            }
            if(to.hash) {
                return {
                    selector: to.hash
                };
            }
        },
        //创建路由
        createRouter(VueRouter, store) {
            var _this = this;
            // 环境兼容创建路由
            app.compatible.routers.createRouter(store);
            var router = new VueRouter({
                //路由列表
                routes: app.compatible.routers.initRoutes(_this.routes), // 环境兼容初始化路由配置
                //使用前端路由，当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置，就像重新加载页面那样。
                scrollBehavior: _this.scrollBehavior,
                //hash: 使用 URL hash 值来作路由。支持所有浏览器，包括不支持 HTML5 History Api 的浏览器。
                //history: 依赖 HTML5 History API 和服务器配置。查看 HTML5 History 模式.
                //abstract: 支持所有 JavaScript 运行环境，如 Node.js 服务器端。如果发现没有浏览器的 API，路由会自动强制进入这个模式。
                mode: 'history',
                //应用的基路径。例如，如果整个单页应用服务在 /app/ 下，然后 base 就应该设为 "/app/"。
                base: "/",
                //全局配置 <router-link> 的默认『激活 class 类名』。参考 router-link.
                linkActiveClass: "router-link-active"
            });
            // 初始化的时候设置当前路由是前进的方向
            store.dispatch("updateDirection", "going");
            const { push, go, replace } = router;
            router.push = function(location) {
                if(!store.state.appData.direction) {
                    store.dispatch("updateDirection", "going");
                }
                push.call(this, location);
            }
            router.go = function(location) {
                if(store.state.appData.direction != "backing") {
                    store.dispatch("updateDirection", "backing");
                }
                if(location > 0) {
                    app.log.error("app 不到万不得已不要用go来前进，这样无法分辨出页面动画的左右切换。");
                    store.dispatch("updateDirection", "going");
                } else {
                    store.dispatch("updateDirection", "backing");
                }
                go.call(this, location);
            }
            router.replace = function(location) {
                if(store.state.appData.direction != "replace") {
                    store.dispatch("updateDirection", "replace");
                }
                replace.call(this, location);
            }
            router.beforeEach((to, from, next) => _this.beforeEach(to, from, next, store));
            router.afterEach((router) => _this.afterEach(router, store));
            return router;
        },
    
        //访问之前的函数
        beforeEach(to, from, next, store) {
            // 不能使用closePopups方法，因为closePopups会触发回调事件，对于mui.alert("xxx", ()=>{this.$router.push(...)})这种方式的代码会造成死循环，其实这也是mui的BUG问题
            // mui.closePopups();
            if(store.state.appData.direction) {
                store.dispatch("updateDirection", store.state.appData.direction);
            } else {
                // 当前没有路由的方向就认为是返回，因为移动端是没有前进按钮的（这个判断也是无奈，如果是手机浏览器就无法解决）
                store.dispatch("updateDirection", "backing");
            }
            // 环境兼容路由钩子执行前函数
            // 如果返回的值为false将中止当前路由
            if(app.compatible.routers.beforeEach(to, from, next, store) == false) {
                return;
            }
            switch(to.name) {
                case 'hybrid':
                    //				if (!app.Config.isApp) {
                    //					app.mui.toast('只能在APP环境下测试协议！', {duration: 2000, type: 'div'});
                    //					if (from.name != "home") {
                    //						next({name: "home"});
                    //					}
                    //					return;
                    //				}
                    break;
                case "login":
                    // 如果当前的用户已经是登录状态了就直接跳过登录页
                    if(globalService.isLogin()) {
                        mui.toast('当前用户已经登录!');
                        setTimeout(() => {
                            next({name: 'home'});
                        }, 1000);
                        return;
                    }
                default:
                    //store.dispatch("updateNavbarStatus", { isShowFoot: false });
                    break;
            }
            app.loadingAnimation.show();
            //app的环境
            if(store.state.appData.headerState) {
                store.dispatch("resetHeader");
            }
            // authType: 0, // 当前页面的登录权限，0: 游客权限（用户微信未登录授权，系统保存用户信息）， 1：访客权限（用户微信已授权，但未注册手机号）， 2： 登录权限（用户已注册手机号） 默认情况下是需要登录注册才能放访问的
            if((to.meta.authType === 1 && !globalService.getLoginUserToken()) || (to.meta.authType !== 0 && to.meta.authType !== 1 && !globalService.isLogin())) {
                next({ name: 'login', query: Object.assign({ toName: to.name }, to.query, (JSON.stringify(to.params) == "{}" ? {} : { toParams: JSON.stringify(to.params)}))});
                return;
            }
    //		if(to.meta.auth !== false && !globalService.isLogin()) {
    //			next({ name: 'login', query: Object.assign({ toName: to.name }, to.query, (JSON.stringify(to.params) == "{}" ? {} : { toParams: JSON.stringify(to.params)}))});
    //			return;
    //		}
            // 如果页面有自己的标题就不要加上默认标题
            if(to.meta.isDefaultTitle === false) { // 如果页面有自己的标题就不要加上默认标题
                store.dispatch("updateNavbarTitle", "");
            } else if(to.meta.title && to.meta.title != store.state.appData.navbarTitle) {
                store.dispatch("updateNavbarTitle", to.meta.title);
            }
            store.dispatch("updateNavbarStatus", Object.assign({
                isShowFoot: false
            }, to.meta.navbarStatus));
            // 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed （确认的）。
            // next(false): 中断当前的导航。如果浏览器的 URL 改变了（可能是用户手动或者浏览器后退按钮），那么 URL 地址会重置到 from 路由对应的地址。
            // next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。
            next();
            //app.loadingAnimation.hide();
            store.dispatch("updateDirection", null);
        },
    
        //可以记录访问路径
        afterEach(router, store) {
            //store.commit('updateLoadingStatus', { isLoading: false })
            let title = "vue移动端-";
            if (router.meta.title) {
                title += "-" + router.meta.title;
            }
            document.title = title;
            // 环境兼容路由钩子执行后函数
            app.compatible.routers.afterEach(router, store);
            // 环境兼容路由钩子执行后函数
            app.compatible.routers.afterEach(router, store);
        }
    }
    
    routers.routes.push(...test(modules));
    routers.routes.push(...users(modules));
    routers.routes.push(...others(modules));
    return routers;
})();
