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

	//列表日期格式化(不显示今年的年份，要显示往年的年份，格式为  yyyy-MM-dd hh:mm)
	listDateFormat(date){
		if(!date){
			return '';
		}
		return utils.dateFormat(new Date(date), 'yyyy-MM-dd hh:mm').replace(new Date().getFullYear()+'-','');
	},

	// 日期时间段显示格式化，1小时以内：mm 分钟前|24小时以内：hh 小时前|1-30天：dd 天前|30天以上：mm/dd|如果30天以上，并且跨年：yyyy/mm/dd
	timeDifferenceFormat(date) {
		if(!date) return '';
		let currentTime = new Date(), compareTime = new Date(date);
		let timeDifference = (currentTime.getTime() - compareTime.getTime()) / 1000;
		if(timeDifference < 60) {
			return "刚刚之前";
		} else if(timeDifference < 3600) {
			return parseInt(timeDifference/60, 10) + "分钟前"
		} else if(timeDifference < 60 * 60 * 24) {
			return parseInt(timeDifference/3600, 10) + "小时前"
		} else if(timeDifference < 60 * 60 * 24 * 30) {
			return parseInt(timeDifference/(60 * 60 * 24), 10) + "天前"
		} else if(compareTime.getFullYear() == currentTime.getFullYear()){
			return app.utils.dateFormat(compareTime, "MM/dd");
		} else {
			return app.utils.dateFormat(compareTime, "yyyy/MM/dd");
		}
	},

	// 资源图片URL
	imageUrl(url, size){
		return utils.getImageUrl(url, size);
	},

	// 背景图片设置
	backgroundImage(url){
		return {backgroundImage: 'url(' + utils.getImageUrl(url) + ')'};
	},

	// 货币格式化
	dateCurrency(num, digit) {
		if(typeof(num) != "number" && !num) {
			num = 0;
		}
		return utils.dateCurrency(num, digit);
	},

	// 性别枚举
	genderEnum(gender = 1) {
		return ['女','男'][gender];
	}
}
