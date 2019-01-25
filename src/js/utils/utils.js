/**
 * 作者：yujinjin9@126.com
 * 时间：2017-01-19
 * 描述：站点页面表单验证框架工具类
 */
import extend from './extend'
import consants from './constants'

export default {
	//日期格式化
	dateFormat(date, fmt="yyyy-MM-dd"){
		// TODO: 没有经过测试
		if(!date || !date instanceof Date) {
			return "";
		}
		var o = {
			"M+": date.getMonth() + 1, // 月份
			"d+": date.getDate(), // 日
			"h+": date.getHours(), // 小时
			"m+": date.getMinutes(), // 分
			"s+": date.getSeconds(), // 秒
			"q+": Math.floor((date.getMonth() + 3) / 3), // 季度
			"S": date.getMilliseconds() // 毫秒
		};
		if(/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for(var k in o)
			if(new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	},

	// 验证手机号
	validateMobile(mobile){
		if(!mobile) {
			return false;
		}
		mobile = mobile.trim().replace(/\s/g, '');
		if(!(/^(13[0-9]|15[012356789]|166|17[0123456789]|18[0-9]|14[579]|19[89])[0-9]{8}$/.test(mobile.trim()))) {
			return false;
		} else {
			return true;
		}
	},
	//验证邮箱
	validateEmail(email){
		var filter=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if(filter.test(email)){
			return true;
		} else {
			return false;
		}
	},

	/**
	 * 验证身份证号，支持港澳台
	 *
	 * 验证规则是：18位校验规则 6位地址编码+8位出生日期+3位顺序号+1位校验位
	 **/
	validateIDCard(IDCard) {
		if(/^[a-zA-Z][0-9]{6}((\([0-9aA]\))|[0-9aA])$/.test(IDCard.trim())) {
			// 香港
			return true;
		} else if(/^[a-zA-Z][0-9]{9}$/.test(IDCard.trim())) {
			// 台湾
			let gender_sex = IDCard.trim().substring(1, 2);
			if(gender_sex === "1" || gender_sex === "2") {
				return true;
			}
			return false;
		} else if(/^[157]\d{6}((\([0-9]\))|[0-9])$/.test(IDCard.trim())) {
			// 澳门
			return true;
		} else if((/^[1-9][0-9]{5}(18|19|20)?[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/.test(IDCard.trim()))){
			// 大陆身份证
			// 18位身份证需要验证最后一位校验位
	        IDCard = IDCard.split('');
	        // ∑(ai×Wi)(mod 11)
	        // 加权因子
	        let factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
	        // 校验位
	        let parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
	        let sum = 0, ai = 0, wi = 0;
	        for (let i = 0; i < 17; i++) {
	            ai = IDCard[i];
	            wi = factor[i];
	            sum += ai * wi;
	        }
	        let last = parity[sum % 11];
	        if(last != IDCard[17].toLocaleUpperCase()){
	            return false;
	        }
	        return true;
		}
		return false;
	},

	/**
	 * 验证银行卡
	 *
	 * 验证规则是：全数字，长度必须在5到24之间
	 */
	validateBankCard(bankCard) {
		if(!bankCard) return false;
		return (/^[0-9]{5,25}$/.test(bankCard))
	},

	/**
	 * 将数值四舍五入(保留2位小数)后格式化成金额形式
	 *
	 * @param num 数值(Number或者String)
	 * @param digit 保留小数点几位
	 * @return 金额格式的字符串,如'1,234,567.45'
	 * @type String
	 */
	//货币格式化
	dateCurrency(num, digit) {
		num = num.toString().replace(/\$|\,/g, '');
		if(isNaN(num))
			num = "0";
		if(typeof(digit) != "number" || digit < 0){
			digit = 0;
		}
		//最大支持11位小数
		if(digit > 11){
			return;
		}
		// 绝对值
		var sign = (num == (num = Math.abs(num))), cents = null;
		num = Math.floor(num * Math.pow(10, digit) + 0.50000000001);
		if(digit > 0){
			//小数位
			cents = num % Math.pow(10, digit);
			cents = ( "00000000000" + num).substr(-digit)
		}
		num = Math.floor(num / Math.pow(10, digit)).toString();
		for(var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
				num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
		if(cents) {
			return (((sign) ? '' : '-') + num + '.' + cents);
		} else {
			return (((sign) ? '' : '-') + num);
		}
	},

	// 解析URL
	parseUrl(url) {
		if(!url) {
			return;
		}
		var _a_el = document.createElement("a");
		_a_el.href = url;
		return {
			protocol: _a_el.protocol.replace(':', ''), //协议
			host: _a_el.hostname, //域名
			port: _a_el.port,
			query: (function() {
				if(_a_el.search) {
					return _a_el.search;
				}
				//兼容http://xxxx/#/id=xxx这种格式
				if(url.indexOf("?") != -1) {
					return url.substring(url.indexOf("?"));
				}
				return "";
			})(),
			params: (function() {
				var ret = {},
					seg = _a_el.search;
				//兼容http://xxxx/#/id=xxx这种格式
				if(!seg && url.indexOf("?") != -1) {
					seg = url.substring(url.indexOf("?"));
				}
				seg = seg.replace(/^\?/, '').split('&');
				var len = seg.length,
					i = 0,
					s;
				for(; i < len; i++) {
					if(!seg[i]) {
						continue;
					}
					s = seg[i].split('=');
					ret[s[0]] = s[1];
				}
				return ret;
			})(), //参数对象
			file: (_a_el.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
			hash: _a_el.hash.replace('#', ''),
			path: _a_el.pathname.replace(/^([^\/])/, '/$1'),
			relative: (_a_el.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
			segments: _a_el.pathname.replace(/^\//, '').split('/')
		}
	},

	/**
	 * 修改url中的参数值，如果参数名(name)在URL中不存在且有value值就表示增加该参数，如果value为null或者空字符串就表示删除该参数
	 *
	 * @param url 当前要修改的URL
	 * @param name 参数名，如果参数名(name)在URL中不存在有value值且可以增加就表示增加该参数
	 * @param value 参数值，如果value为null或者空字符串就表示删除该参数
	 * @param isAdd 如果没有该参数时是否可以增加该参数，默认为true.
	 * @return 返回新的URL
	 */
	changeURLParameter(url, name, value, isAdd=true){
		if(!url && !name) return;
		if(!value) {
			// 删除参数
			return url.replace(eval('/(\\?|\\&)(' + name + '=)([^&]*)(&*)/gi'), function(matchWord, parame1, parame2, parame3, parame4){
				if(parame4 != "&"){
					return "";
				} else {
					return parame1;
				}
			});
		} else {
			let _is_has_name = false; // 是否有该参数
			let _new_url = url.replace(eval('/(\\?|\\&)(' + name + '=)([^&]*)(&*)/gi'), function(matchWord, parame1, parame2, parame3, parame4){
				_is_has_name = true;
				return parame1 + parame2 + value + parame4;
			});
			if(!_is_has_name && isAdd) {
				_new_url += ((_new_url.indexOf("?") === -1 ? "?" : "&") + name + "=" + value);
			}
			return _new_url;
		}
	},

	// 生成guid随机数
	generateGuid() {
		return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},

	//随机生成一个ID(年月日+8位随机数)
	generateRandomId() {
		let [_date, _id]  = [new Date(), ""];
		_id = 'xxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
		_id = _date.getFullYear() + "" + (_date.getMonth() > 8?(_date.getMonth() + 1):"0"+(1 + _date.getMonth())) + "" + (_date.getDate() > 9?_date.getDate():"0"+_date.getDate()) + _id;
		return _id;
	},

	//获取图片地址，如果地址带有 http://那么就认为是绝对地址，然后直接返回
	getImageUrl(url, size) {
		if(!url){
			return consants.DEFAULT_IMG.error;
	    }
		if(url.match(/http:\/\//) || url.match(/https:\/\//) || url.startsWith('data:image')) {
			return url;
		}
		//全站统一配置
		return config.imageDomain + url + (size ? ("?"+"x-oss-process=style/"+size) : "");
	},
	
	// 获取本地图片地址，如果有地址带有http://(因为webpack配置了publicPath)那么就认为是绝对地址，然后直接返回
	getLocalImageUrl(url, defautlType = "logo") {
		if(!url){
			url = consants.DEFAULT_IMG[defautlType];
	    }
		if(url.match(/http:\/\//) || url.match(/https:\/\//) || url.startsWith('data:image')) {
			return url;
		}
		//全站统一配置
		return config.localDomain + url;
	},

	//本地存储
	localStorage(key, value) {
		if(arguments.length === 0) {
			app.log.warn("没有参数");
			return;
		}
		if(!window || !window.localStorage) {
			//TODO: 修改弹窗提示
			alert("您开启了秘密浏览或无痕浏览模式，请关闭!");
			return;
		}
		if(arguments.length === 1 || typeof(value) === "undefined") {
			return window.localStorage.getItem(key);
		} else if(value === null || value === '') {
			window.localStorage.removeItem(key);
		} else if(typeof(value) === "object") {
			window.localStorage.setItem(key, JSON.stringify(value));
		} else {
			window.localStorage.setItem(key, value);
		}
	},

	//动态加载JS
	loadScript(url, id, callback) {
		//如果URL不存在或者该ID已经加载过了
		if(!url || document.getElementById(id)) {
			if(typeof(callback) == "function") {
				callback(true);
			}
			return;
		}
		var script = document.createElement("script");
		script.type = "text/javascript";
		if(id) script.id = id;
		if(typeof(callback) == "function") {
			//默认10S超时就立即执行回调函数
			let timer = setTimeout(function(){
				callback(false);
				timer = null;
			}, 10000);
			if(script.readyState) {
				script.onreadystatechange = function() {
					if(script.readyState == "loaded" || script.readyState == "complete") {
						script.onreadystatechange = null;
						if(timer){
							clearTimeout(timer);
							callback(true);
						}
					}
				};
			} else {
				script.onload = function() {
					if(timer){
						clearTimeout(timer);
						callback(true);
					}
				};
			}
		}
		script.src = url;
		document.body.appendChild(script);
	},

	/**
	 * 计算提现个人所缴纳的税
	 * @param {int} currentMoney 当前提现的金额
	 * @param {int} withdrewMoney 当月已经提现的金额
	 * @return {int} 本次所缴纳的税额
	 */
	getIncomeTaxes(currentMoney,  withdrewMoney){
		if(typeof(currentMoney) != "number") {
			currentMoney = parseFloat(currentMoney);
		}
		if(typeof(withdrewMoney) != "number") {
			withdrewMoney = parseFloat(withdrewMoney);
		}
		if(currentMoney <= 0 || withdrewMoney < 0){
			throw new Error('非法操作');
			return false;
		}
		let totalMoney = currentMoney + withdrewMoney;
		const getTax = function(moneys) {
			if(moneys <= 800){
				return 0;
			}
			if(moneys <= 4000) {
				return (moneys - 800) * 0.2;
			}
			if(moneys * 0.8 <=　20000) {
				return moneys * 0.8 * 0.2;
			}
			if(moneys * 0.8 <=　50000) {
				return moneys * 0.8 * 0.3 - 2000;
			}
			return moneys * 0.8 * 0.4 - 7000;
		}
		// 本次应缴总税额
		return getTax(totalMoney) - getTax(withdrewMoney);
	},
	/**
	 * 函数节流，提升性能
	 * @param {function} func 要执行的函数（不能是匿名函数）
	 * @param {number} wait 函数执行的最小间隔
	 * @param {object} options {leading: true,trailing: true}
	 * @return {function} 查看文档 http://www.bootcss.com/p/underscore/#throttle
	 * @example let cb=app.utils.throttle(fnName,250); window.addEventListener('scroll', cb, false); ;
	 */
	throttle(func, wait, options) {
		var context, args, result;
		var timeout = null;
		var previous = 0;
		if (!options) options = {};
		var later = function () {
			previous = options.leading === false ? 0 : Date.now();
			timeout = null;
			result = func.apply(context, args);
			if (!timeout) context = args = null;
		};
		return function () {
			var now = Date.now();
			if (!previous && options.leading === false) previous = now;
			var remaining = wait - (now - previous);
			context = this;
			args = arguments;
			if (remaining <= 0 || remaining > wait) {
				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
				previous = now;
				result = func.apply(context, args);
				if (!timeout) context = args = null;
			} else if (!timeout && options.trailing !== false) {
				timeout = setTimeout(later, remaining);
			}
			return result;
		};
	},

	/**
	 * 百度视频播放器播放
	 * @param selector 播放视频的选择器DOM
	 * @param playURL 播放视频的URL
	 * @param coverUrl 播放视频的预览图
	 * @param options 视频播放器的配置项
	 * @param return Promise对象,成功之后传入播放器的的对象,如果失败会传入false参数
	 */
	cyberplayer(selector, playURL, coverUrl, options){
		return new Promise((resolve, reject) => {
			if(!playURL) {
				mui.toast('无法获取到视频播放URL！');
				reject(false);
				return;
			}
			require(["../lib/cyberplayer"], function (cyberplayer) {
				try{
					options = Object.assign({}, {
						width: '100%', // 宽度，也可以支持百分比(不过父元素宽度要有)
						height: '100%', // 高度，也可以支持百分比
						file: playURL, // 播放地址
						image: coverUrl, // 预览图
						autostart: false, // 是否自动播放
						stretching: "uniform", // 拉伸设置
						repeat: false, // 是否重复播放
						volume: 100, // 音量
						controls: true, // controlbar是否显示
						starttime: 0, // 视频开始播放时间，如果不设置，则可以从上次播放时间点续播
						primary: "html5", // 首先使用html5还是flash播放，默认：html5
						ak: "974be5fa22fb45c7af33c14d07161306" // 公有云平台注册即可获得accessKey
					}, options || {});
					let cyberplayerObject = cyberplayer(selector).setup(options);
					resolve(cyberplayerObject);
				} catch(e) {
					alert("视频播出错....");
					app.log.error(e);
					reject(false);
				}
			});
		});
	},

	/**
	 * url 页面跳转，主要是想让内部页面能够单页方式跳转。由于活动页（以'/marketingTools'开头）也是在当前域名下但它是另外一个项目所以也要跳转
	 *
	 * @param {String} url 当前URL
	 * @param {Object} $router 当前路由对象,如果没有指定当前路由就用指定当前路由
	 */
	jumpPage(url, $router){
		if(!$router) {
			$router = app.vueApp.$router;
		}
		if (!url || !$router) return null;
		if(url.indexOf(app.Config.localDomain) === 0) {
			url = url.substr(app.Config.localDomain.length);
		}
		if(url.indexOf("/") === 0 && url.indexOf("/marketingTools") != 0 && url.indexOf("/visual/mobile/") != 0) {
			// 内部URL跳转走路由配置
			$router.push(url);
		} else {
			window.location.href = url;
		}
	},

	/**
	 * 根据路由名称,参数反射出URL地址
	 *
	 * @param {String} name 路由名称
	 * @param {String} query 路由参数,包含了 动态片段 和 全匹配片段
	 * @param {String} params 路由参数,URL 查询参数。例如，对于路径 /foo?user=1
	 * @param {Object} $router 当前路由对象,如果没有指定当前路由就用指定当前路由
	 */
	getUrlByRouterReflect(name, query={}, params={}, $router){
		if(!$router) {
			$router = app.vueApp.$router;
		}
		if(!$router || !name){
			return null;
		}
		return app.Config.localDomain + $router.resolve({name,query, params}).href;
	},

	/**
	 * 货款明细页面跳转
	 * 说明:本来这是很偏业务方法的是不应该放在这个文件的,但当前的框架内没有定义这类的业务实现为了快速开发就暂时放在这里
	 */
	gotoCloudStorageDetails({typeName, statusName, id, sourceNo}, $router) {
		if(!typeName || !statusName) {
			return;
		}
		if(!$router) {
			$router = app.vueApp.$router;
		}
		if(typeName === "CsChangeGoods") {
			// 货款项目:云仓退货(CsChangeGoods), 名称:云仓退款, 状态: 已完成, 路由名称: 出货明细, 路由地址:{name: 'sales-details', params: {id:orderNumber}}
			$router.push({name: 'sales-details', params: {id: sourceNo}});
		} else if(typeName === "PurchaseRequests") {
			// 货款项目:云仓进货(PurchaseRequests), 名称:云仓进货, 状态: 审核中、已完成、审核拒绝【进货失败】, 路由名称: 进货明细, 路由地址:{name: 'purchase-details', params: {id}}
			$router.push({name: 'purchase-details', params: {id}});
		} else if(typeName === "CloudStorageBackPayment" && (statusName === '待入账' || statusName === '已取消' || statusName === '已完成')) {
			//货款项目:云仓回款(CloudStorageBackPayment), 名称:销售回款, 状态: 待入账、已取消、已完成, 路由名称: 出货明细, 路由地址:{name: 'sales-details', params: {id:orderNumber}}
			//货款项目:云仓回款(CloudStorageBackPayment), 名称:转卖回款, 状态: 已完成, 路由名称: 出货明细, 路由地址:{name: 'sales-details', params: {id:orderNumber}}
			$router.push({name: 'sales-details', params: {id: sourceNo}});
		} else if(typeName === "RechargeOrderPayment" && (statusName === '待充值' || statusName === '取消充值' || statusName === '待转账' || statusName === '待审核' || statusName === '充值失败' || statusName === '已完成')) {
			//货款项目:货款充值(RechargeOrderPayment), 名称:货款充值, 状态: 取消充值、待充值、待转账、待审核、已拒绝【充值失败】、已完成, 路由名称: 充值明细, 路由地址:{name: 'recharge-details', params: {id: orderNumber}}
			$router.push({name: 'recharge-details', params: {id: sourceNo}});
		} else if(typeName === "PortalManager") {
			//货款项目:后台货款充值(PortalManager), 名称:货款充值, 状态: 已完成, 路由名称:无

		} else if(typeName === "TakeDeliveryPaidBackPayment") {
			//货款项目:提货返还(TakeDeliveryPaidBackPayment), 名称:提货返还, 状态: 已完成, 路由名称: 提货明细, 路由地址:{name: 'sales-details', params: {id:orderNumber}}
			$router.push({name: 'sales-details', params: {id: sourceNo}});
		} else if(typeName === "PaymentForGoodsCashOut") {
			//货款项目:货款提现(PaymentForGoodsCashOut), 名称:货款提现, 状态: 审核中、审核拒绝、已完成, 路由名称: 提现明细, 路由地址:{name: 'withdrawing-cash-details', params: {id}}
			$router.push({name: 'withdrawing-cash-details', params: {id}});
		}
	},

	//对象深复制，创建对象和继承
	extend: extend
}
