/**
 * 作者：yujinjin9@126.com
 * 时间：2017-03-04
 * 描述：常用API接口
 */
module.exports = {
	//图片上传
	"imageUpload": function(ajaxOptions, inputData) {
		let formData = new FormData();
		if(inputData && typeof(inputData) === "object"){
			for(let key in inputData){
				formData.append(key, inputData[key]);
			}
		}
		if(ajaxOptions && ajaxOptions.isShowLoading) {
			app.showLoading();
		}
		return app.ajax.axios.post(config.uploadImgServer, formData,
			Object.assign({
				headers: {'Content-Type': 'multipart/form-data'}
			}, ajaxOptions)).then((response)=>{
				if(ajaxOptions && ajaxOptions.isShowLoading) {
					app.hideLoading();
				}
				return response;
			}).catch((error)=>{
				if(ajaxOptions && ajaxOptions.isShowLoading) {
					app.hideLoading();
				}
				const xhr = error.response && error.response.data;
			    if (xhr && xhr.__abp && xhr.error) {
			    	if(xhr.error.message) {
			    		app.modals.error(xhr.error.message);
			    	} else if (xhr.error.validationErrors) {
		                var validationErrors = xhr.error.validationErrors;
		                var messages = "";
		                for (var i = 0; i < validationErrors.length; i++) {
		                    messages = messages + validationErrors[i].message + " ";
		                }
		                app.modals.error(messages);
		            }
		        } else {
		        	app.modals.error("小七带着服务器去保养喽，请稍后重试~");
		        }
				return Promise.reject(error);
			});
	},

	//微信SDK授权配置获取
	"weixinconfig": function({ url = window.location.href.split('#')[0]}){
		return Promise.resolve({appId: "", timestamp: "", nonceStr: "", signature: ""});
	},
	
	// log消息
	"sendLogMessage": function(inputData) {
		return Promise.resolve(true);
	},
	
	// 获取当前app中H5和navtive的路由配置
	"queryRoutesList": function(){
		return Promise.resolve([{
			"name": "home",
			"isNative": true
		}, {
			"name": "product-category",
			"isNative": true
		}, {
			"name": "search",
			"isNative": true
		}, {
			"name": "product-brand",
			"isNative": true
		}, {
			"name": "discovery-list",
			"isNative": true
		}, {
			"name": "shopping-cart",
			"isNative": true
		}, {
			"name": "login",
			"isNative": true
		}]);
	}
}