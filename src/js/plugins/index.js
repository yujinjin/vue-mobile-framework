/**
 * 作者：yujinjin9@126.com
 * 时间：2017-05-12
 * 描述：系统自定义插件入口
 */

import Vue from 'vue'
import modals from "./modals"
import routerTransition from "./router-transition"
import share from "./share"
import loading from "./loading"
import imgLazyload from "./img-lazyload"

export default function(){
	Vue.use(modals);
	Vue.use(routerTransition);
	Vue.use(share);
	Vue.use(loading);
	Vue.use(imgLazyload);
}



