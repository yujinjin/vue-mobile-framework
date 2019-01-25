/**
 * 作者：yujinjin9@126.com
 * 时间：2017-08-19
 * 描述：提示信息组件
 */
import Vue from 'vue';
export default (function(){
	let TooltipConstructor = Vue.extend(require('./views/tooltip.vue'));
	// 实例
	let tooltipInstance = null, currentTargetEl = null, documentEventNames = [];
	
	let Tooltip = {
		// 自动获取合适的位置
		getAutoPlacement(targetElPositon, tooltipEl){
			// 如果没有指定方向就自动计算合适的位置
			let placement = null,
				documentClientWidth = (document.documentElement.clientWidth || document.body.clientWidth),
				documentClientHeight = (document.documentElement.clientHeight || document.body.clientHeight),
				offsetWidth = tooltipEl.offsetWidth,
				offsetHeight = tooltipEl.offsetHeight;
			// 先选出在可视范围内距离边界最大的地方
			let rangeArea = [{
				placement: "top",
				width: documentClientWidth,
				height: targetElPositon.top
			}, {
				placement: "bottom",
				width: documentClientWidth,
				height: documentClientHeight - targetElPositon.bottom
			}, {
				placement: "left",
				width: targetElPositon.left,
				height: documentClientHeight
			}, {
				placement: "right",
				width: documentClientWidth - targetElPositon.right,
				height: documentClientHeight
			}];
			let index = Tooltip.comparePlacement(rangeArea, tooltipEl.offsetWidth, tooltipEl.offsetHeight);
			if(index === -1) {
				// 如果还是没有合适的距离，就拿网页可见距离来判断
				let documentScrollTop = (document.documentElement.scrollTop || document.body.scrollTop), // 滚动高度的距离
					documentScrollLeft = (document.documentElement.scrollLeft || document.body.scrollLeft), // 滚动左边的距离
					documentScrollHeight = (document.documentElement.scrollHeight || document.body.scrollHeight), // 网页可见区域高
					documentScrollWidth = (document.documentElement.scrollWidth || document.body.scrollWidth);
				rangeArea = [{
					placement: "top",
					width: documentScrollWidth,
					height: targetElPositon.top + documentScrollTop
				}, {
					placement: "bottom",
					width: documentScrollWidth,
					height: documentScrollHeight - targetElPositon.bottom - documentScrollTop
				}, {
					placement: "left",
					width: targetElPositon.left + documentScrollLeft,
					height: documentScrollHeight
				}, {
					placement: "right",
					width: documentScrollWidth - targetElPositon.right - documentScrollLeft,
					height: documentClientHeight
				}];
				index = Tooltip.comparePlacement(rangeArea, tooltipEl.offsetWidth, tooltipEl.offsetHeight);
			}
			if(index === -1) {
				// 如果还是没有合适的地方就选面积最大的区域
				index = Tooltip.comparePlacement(rangeArea, 0, 0);
			}
			return rangeArea[index].placement;
		},
		
		// 比较选出最优的
		comparePlacement(rangeArea, offsetWidth, offsetHeight){
			let index = -1;
			if(rangeArea[0].width >= offsetWidth && rangeArea[0].height >= offsetHeight) {
				index = 0;
			}
			for(let i = 1; i < rangeArea.length; i++) {
				if((rangeArea[i].width >= offsetWidth && rangeArea[i].height >= offsetHeight) && 
				(index == -1 || rangeArea[i].width * rangeArea[i].height > rangeArea[index].width * rangeArea[index].height)) {
					index = i;
				}
			}
			return index;
		},
		
		//获取实例
		getInstance(options) {
			// 如果实例还未创建就创建新实例
			if(!tooltipInstance){
				tooltipInstance = new TooltipConstructor({
					el: document.createElement('div')
				});
			}
			return tooltipInstance;
		},
		
		// 获取提示窗口的位置
		getPlacementPosition(placement, targetElPositon, tooltipEl) {
			let positon = {left: 0, top: 0, placement: null},
				documentScrollTop = (document.documentElement.scrollTop || document.body.scrollTop), // 滚动高度的距离
				documentScrollLeft = (document.documentElement.scrollLeft || document.body.scrollLeft), // 滚动左边的距离
				documentScrollHeight = (document.documentElement.scrollHeight || document.body.scrollHeight), // 网页可见区域高
				documentScrollWidth = (document.documentElement.scrollWidth || document.body.scrollWidth);
			if(placement === "bottom") {
				tooltipEl.style.maxWidth = documentScrollWidth + "px";
				tooltipEl.style.maxHeight = documentScrollHeight - targetElPositon.bottom + "px";
				positon.left = (targetElPositon.right + targetElPositon.left) / 2 - tooltipEl.offsetWidth / 2 + documentScrollLeft;
				positon.top = targetElPositon.bottom + documentScrollTop;
				if(positon.left < 0) positon.left = 0;
				tooltipEl.querySelectorAll(".tooltip-arrow")[0].style.top = "";
				tooltipEl.querySelectorAll(".tooltip-arrow")[0].style.left = (targetElPositon.right + targetElPositon.left) / 2 - positon.left - tooltipEl.querySelectorAll(".tooltip-arrow")[0].offsetWidth / 2 + "px";
			} else if(placement === "top") {
				tooltipEl.style.maxWidth = documentScrollWidth + "px";
				tooltipEl.style.maxHeight = documentScrollHeight - targetElPositon.top + "px";
				positon.left = (targetElPositon.right + targetElPositon.left) / 2 - tooltipEl.offsetWidth / 2 + documentScrollLeft;
				positon.top = targetElPositon.top - tooltipEl.offsetHeight + documentScrollTop;
				if(positon.left < 0) positon.left = 0;
				tooltipEl.querySelectorAll(".tooltip-arrow")[0].style.top = "";
				tooltipEl.querySelectorAll(".tooltip-arrow")[0].style.left = (targetElPositon.right + targetElPositon.left) / 2 - positon.left - tooltipEl.querySelectorAll(".tooltip-arrow")[0].offsetWidth / 2 + "px";
			} else if(placement === "left") {
				tooltipEl.style.maxWidth = (documentScrollWidth - targetElPositon.left) + "px";
				tooltipEl.style.maxHeight = documentScrollHeight + "px";
				positon.left = targetElPositon.left - tooltipEl.offsetWidth + documentScrollLeft;
				positon.top = (targetElPositon.bottom + targetElPositon.top) / 2 - tooltipEl.offsetHeight / 2  + documentScrollTop;
				if(positon.top < 0) positon.top = 0;
				tooltipEl.querySelectorAll(".tooltip-arrow")[0].style.left = "";
				tooltipEl.querySelectorAll(".tooltip-arrow")[0].style.top = (targetElPositon.bottom + targetElPositon.top) / 2 - positon.top - tooltipEl.querySelectorAll(".tooltip-arrow")[0].offsetHeight / 2 + "px";
			} else if(placement === "right") {
				tooltipEl.style.maxWidth = (documentScrollWidth - targetElPositon.right) + "px";
				tooltipEl.style.maxHeight = documentScrollHeight + "px";
				positon.left = targetElPositon.right + documentScrollLeft;
				positon.top = (targetElPositon.bottom + targetElPositon.top) / 2 - tooltipEl.offsetHeight / 2  + documentScrollTop;
				if(positon.top < 0) positon.top = 0;
				tooltipEl.querySelectorAll(".tooltip-arrow")[0].style.left = "";
				tooltipEl.querySelectorAll(".tooltip-arrow")[0].style.top = (targetElPositon.bottom + targetElPositon.top) / 2 - positon.top - tooltipEl.querySelectorAll(".tooltip-arrow")[0].offsetHeight / 2 + "px";
			}
			positon.placement = placement;
			return positon;
		},
		
		setValue(options){
			tooltipInstance.initValue(options);
		},
		
		clickEvent(){
			if(tooltipInstance && tooltipInstance.isShow) {
				tooltipInstance.hide();
			}
		},
		reset(options, targetEl){
			Tooltip.setValue(options);
			tooltipInstance.$el.classList.add("fade");
			tooltipInstance.$el.classList.remove("left", "right", "top", "bottom");
			tooltipInstance.show();
			Vue.nextTick().then(() => {
				if(!options.placement) {
					options.placement = Tooltip.getAutoPlacement(targetEl.getBoundingClientRect(), tooltipInstance.$el);
				}
				tooltipInstance.$el.classList.add(options.placement);
				let position = Tooltip.getPlacementPosition(options.placement, targetEl.getBoundingClientRect(), tooltipInstance.$el);
				tooltipInstance.$el.style.left = position.left + "px";
				tooltipInstance.$el.style.top = position.top + "px";
				tooltipInstance.$el.classList.remove("fade");
			});
		}
	}
	
	const show = function(targetEl, options, eventName){
		if(typeof(options) === "string") {
			options = {content: options};
		}
		if(!tooltipInstance) {
			document.body.addEventListener(eventName, Tooltip.clickEvent, false);
			if(!documentEventNames.includes()) documentEventNames.push(eventName);
			tooltipInstance = Tooltip.getInstance();
			Tooltip.setValue(options);
			document.body.appendChild(tooltipInstance.$el);
		}
		// 如果当前有其他显示的提示信息
		if(currentTargetEl === targetEl) {
			tooltipInstance.toggle();
			if(tooltipInstance.isShow) {
				Tooltip.setValue(options);
			}
		} else {
			currentTargetEl = targetEl;
			if(tooltipInstance.isShow) {
				tooltipInstance.hide();
				Vue.nextTick().then(() => {
					Tooltip.reset(options, targetEl);
				});
			} else {
				Tooltip.reset(options, targetEl);
			}
		}
	}
	
	const update = function(options) {
		if(tooltipInstance && tooltipInstance.isShow) {
			Tooltip.setValue(options);
		}
	}
	
	const destroy = function(){
		documentEventNames.forEach(eventName => document.body.removeEventListener(eventName, Tooltip.clickEvent, false));
		if(tooltipInstance) {
			tooltipInstance.hide();
			Vue.nextTick().then(() => {
				tooltipInstance.$el.parentNode.removeChild(tooltipInstance.$el);
				tooltipInstance = null;
				currentTargetEl = null;
			});
		}
	}
	
	return {
		install(Vue, options) {
			Vue.directive("tips", {
				bind(el, binding, vnode, oldVnode) {
					// 默认是click 事件
					let eventName = binding.arg || 'click';
					el.addEventListener(eventName, function(e){
						e.stopPropagation();
						if(binding.prevent === true) {
							e.preventDefault();
						}
						show(el, binding.value, eventName);
					}, false);
				},
				update(el, binding, vnode, oldVnode) {
					if(currentTargetEl === el) {
						update(binding.value);
					}
				},
				unbind(el, binding, vnode, oldVnode) {
					if(currentTargetEl === el) {
						destroy();
					}
				}
			});
			app = app || {};
			app.showTips = Vue.prototype.$showTips = show;
			app.closeTips = Vue.prototype.$closeTips = destroy;
		}
	}
})()