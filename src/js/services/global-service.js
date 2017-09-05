/**
 * 作者：yujinjin9@126.com
 * 时间：2015-08-04
 * 描述：APP 全局业务逻辑
 */
export default{
	//判断当前用户信息是否登录
	isLogin() {
		if(this.getLoginUserInfo().token){
			return true;
		}
        return false;
    },

    //获取用户登录的Token信息
    getLoginUserInfo(){
    	const [_currentTime, _userInfo] = [(new Date()).getTime(), app.getSiteLocalStorage().userInfo || {}];
    	//如果没有邀请码肯定是要重新登录的。
    	if(_userInfo.expiredTime && (_userInfo.expiredTime - _currentTime) > 0 && _userInfo.referralCode && _userInfo.info) {
    		return _userInfo;
    	} else {
    		app.globalService.setUserInfo({});
    		return {};
    	}
    },

    //退出登录
    logOut(){
    	app.globalService.setUserInfo({});
    },

    // 设置用户信息
    setUserInfo({referralCode, token, usernameOrEmailAddress, expiredTime = -1, info = {}}) {
    	const _site_local_storage = app.getSiteLocalStorage();
    	let _is_save = true;
    	if(expiredTime > 0) {
			if(_site_local_storage.userInfo == null || typeof(_site_local_storage.userInfo) != "object"){
				_site_local_storage.userInfo = {};
			}
			expiredTime = (new Date()).getTime() + (expiredTime - 60) * 1000;
			Object.assign(_site_local_storage.userInfo, {referralCode, token, usernameOrEmailAddress, expiredTime, version: app.Config.innerVersion, info: info});
    	} else if(JSON.stringify(_site_local_storage.userInfo) !== "{}"){
    		_site_local_storage.userInfo = {};
    	} else {
    		_is_save = false;
    	}
    	if(_is_save) {
    		app.utils.localStorage("siteLocalStorage", JSON.stringify(_site_local_storage));
    	}
    },

    //获取userKey
    getUserKey(){
    	return "";
    }
}
