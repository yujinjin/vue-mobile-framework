/**
 * 作者：yujinjin9@126.com
 * 时间：2015-08-04
 * 描述：用户中心API接口
 */
define(function () {
    //用户
    return {
    	//登录用户
        "login": function(ajaxOptions){
        	return Promise.resolve({
        		"token":"Bearer DXNTafuHoaWUe4Ayd6uLzMLY8cdszw8fsRmODAExaH4aP7uV25_s-fqp7MAA5SGd2lKkLJGVNpNA73aKC_jodvnHTPT9x2_xONZzAyPXekpJ37c9As6D2DKZbsAVKJS21mzBRVTxyLixpL5MFngz7Ps6ZhHtBqd1AFrXg91grlu0yYoPM4BJ5CFNB7X1FfQvygrhJMusPN7_JwaAyrC6nlGtPAoWj5GDJJUbCu1zE1zBgzw_DN-RJBgge5olmlJudJhchCZdPcT90KwdLjVMzZAHMy_GedEf7FkOeYeMWcMWeoYj3qeq9ww2IZojgTJWCWA3BWH9S5udVCQI--tSoIx3msE4Tkeyscb1yrzXVOPYYzQ8-qamHaH6O0IFiMAsNmchJYgmNYz_gJrftSvTp4AgxW2QZUDn2SNxwdGJUyzxFGF8T-bDuMMBx0K60mihxFzbSw",
        		"expiredTime":1504964826205,
        		"version":"999.999.999",
        		"name": "test",
        		"userId": 1
        	});
        }
    }
});