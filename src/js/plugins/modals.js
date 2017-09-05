/**
 * 作者：yujinjin9@126.com
 * 时间：2017-05-23
 * 描述：弹窗插件
 */
import Vue from 'vue';
export default (function(){
	let ModalsConstructor = Vue.extend(require('./views/modals.vue'));
	// 弹窗实例
	let [modalsInstance, delayCloseTimerId] = [null, null];
	// 默认配置选项
	let defaults = {
		ISroll: {
			ISrollInstance: null, //初始化后的ISroll实例对象
			isUse: false //是否使用
		},
		autoHide: true, //点击遮罩层是否隐藏
		opacity: "", //遮罩层透明度
		delay: 0, // 窗口多少毫秒后自动关闭，为0时，不自动关闭
		animated: true, //是否添加动画
		className: null,
		contents: null, //
		title: null, //标题
		width: 270, //弹层宽度
		height: null, //弹层高度
		buttons: [] //{className|label|callback}
	};
	// 关闭
	const onClose = function(callback){
		if(callback && typeof(callback) === "function") {
			var args = [];
			for(var i=1, j = arguments.length; i<j; i++){
				args.push(arguments[i]);
			}
			args.push(modalsInstance.$refs.body);
			if(callback.apply(null, args) === false){
				//如果返回值是false就不自动关闭弹窗
				return;
			}
		}
		modalsInstance.destroy();
		modalsInstance.$el.parentNode.removeChild(modalsInstance.$el)
		if(modalsInstance) {
			modalsInstance = null;
		}
		if(delayCloseTimerId) {
			clearTimeout(delayCloseTimerId);
			delayCloseTimerId = null;
		}
	}
	//创建实例
	const createInstance = function(options){
		modalsInstance = new ModalsConstructor({
			el: document.createElement('div'),
			data: options
		});
		modalsInstance.onClose = onClose;
		return modalsInstance;
	}
	// 显示弹窗
	const showModals = function(options) {
		if(!modalsInstance) {
			modalsInstance = createInstance(options);
			document.body.appendChild(modalsInstance.$el);
		} else {
			let _options = app.utils.extend({}, defaults, options);
			for (let prop in _options) {
		        if (_options.hasOwnProperty(prop)) {
		          	modalsInstance[prop] = _options[prop];
		        }
		    }
			if(_options.ISroll.isUse) {
				modalsInstance.IScrollInit();
			} else {
				modalsInstance.destroyIScroll();
			}
		}
		if(!modalsInstance.show) modalsInstance.show = true;
		if(delayCloseTimerId) {
			clearTimeout(delayCloseTimerId);
			delayCloseTimerId = null;
		}
		if (typeof (options.delay) == "number" && options.delay > 100) {
			delayCloseTimerId = setTimeout(()=>onClose(options.onEscape), options.delay);
		}
		return modalsInstance;
	}
	
	return {
		install(Vue, options) {
			app = app || {};
			app.modals = Vue.prototype.$modals = {
				// 成功提示绑定
		        success: function (contents, callBackFun, options) {
		            var _options = {};
					if(typeof(options) === "number"){
						_options.delay = options;
					} else if(typeof(options) === "object"){
						_options = Object.assign(_options, options);
					}
					_options.className = "modal-success";
					_options.contents = contents || "成功了!";
					_options.onEscape = callBackFun;
					if(!_options.delay){
						//默认2秒隐藏
						_options.delay = 2000;
					}
					return showModals(_options);
		        },
		
		        // 信息提示绑定
		        info: function (contents, callBackFun, options) {
		            var _options = {};
					if(typeof(options) === "number"){
						_options.delay = options;
					} else if(typeof(options) === "object"){
						_options = Object.assign(_options, options);
					}
					_options.className = "modal-info";
					_options.contents = contents;
					_options.onEscape = callBackFun;
					if(!_options.delay){
						//默认1.5秒隐藏
						_options.delay = 2000;
					}
					return showModals(_options);
		        },
		
		        // 敬告提示绑定
		        warning: function (msg, title, options) {
		            var _options = {};
					if(typeof(options) === "number"){
						_options.delay = options;
					} else if(typeof(options) === "object"){
						_options = Object.assign(_options, options);
					}
					_options.className = "modal-warning";
					_options.contents = contents || "警告！";
					_options.onEscape = callBackFun;
					if(!_options.delay){
						//默认1秒隐藏
						_options.delay = 1500;
					}
					return showModals(_options);
		        },
		
		        // 错语提示绑定
		        error: function (contents, callBackFun, options) {
		        	var _options = {};
					if(typeof(options) === "number"){
						_options.delay = options;
					} else if(typeof(options) === "object"){
						_options = Object.assign(_options, options);
					}
					_options.className = "modal-error";
					_options.contents = contents || "出错了！";
					_options.onEscape = callBackFun;
					if(!_options.delay){
						//默认1秒隐藏
						_options.delay = 3000;
					}
					return showModals(_options);
		        },
		
		        // 清除窗口绑定
		        alert: function (title, contents, label, callback) {
		            var _options = {
						title: title,
						className:title ? "modal-alert" : "modal-alert-notitle" ,
						contents: contents,
						autoHide: false,
						buttons: [{
							className: "button-alert",
							label: label? label : "确认",
							callback: function($body){
								onClose(callback);
							}
						}]
					};
					return showModals(_options);
		        },
		        
		        // 移除消息提示
		        confirm: function (contents, buttons, callback, title) {
		            var _options = {
						title: title,
						className:title? "modal-confirm": "modal-confirm-notitle" ,
						contents: contents,
						autoHide: false,
						buttons: [{
							className: "button-cancel",
							label: "取消",
							callback: function($body){
								onClose(callback, false);
							}
						}, {
							className: "button-ok",
							label: "确认",
							callback: function($body){
								onClose(callback, true);
							}
						}]
					};
					if(typeof(buttons) === "object"){
						_options.buttons = app.utils.extend(true, _options.buttons , buttons);
					}
					return showModals(_options);
		        },
		        
//		        // 移除消息提示
//		        prompt: function () {
//		        },
		        
		        explain(title, contents){
		        	var _options = {
						title: title,
						className:"modal-explain",
						width: "100%",
						contents: contents,
						autoHide: false,
						ISroll: {
							options: {}, //ISroll配置参数
							isUse: true //是否使用
						},
						buttons: [{
							className: "button-explain",
							callback: function($body){
								onClose();
							}
						}],
						initCallback: function($body){
							function getNextElement(element){
					            var e = element.nextSibling;
					            if(e == null){//测试同胞节点是否存在，否则返回空
					                return null;
					            }
					            if(e.nodeType==3){//如果同胞元素为文本节点
					                var two = getNextElement(e);
					                if(two.nodeType == 1)
					                    return two;
					            }else{
					                if(e.nodeType == 1){//确认节点为元素节点才返回
					                    return e;
					                }else{
					                    return false;
					                }
					            }
					        }
							function getPreviousElement(element){
					            var e = element.previousSibling;
					            if(e == null){//测试同胞节点是否存在，否则返回空
					                return null;
					            }
					            if(e.nodeType==3){//如果同胞元素为文本节点
					                var two = getPreviousElement(e);
					                if(two.nodeType == 1)
					                    return two;
					            }else{
					                if(e.nodeType == 1){//确认节点为元素节点才返回
					                    return e;
					                }else{
					                    return false;
					                }
					            }
					        }
							let [nextElement, previousElement] = [getNextElement($body), getPreviousElement($body)];
							var _max_height = window.innerHeight - (nextElement ? nextElement.getBoundingClientRect().height : 0) - (previousElement ? previousElement.getBoundingClientRect().height : 0) - 50;
							$body.style.maxHeight = _max_height + "px";
						}
					};
					return showModals(_options);
		        },
//		        // 移除消息提示
//		        prompt: function () {
//		        },
		        close(callback) {
		        	onClose(callback);
		        },
		        dialog(options){
		        	return showModals(options);
		        }
			}
		}
	}
})()
