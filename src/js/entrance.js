import babelPolyfill from 'babel-polyfill'
import app from './app'
import globalService from './services/global-service'
import ajax from './services/ajax'
import api from "./services/api"
import log from './utils/log'
import utils from './utils/utils'
import directives from "./utils/directives"
import "./components/"
import filters from './utils/filters'
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import routers from "./routers"
import vueApp from "../views/app"
import store from "./store/"
import plugins from './plugins/'
import compatible from './compatible/'

//   如果不是DEV模式或者是打包环境，就设置isDebug为false
if(process.env.NODE_RUN === 1) {
	app.Config.isDebug = true;
}
console.info(process.env);
Object.assign(app.Config, config);
window.app = Object.assign(app, { log, utils, globalService, api, ajax: ajax(), compatible: compatible()});
const initVue = function() {
	/**
     * @param {String}  errorMessage   错误信息
     * @param {String}  scriptURI      出错的文件
     * @param {Long}    lineNumber     出错代码的行号
     * @param {Long}    columnNumber   出错代码的列号
     * @param {Object}  errorObj       错误的详细信息，Anything
     */
	window.onerror = function(errorMessage, scriptURI, lineNumber,columnNumber,errorObj){
       	log.error({errorMessage, scriptURI, lineNumber,columnNumber,errorObj});
	}
	Vue.config.errorHandler = function (err, vm, info) {
		log.error(JSON.stringify({message: "Vue errorHandler:" + err.message, stack: err.stack, type: info}));
	}
    Vue.use(Vuex);
    Vue.use(VueRouter);
    Object.keys(directives).forEach((key) => {
        Vue.directive(key, directives[key]);
    });
    Object.keys(filters).forEach((key) => {
	    Vue.filter(key, filters[key]);
	});
	plugins();
    const [router, VueApp] = [routers.createRouter(VueRouter, store), Vue.extend(vueApp)];
    window.app.vueApp = new VueApp({ router, name: "app", store }).$mount('#app');
    log.init();
}

// 环境兼容初始化vue
app.compatible.initVue(initVue);
