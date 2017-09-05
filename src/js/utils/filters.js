/**
 * 作者：yujinjin9@126.com
 * 时间：2017-04-12
 * 描述：自定义过滤器
 */
import utils from './utils'
export default {
	// 日期格式化
	dateFormat(date, format){
		if(!date) {
			return "-";
		}
		return utils.dateFormat(new Date(date), format);
	},

	// 资源图片URL
	imageUrl(url, size){
		return utils.getImageUrl(url, size);
	},

	// 货币格式化
	dateCurrency(num, digit) {
		if(typeof(num) != "number" && !num) {
			num = 0;
		}
		return utils.dateCurrency(num, digit);
	}
}
