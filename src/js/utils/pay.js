/**
 * 作者：yujinjin9@126.com
 * 时间：2018-10-24
 * 描述：支付工具类
 * TODO: 现在支付有3个页面，有一些重复的代码，计划把公用的代码提取出来
 */
import store from '../store/';
import alipayWap from "../lib/alipay.wap";

export default (function(){
	let controler = {
		data: {
			orderMoney: 0, // 订单金额
			deviceSource: 0, // 设备类型  0：未知，1:PC网页端，2：H5端，3：微信端，4：苹果App，5：安卓App
			wxJsPayInfo: null, // 微信JSSDK支付信息
			isAddWeixinJSBridgeEvent: false, // 是否有添加Jssdk微信支付事件
			isCancelPay: false, // 是否是用户自己取消支付
			payCountDownFun: null, // 支付倒计时回调函数，微信JSSDK支付会用到它
			$router: null, // 当前项目的路由
			parameters: {
				// 收银台支付来源页 take-deliver：云仓提货单页，vegetarianDietInvitationMyself：邀请吃素自己领取，
				// conferencesEnroll: 会议报名
				// vegetarianDietInvitationMyFriend:邀请吃素送朋友领取，vegetarianDietInvitationMyFriendV1: '吃素新版',vegetarianDietSign:邀请吃素打卡，
				// vegetarianDietInvitationMyselfv2: ,vegetarianDietInvitationMyFriendV2：
				// partnerJoin: 合伙人加盟
				// goodsVoucherPurchase: 提货券购买，cloudStorageRecharge: 云仓充值
				sourceType: null,
				//订单号
				orderNumber: "",
				// 会议报名信息页进来支付页，当前活动页报名的CODE
				conferencesCode: null,
				// 当前招商方案ID(合伙人加盟使用)
				planId: null
			}, // 订单URL上的参数对象
		},

		// 获取支付设备类型
		getDeviceSource() {
			if(app.Config.isWeiXin) {
				return 3;
			} else if(app.Config.isApp && app.Config.device.isAndroid) {
				mui.toast('当前android app 支付还未开发，敬请期待...');
				return 5;
			} else if(app.Config.isApp && app.Config.device.isIOS) {
				mui.toast('当前iOS app 支付还未开发，敬请期待...');
				return 4;
			} else if(app.Config.isPc) {
				mui.toast('当前PC 支付还未开发，敬请期待...');
				this.deviceSource = 1;
				return 1;
			} else {
	//			mui.toast('当前H5支付还未开发，敬请期待...');
				return 2;
			}
		},

		// 根据设备来源获取支付渠道列表信息
		// 支付宝V2H5支付(h5或微信环境内) AlipayV2WapPay,模拟支付 MockPayClient,微信支付(扫码) WxNativePay,H5内的微信支付 WxH5Pay,微信内的H5 JS支付 WxJsApiPay
		queryPayChannel(){
			if(this.data.parameters.sourceType === "goodsVoucherPurchase" || this.data.parameters.sourceType === "cloudStorageRecharge") {
				// 提货券购买，云仓充值调用另外一个查询渠道接口
				return app.api.order.queryRechargePayChannel({
					deviceSource: this.data.deviceSource
				}, {
					isShowLoading: true
				});
			} else {
				return app.api.order.queryPayChannel({
					orderNumber: this.data.parameters.orderNumber,
					deviceSource: this.data.deviceSource
				}, {
					isShowLoading: true
				}).then((result) => {
					if(result.isBindProvider === true) {
						// 需要绑定渠道获取用户openid
						this.wxAuthorization(result.providerType);
						return false;
					}
					this.data.orderMoney = result.totalAmountInYuan;
					return result;
				});
			}
		},

		// 由于该订单需要其他微信公众账号去支付而这个用户又没做过微信授权去获取openid，这一步就是去微信授权获取code
		wxAuthorization(providerType){
			// 由于微信网页授权"#"是特殊字符不能被转换，得转换成参数
			let current_href = window.location.href, hashName = null;
			current_href = app.utils.changeURLParameter(current_href, "providerType", providerType);
			if(current_href.indexOf("#") > 0){
				hashName = current_href.substring(current_href.indexOf("#") + 1, current_href.indexOf("?")==-1?current_href.length:current_href.indexOf("?"));
			}
			if(hashName) {
				current_href = current_href.replace("#"+hashName, "");
				if(current_href.indexOf("?") === -1){
					current_href = current_href + "?";
				} else {
					current_href = current_href + "&";
				}
				current_href = current_href + "hashName=" + hashName;
			}
			// 获取其他微信公众账号的授权
			app.api.user.getWxAuthorizeURL({"redirect_URI": current_href, "response_Type": "code", "status": "1", providerType}).then((result)=>{
	        	window.location.replace(result);
	        }).catch(()=>{mui.toast('微信登录授权获取失败...')});
		},

		// 把当前的用户绑定到其他微信账户上
		bindOtherWx() {
			let {code, hashName, providerType} = app.utils.parseUrl(window.location.href).params;
			if(!code) {
				return false;
			}
			let jump_href = window.location.href;
			// 删除code、state、providerType、hashName参数
			jump_href = app.utils.changeURLParameter(jump_href, "code");
			jump_href = app.utils.changeURLParameter(jump_href, "state");
			jump_href = app.utils.changeURLParameter(jump_href, "providerType");
			//jump_href = jump_href.replace(eval('/(\\?|\\&)(code=)([^&]*)&*/gi'), function(parame, a){return a;}).replace(eval('/(\\?|\\&)(state=)([^&]*)&*/gi'), function(parame, a){return a;}).replace(eval('/(\\?|\\&)(providerType=)([^&]*)&*/gi'), function(parame, a){return a;});
			if(hashName) {
				jump_href = jump_href.replace(eval('/(\\?|\\&)(hashName=)([^&]*)&*/gi'), function(parame, a){return a;}).replace("?", "#"+hashName+"?");
			}
			if(jump_href.substr(jump_href.length-1) === "?") {
				jump_href = jump_href.substring(0, jump_href.length-1);
			}
			//绑定用户到其他微信账户接口
			app.api.user.wxBindOtherAccount({loginProviderCode: code, loginProvider: providerType}).then((result)=>{
				window.location.replace(jump_href);
	        }).catch(()=>{
	        	app.log.error({message: "authenticateByProviderCode 接口数据调试 异常"});
	        	window.location.replace(jump_href);
	        });
	        return true;
		},

		// 修改左边返回按钮点击时跳转的路由页面
		updateHeaderLeft(){
			let _this = this;
			store.dispatch("updateHeader", {
				left: {
					callback: function(backFun) {
						mui.confirm(tips, '确认要离开支付？', ["继续支付", "确认离开"], function(result) {
							if(result.index === 1) {
								_this.data.$router.replace({ name: "my-orders", query: { "status": 0 }});
							}
						});
					}
				}
			});
			return true;
		},

		// 支付完成
		payCompleted(){
			return app.api.order.getOrderPayResult({}, controler.data.parameters.orderNumber).then((data)=>{
				if(data.isPaySuccess) {
					controler.gotoSuccessPage();
				} else {
					controler.gotoFailePage();
				}
			}).catch((error)=>{
				controler.gotoFailePage();
			});
		},

		// 获取成功页面的路由
		getSuccessRoute(){
			let name, params = {}, query = {};
			name = "payment-success";
			query = Object.assign({ payAmount: this.data.orderMoney }, this.data.parameters);
			return {name, params, query};
		},

		// 获取失败页的路由
		getFaileRoute(){
			let name, params = {}, query = {};
			name = "payment-failure";
			query = Object.assign({ payAmount: this.data.orderMoney, isCancel: this.isCancel }, this.data.parameters);
			return {name, params, query};
		},

		// 模拟支付
		mockPay(targetUrl){
			// 模拟支付返回的URL如果不带参数，后端拼接的URL会有问题所以必须加了个参数
			let {name, params, query} = this.getSuccessRoute();
			let returnUrl = app.utils.getUrlByRouterReflect(name, query, params, this.data.$router);
			window.location.href = targetUrl + (targetUrl.indexOf("?") === -1 ? "?" : "&") + "returnUrl=" + encodeURIComponent(encodeURIComponent(returnUrl));
		},

		// 微信环境下支付宝支付
		aliWapPay(data) {
//			let divElement = document.createElement("div"), queryParam = "";
//				divElement.style.display = "none";
//				divElement.innerHTML = data.result;
//				Array.prototype.slice.call(divElement.querySelectorAll("input[name]")).forEach(function (ele) {
//	                queryParam += (ele.name + "=" + encodeURIComponent(ele.value) + '&');
//	            });
//	            queryParam = queryParam.substr(0, queryParam.length - 1);
//          let gotoUrl = divElement.querySelector("form").getAttribute('action');
//          if(gotoUrl.indexOf("?") > 0 && gotoUrl.lastIndexOf("&") != gotoUrl.length -1) {
//          	gotoUrl += "&";
//          } else if(gotoUrl.indexOf("?") === -1){
//          	gotoUrl += "?";
//          }
//      	alipayWap.pay(gotoUrl + queryParam, Object.assign({ orderMoney: this.data.orderMoney }, this.data.parameters), this.data.$router);
			alipayWap.pay(data.targetUrl, Object.assign({ orderMoney: this.data.orderMoney }, this.data.parameters), this.data.$router);
		},

		// H5环境下的微信支付
		weixinH5Pay(data) {
//			window.location.href = data.result;
			window.location.href = data.result + "&redirect_url=" + encodeURIComponent(app.utils.getUrlByRouterReflect("weixin-wap-async", Object.assign({orderMoney: controler.data.orderMoney}, controler.data.parameters), {}, controler.data.$router));
		},

		// 微信环境下H5的jssdk支付
		weixinJsapiPay(data) {
			// 如果没有返回结果说明有问题
			if(!data.result) {
				mui.toast('支付出错...');
				return;
			}
			let _wx_js_pay_info = data.result;
			try {
				_wx_js_pay_info = JSON.parse(_wx_js_pay_info)
			} catch(e) {
				app.log.error(e)
			};
			if(!_wx_js_pay_info.appId) {
				mui.toast('支付出错...');
				return;
			}
			this.wxJsPayInfo = _wx_js_pay_info;
			if(typeof WeixinJSBridge == "undefined") {
				if(document.addEventListener) {
					this.isAddWeixinJSBridgeEvent = true;
					document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
				} else if(document.attachEvent) {
					_this.isAddWeixinJSBridgeEvent = true;
					document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
					document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
				}
			} else {
				this.onBridgeReady();
			}
		},

		onBridgeReady(){
			let _this = this;
			WeixinJSBridge.invoke(
				'getBrandWCPayRequest', {
					"appId": this.wxJsPayInfo.appId, //公众号名称，由商户传入
					"timeStamp": this.wxJsPayInfo.timeStamp + "", //时间戳，自1970年以来的秒数
					"nonceStr": this.wxJsPayInfo.nonceStr, //随机串
					"package": this.wxJsPayInfo.package,
					"signType": this.wxJsPayInfo.signType, //微信签名方式：
					"paySign": this.wxJsPayInfo.paySign //微信签名
				},
				function(res) {
					if(res.err_msg == "get_brand_wcpay_request:cancel" ) {
						_this.data.isCancelPay = true;
					}
					if(_this.data.payCountDownFun && typeof(_this.data.payCountDownFun) === "function") {
						_this.data.payCountDownFun();
					}
				}
			);
		},

		// 跳转至成功页
		gotoSuccessPage(){
			this.data.$router.push(this.getSuccessRoute());
		},

		// 跳转至失败页
		gotoFailePage(){
			this.data.$router.push(this.getFaileRoute());
		}
	};

	return {
		// 数据初始化
		init({orderMoney = 0, orderNumber = null, payCountDownFun = null, sourceType = null} = {}, $router, {landingPage = window.location.pathname, isMatch = true} = {}){
			if(controler.data.$router) {
				// 说明上次没有初始化
				this.destroy();
			}
			// 把当前用户信息绑定到其他公众账号上，主要用于另外的公众账号支付，因为针对于三七这种商品不能用724的账号去支付
			if(controler.bindOtherWx() === true) {
		        return false;
			}
			// 是否需要匹配landingPage，有值就匹配
			if(landingPage && app.Config.isWeiXin && /ip(hone|od|ad)/i.test(navigator.userAgent)) {
				//　由于微信 iOS支付授权目录 判断当前路径的规则分别是Landing Page，发现Landing Page不是当前的支付目录就刷新页面。
				// 我只想说单页应用iOS 微信支付真ＴＭ的坑
				if((!isMatch && store.state.appData.locationInfo.landingPage != landingPage) || (isMatch && store.state.appData.locationInfo.landingPage.indexOf(landingPage.substring(0, landingPage.lastIndexOf("/"))) != 0)) {
					window.location.replace(window.location.href);
					return false;
				}
			}

			let currentRoute = $router.currentRoute;
			if(sourceType) {
				controler.data.parameters.sourceType = sourceType;
			} else {
				controler.data.parameters.sourceType = currentRoute.query.sourceType;
			}
			if(orderNumber) {
				controler.data.parameters.orderNumber = orderNumber;
			} else {
				controler.data.parameters.orderNumber = currentRoute.params.orderNumber;
			}
			controler.data.parameters.conferencesCode = currentRoute.query.conferencesCode;
			controler.data.parameters.planId = currentRoute.query.planId;
			controler.data.payCountDownFun = payCountDownFun;
			controler.data.deviceSource = controler.getDeviceSource();
			controler.data.orderMoney = orderMoney;
			controler.data.wxJsPayInfo = null;
			controler.data.isAddWeixinJSBridgeEvent = false;
			controler.data.isCancelPay = false;
			controler.data.$router = $router;
			controler.updateHeaderLeft();
			return true;
		},
		
		// 设置数据
		setData({orderMoney = 0, orderNumber = null} = {}){
			if(orderMoney) controler.data.orderMoney = orderMoney;
			if(orderNumber) controler.data.parameters.orderNumber = orderNumber;
		},

		// 根据设备来源获取支付相关信息
		queryPayChannel(){
			return controler.queryPayChannel();
		},

		// 去支付
		gotoPay(clientUniqueName){
			dataReport.eventReport('click-pay', {orderNumber: controler.data.parameters.orderNumber});
			let inputData = {
				orderNumber: controler.data.parameters.orderNumber,
				clientUniqueName,
				deviceSource: controler.data.deviceSource
			}
			// 阿里wap支付
			if(clientUniqueName === "AlipayV2WapPay") {
				inputData.returnUrl = encodeURIComponent(encodeURIComponent(app.utils.getUrlByRouterReflect("alipay-wap-async", Object.assign({orderMoney: controler.data.orderMoney, isFromWeixinPay: app.Config.isWeiXin}, controler.data.parameters), {}, controler.data.$router)));
//				inputData.returnUrl = app.utils.getUrlByRouterReflect("alipay-wap-async", Object.assign({orderMoney: controler.data.orderMoney, isFromWeixinPay: app.Config.isWeiXin}, controler.data.parameters), {}, controler.data.$router);
//				inputData.returnUrl = app.Config.webapiDomain + 'payment/alipay-wap-async';
			}
			return app.api.order.pay(inputData, {
				isResultData: false
			}).then((response) => {
				if(clientUniqueName === "AlipayV2WapPay") {
					// 支付宝wap支付
					controler.aliWapPay(response.data);
				} else if(clientUniqueName === "WxJsApiPay"){
					controler.weixinJsapiPay(response.data);
				} else if(clientUniqueName === "WxH5Pay"){
					controler.weixinH5Pay(response.data);
				} else if(clientUniqueName === "MockPayClient"){
					controler.mockPay(response.data.targetUrl);
				}
			});
		},

		// 支付完成
		payCompleted(){
			return controler.payCompleted();
		},

		// 销毁
		destroy(){
			if(controler.data.isAddWeixinJSBridgeEvent) {
				controler.data.isAddWeixinJSBridgeEvent = false;
				if(document.removeEventListener) {
					document.removeEventListener('WeixinJSBridgeReady', controler.onBridgeReady, false);
				} else if(document.detachEvent) {
					document.detachEvent('WeixinJSBridgeReady', controler.onBridgeReady);
					document.detachEvent('onWeixinJSBridgeReady', controler.onBridgeReady);
				}
			}
			controler.data.$router = null;
		}
	};
})();
