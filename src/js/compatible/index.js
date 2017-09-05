/**
 * 作者：yujinjin9@126.com
 * 时间：2017-08-08
 * 描述：H5要兼容微信、APP、手机浏览器、甚至PC，对于各个环境业务需求、技术实现都或多或少不一样的，这里就是把这些不同代码放在不同的环境中去实现，
 * 	这样尽最大可能的减少代码对各种环境判断的的混乱，方便开发及维护。
 */
import app from '../app'
import DefaultEnv from './default-env'
import AppEnv from './app-env'
import WeixinEnv from './weixin-env'

export default function(){
	if (app.Config.isApp) {
		return new AppEnv();
	} else if(app.Config.isWeiXin) {
		return new WeixinEnv();
	} else {
		return new DefaultEnv();
	}
}
