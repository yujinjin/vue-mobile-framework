/**
 * 作者：yujinjin9@126.com
 * 时间：2018-12-28
 * 描述：等候队列弹窗
 */
import QueueWaitedDialog from './views/queue-waited-dialog.vue'

export default (function(){
	//
	let QueueWaitedDialogConstructor = null, queueWaitedDialogInstance = null;
	
	return {
		install(Vue, options) {
			app = app || {};
			app.showQueueWaitedDialog = Vue.prototype.$showQueueWaitedDialog = function(){
				if(!QueueWaitedDialogConstructor) {
					QueueWaitedDialogConstructor = Vue.extend(QueueWaitedDialog);
				}
				if(!queueWaitedDialogInstance) {
					queueWaitedDialogInstance = new QueueWaitedDialogConstructor({
						el: document.createElement('div')
					});
					queueWaitedDialogInstance.onClose = function(){
						if(queueWaitedDialogInstance) {
							queueWaitedDialogInstance.destroy();
							queueWaitedDialogInstance.$el.parentNode.removeChild(queueWaitedDialogInstance.$el)
							queueWaitedDialogInstance = null;
						}
					}
					document.body.appendChild(queueWaitedDialogInstance.$el);
					queueWaitedDialogInstance.show();
				}
			}
		}
	}
})();