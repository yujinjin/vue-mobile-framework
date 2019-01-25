/**
 * 作者：yujinjin9@126.com
 * 时间：2017-05-12
 * 描述：系统自定义插件入口
 */

import Vue from 'vue'
import modals from "mobile-message"
import routerTransition from "./router-transition"
import share from "./share"
import loading from "vue-loading-spin"
import imgLazyload from "./img-lazyload"
import tooltip from "./tooltip"
import listPullLoading from 'list-pull-loading'
import 'list-pull-loading/dist/list-pull-loading.css'
import MobileMessage from 'mobile-message'
import 'mobile-message/dist/message.css'
import Loading from 'vue-loading-spin'
import 'vue-loading-spin/dist/loading.css'
import queueWaitedDialog from "./queue-waited-dialog"

export default function(){
	Vue.use(modals);
	Vue.use(routerTransition);
	Vue.use(share);
	Vue.use(loading);
	Vue.use(imgLazyload);
	Vue.use(tooltip);
	Vue.use(listPullLoading);
	Vue.use(queueWaitedDialog);
	Vue.use(MobileMessage);
	Vue.use(Loading);
}
