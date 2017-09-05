/**
 * 作者：yujinjin9@126.com
 * 时间：2017-07-17
 * 描述：系统自定义组件入口
 */

import Vue from 'vue'
import listLoading from './views/list-loading.vue'
import vueCoreImageUpload from './views/vue-core-image-upload/vue-core-image-upload.vue'


Vue.component("list-loading", listLoading);
Vue.component("vue-core-image-upload", vueCoreImageUpload);
