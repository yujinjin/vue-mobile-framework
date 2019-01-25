/**
 * 作者：yujinjin9@126.com
 * 时间：2015-08-04
 * 描述：APP 全局业务逻辑
 */
import store from "../store/"
import utils from "../utils/utils"

export default{
	/**
	 * 判断当前用户信息是否登录
	 * @param {Number} authType 登录权限的类型 1：访客权限（用户微信已授权，但未注册手机号）， 2： 登录权限（用户已注册手机号） 默认情况下是需要登录注册才能放访问的
	 */
	isLogin(authType = 2) {
		if(!store.state.appData.locationInfo.loginUserInfo
			|| !store.state.appData.locationInfo.loginUserInfo.token
			|| store.state.appData.locationInfo.loginUserInfo.expiredTime <= (new Date()).getTime()) {
			return false;
		}
		return (authType == 2 ? store.state.appData.locationInfo.loginUserInfo.isBindMobile : true);
    },
    
    // 获取当前登录用户的权限类型
    getAuthType(){
    	if(this.isLogin()) {
    		return 2;
    	} else if(this.isLogin(1)) {
    		return 1;
    	} else {
    		return 0
    	}
    },

    // 是否需要绑定手机号（当前用户有登录但未绑定手机号，就是需要绑定手机号）
	isRequireBindMobile() {
		return this.isLogin(1) && !store.state.appData.locationInfo.loginUserInfo.isBindMobile;
	},

//  // 判断当前用户是否有登录,有可能是未绑定手机号
//  isRegist(){
//  	return !!(store.state.appData.locationInfo.loginUserInfo
//      	&& store.state.appData.locationInfo.loginUserInfo.token
//      	&& store.state.appData.locationInfo.loginUserInfo.expiredTime > (new Date()).getTime());
//  },

    // 获取当前登录用户的token,这有可能当前登录的用户是未绑定手机号
    getLoginUserToken(){
        if(this.isLogin(1)) {
            return store.state.appData.locationInfo.loginUserInfo.token;
        } else {
            return null;
        }
    },

	// 获取缓存中的登录信息
	getStoreLoginUserInfo(){
		if(store.state.appData.locationInfo.loginUserInfo && store.state.appData.locationInfo.loginUserInfo.expiredTime > (new Date()).getTime()) {
			return {
				token: store.state.appData.locationInfo.loginUserInfo.token,
				expiredTime: store.state.appData.locationInfo.loginUserInfo.expiredTime,
				referralCode: store.state.appData.locationInfo.loginUserInfo.referralCode,
				isBindMobile: store.state.appData.locationInfo.loginUserInfo.isBindMobile,
				userId: store.state.appData.locationInfo.loginUserInfo.userId,
				name: store.state.appData.locationInfo.loginUserInfo.name,
				headImgURL: store.state.appData.locationInfo.loginUserInfo.headImgURL,
				fullName: store.state.appData.locationInfo.loginUserInfo.fullName
			};
		} else {
			return {};
		}
	},

    //获取用户登录的Token信息
    getLocalLoginUserInfo(){
    	let _login_user_info = this.getSiteLocalStorage("userInfo");
        if(!_login_user_info) {
            return {};
        }
        let _current_time = (new Date()).getTime();
        if(_login_user_info.expiredTime && _login_user_info.expiredTime > _current_time && _login_user_info.referralCode && _login_user_info.info) {
            return _login_user_info;
        } else {
            this.setUserInfo({});
            return {};
        }
    },

    //退出登录
    logOut(){
    	app.globalService.setUserInfo({});
    },

    // 设置用户信息
    setUserInfo({referralCode, token, expiredTime = -1, info = {}, isBindMobile = false}) {
    	let _login_user_info = this.getSiteLocalStorage("userInfo");
    	if(expiredTime > 0) {
			if(_login_user_info == null || typeof(_login_user_info) != "object"){
				_login_user_info = {};
			}
			expiredTime = new Date().getTime() + (expiredTime - 60) * 1000;
            Object.assign(_login_user_info, {referralCode, token, isBindMobile: false, expiredTime, version: app.Config.innerVersion, info: info});
            this.setSiteLocalStorage("userInfo", _login_user_info);
            store.dispatch("updateLocationInfo", {key: "loginUserInfo", value: {token, expiredTime, referralCode, isBindMobile, userId: info.userId, name: info.name, headImgURL: info.headImgURL, fullName: info.fullName}});
    		store.dispatch("trigger",{eventName: "setUserInfo", args: [{token, expiredTime, referralCode, isBindMobile, userId: info.userId, name: info.name, headImgURL: info.headImgURL, fullName: info.fullName}]});
    	} else if(_login_user_info){
            this.setSiteLocalStorage("userInfo");
            store.dispatch("updateLocationInfo", {key: "loginUserInfo", value: null});
            // 触发设置用户信息时的事件
    		store.dispatch("trigger",{eventName: "setUserInfo", args: []});
    	}
    },

    // 设置微信权限验证ID
    setWxAuthenticateInfo({authenticateId, expiredTime = -1}){
    	let _wxAuthenticateInfo = this.getSiteLocalStorage("wxAuthenticateInfo");
    	if(expiredTime > 0) {
    		_wxAuthenticateInfo = {authenticateId, expiredTime: (new Date()).getTime() + expiredTime * 1000};
    		this.setSiteLocalStorage("wxAuthenticateInfo", _wxAuthenticateInfo);
    	} else if(_wxAuthenticateInfo) {
    		// 删除微信权限验证ID
    		this.setSiteLocalStorage("wxAuthenticateInfo");
    	}
    },

    // 获取用户微信code
    getWxAuthenticateInfo(){
    	let _wxAuthenticateInfo = this.getSiteLocalStorage("wxAuthenticateInfo") || {};
    	if(_wxAuthenticateInfo.expiredTime && _wxAuthenticateInfo.expiredTime > (new Date()).getTime()) {
    		// 如果当前的opendid是一个GUID就是之前redis缓存的数据，这样就作废掉。
    		if(_wxAuthenticateInfo.authenticateId && _wxAuthenticateInfo.authenticateId.length === 36){
    			_wxAuthenticateInfo.authenticateId = "";
    		}
    		return _wxAuthenticateInfo;
    	} else if(_wxAuthenticateInfo) {
    		// 删除微信权限验证ID
    		this.setSiteLocalStorage("wxAuthenticateInfo");
    	}
    	return {};
    },

    // 获取userKey
    getUserKey(){
    	let _userKey = this.getSiteLocalStorage("userKey");
    	if(!_userKey) {
    		_userKey = utils.generateGuid();
    		this.setSiteLocalStorage("userKey", _userKey);
    	}
    	return _userKey;
    },

    // 设置userKey
    setUserKey(userKey){
    	this.setSiteLocalStorage("userKey", userKey);
    },

    // 获取当前窗口的sessionID，如果没有就随机生成一个
	getSessionId(){
		if(typeof(window.sessionStorage) === "undefined"){
			return null;
		}
		let _sessionId = sessionStorage.getItem("sessionId");
		if(!_sessionId) {
			_sessionId = utils.generateRandomId();
			sessionStorage.setItem("sessionId", _sessionId);
		}
		return _sessionId;
	},

	// 设置sessionID
	setSessionId(sessionId){
		if(typeof(window.sessionStorage) === "undefined"){
			return;
		}
		sessionStorage.setItem("sessionId", sessionId);
	},

	// 获取当前设备ID，如果没有就随机生成一个
	getDeviceId(){
		let _deviceId = this.getSiteLocalStorage("deviceId");
		if(!_deviceId) {
    		// 如果没有userKey就动态生成一个
    		_deviceId = utils.generateGuid();
    		this.setSiteLocalStorage("deviceId", _deviceId);
    	}
    	return _deviceId;
	},

	// 设置当前设备ID
	setDeviceId(deviceId){
		this.setSiteLocalStorage("deviceId", deviceId);
	},

	// 设置购物车商品订单预览信息
	setShoppingCartOrderPreviewInfo(info){
		this.setSiteLocalStorage("shoppingCartOrderPreviewInfo", info);
	},

	// 获取购物车商品订单预览信息
	getShoppingCartOrderPreviewInfo(id){
		let _shoppingCartOrderPreviewInfo = this.getSiteLocalStorage("shoppingCartOrderPreviewInfo");
		if (_shoppingCartOrderPreviewInfo && _shoppingCartOrderPreviewInfo.id == id) {
			return _shoppingCartOrderPreviewInfo;
		}
	},
	// 设置订单选择的地址id
	setOrderSubmitSelectedAddressId(id){
		this.setSiteLocalStorage("orderSubmitSelectedAddressId", id);
	},

	// 获取订单选择的地址id
	getOrderSubmitSelectedAddressId(){
		return this.getSiteLocalStorage("orderSubmitSelectedAddressId");
	},

	// 添加搜索的产品关键词到本地
	addSearchKeyword(keyword) {
		if(!keyword) {
			return;
		}
		let searchKeywordHistory = this.getSiteLocalStorage("searchKeywordHistory");
		if(!searchKeywordHistory) {
			searchKeywordHistory = [];
		}
		if(searchKeywordHistory.length > 0) {
			let index = searchKeywordHistory.findIndex((value, index)=>{
				return keyword == value;
			});
			if(index >= 0) {
				searchKeywordHistory.splice(index, 1);
			}
			searchKeywordHistory.splice(0, 0, keyword);
		} else {
			searchKeywordHistory.push(keyword);
		}
		this.setSiteLocalStorage("searchKeywordHistory", searchKeywordHistory);
		return searchKeywordHistory;
	},

	// 获取本地搜索的产品关键词历史
	getSearchKeywordHistory(){
		return this.getSiteLocalStorage("searchKeywordHistory") || [];
	},

	// 删除本地搜索的产品关键词历史
	clearSearchKeyword(){
		let searchKeywordHistory = this.getSiteLocalStorage("searchKeywordHistory");
		if(searchKeywordHistory && searchKeywordHistory.length > 0) {
			this.setSiteLocalStorage("searchKeywordHistory");
		}
		return searchKeywordHistory || [];
	},

	// 设置别人分享过来的code
	setInvitationCode(invitationCode) {
		if(invitationCode) {
			this.setSiteLocalStorage("invitationInfo", {code: invitationCode, expiredTime: (new Date()).getTime() + 30 * 24 * 60 * 60 * 1000});
		} else {
			this.setSiteLocalStorage("invitationInfo");
		}
	},

	// 获取别人分享过来的code
	getInvitationCode(){
		let invitationInfo = this.getSiteLocalStorage("invitationInfo");
		if(invitationInfo && invitationInfo.expiredTime && (invitationInfo.expiredTime - (new Date()).getTime()) > 0) {
			return invitationInfo.code;
		} else {
			this.setSiteLocalStorage("invitationInfo");
			return "";
		}
	},

	//设置引导页的标志
	setGuideFlag(position){
		this.setSiteLocalStorage(position, true);
	},

	//获取引导页标识
	getGuideFlag(position){
		return this.getSiteLocalStorage(position);
	},

	//设置订单确认页引导页的标志
	setOrderGuideFlag(){
		this.setSiteLocalStorage("orderGuideFlag", true);
	},

	//获取订单确认页引导页标识
	getOrderGuideFlag(){
		return this.getSiteLocalStorage("orderGuideFlag");
	},

	// 设置下次广告弹窗显示时间（次日0点）
	setAdvertisementExpiredTime(code) {
		let date =new Date()
		date.setDate(date.getDate() + 1)
		date.setHours(0)
		date.setMinutes(0)
		date.setSeconds(1)
		this.setSiteLocalStorage("advertisementNextShowTime_"  + code.toLowerCase(), date.getTime());
	},

	// 获取下次广告弹窗显示时间（次日的0点）
	getAdvertisementExpiredTime(code){
		return this.getSiteLocalStorage('advertisementNextShowTime_' + code.toLowerCase());
	},

	//获取站点本地存储信息
	getSiteLocalStorage: function(key){
		var _site_local_storage = utils.localStorage("siteLocalStorage");
		if (_site_local_storage) {
			try {
				_site_local_storage = JSON.parse(_site_local_storage);
			} catch (e) {
				site.log.error(e);
			}
		}
		if (_site_local_storage == null || typeof (_site_local_storage) != "object") {
			_site_local_storage = {};
        }
        if(key !== null && typeof(key) != "undefined") {
            return _site_local_storage[key];
        } else {
            return _site_local_storage;
        }
	},

	//设置站点本地存储信息
	setSiteLocalStorage(key, value){
        let _site_local_storage = this.getSiteLocalStorage();
		if(value !== null && typeof(value) != "undefined") {
			_site_local_storage[key] = value;
		} else if(key in _site_local_storage || _site_local_storage.hasOwnProperty(key)) {
			delete _site_local_storage[key];
		}
		utils.localStorage("siteLocalStorage", JSON.stringify(_site_local_storage));
	}
}
