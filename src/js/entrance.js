/**
 * 作者：yujinjin9@126.com
 * 时间：2017-02-07
 * 描述：app 入口
 */
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
import constants from './utils/constants'
import dataReport from "./services/data-report"
import MobileMessage from 'mobile-message'
import 'mobile-message/dist/message.css'
import Loading from 'vue-loading-spin'
import 'vue-loading-spin/dist/loading.css'

// 如果不是DEV模式或者是打包环境，就设置isDebug为false
if(!process.env.NODE_ENV && process.env.NODE_RUN !== "0") {
	app.Config.isDebug = true;
}
Object.assign(app.Config, config);
app.initApp(globalService, store);

app = Object.assign(app, { log, utils, globalService, api, ajax: ajax(), compatible: compatible(), constants, message: MobileMessage.get()}, Loading.get());
console.info(app)
const initVue = function() {
	if(!app.Config.isDebug) {
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
	}
	// app.initLocalConfigData(globalService);
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
    app.vueApp = new VueApp({ router, name: "app", store }).$mount('#app');
    log.init();
    window.dataReport = dataReport;
    // 数据上报
    dataReport.init(app);
}

// 环境兼容初始化vue
app.compatible.initVue(initVue);
