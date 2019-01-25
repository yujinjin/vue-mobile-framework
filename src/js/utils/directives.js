/**
 * 作者：yujinjin9@126.com
 * 时间：2017-02-07
 * 描述：自定义指令
 */
//  bind: 只调用一次，指令第一次绑定到元素时调用，用这个钩子函数可以定义一个在绑定时执行一次的初始化动作。
//  inserted: 被绑定元素插入父节点时调用（父节点存在即可调用，不必存在于 document 中）。
//  update: 被绑定元素所在的模板更新时调用，而不论绑定值是否变化。通过比较更新前后的绑定值，可以忽略不必要的模板更新（详细的钩子函数参数见下）。
//  componentUpdated: 被绑定元素所在模板完成一次更新周期时调用。
//  unbind: 只调用一次， 指令与元素解绑时调用。
import Vue from 'vue'

export default {
	focus: {
		inserted: function (el, {value, arg}, vnode) {
			if(value === true || value === "true" || value === arg){
				el.focus();
			}
		},
		update: function(el, {value, arg}){
			if(value === true || value === "true" || value === arg){
				el.focus();
			}
		}
	},
	
	//数据上报
	report:{
		bind(el, binding, vnode){
			if(!el.dataset) {
				// 浏览器不支持dataset
				return;
			}
			// 默认是tap 事件
			let eventName = binding.arg || 'tap';
			// 当前的数据值一定要是静态的，如果是动态的绑定该数据拿到的值一定是初始化的值
			let value = binding.value;
			if(typeof(value) === "string"){
				el.dataset.reportValue = value;
			} else if(typeof(value) === "object"){
				el.dataset.reportValue = JSON.stringify(value);
			}
			el.addEventListener(eventName, function(e){
				if(binding.stop === true) {
					e.stopPropagation();
				}
				if(binding.prevent === true) {
					e.preventDefault();
				}
				let parameters = el.dataset.reportValue;
				try{
					if(parameters) parameters = JSON.parse(parameters);
				} catch(e){}
				dataReport.eventDirectiveReport(parameters);
			}, false);
		},
		update: function(el, binding){
			if(!el.dataset) {
				// 浏览器不支持dataset
				return;
			}
			// 当前的数据值一定要是静态的，如果是动态的绑定该数据拿到的值一定是初始化的值
			let value = binding.value;
			if(typeof(value) === "string"){
				el.dataset.reportValue = value;
			} else if(typeof(value) === "object"){
				el.dataset.reportValue = JSON.stringify(value);
			}
		}
	}
}