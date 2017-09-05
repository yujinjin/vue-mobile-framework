/**
 * 作者：yujinjin9@126.com
 * 时间：2017-09-01
 * 描述：html5的前端图片压缩，使用了lrz插件
 */
import lrz from "lrz"

/**
 * @param {file} file 文件流
 * @param {Object} 压缩的配置项内容，width：图片最大不超过的宽度，默认为原图宽度，宽度不设时会适应宽度，height:图片最大不超过的高度，默认为原图高度，高度不设时会适应高度，
 * 	fiedldName: 后端接收的字段名，quality：图片压缩质量，取值 0 - 1，默认为0.7，maxSize:图片超过该尺寸才压缩
 * 
 * 用法就是imageResizer(item).then(({base64, file}=>{});
 */
export default function(file, {width, height, fieldName="file", quality=0.7, maxSize=200*1024}={}){
	if(!file || !file.size) {
		throw new Error('没有图片上传');
		return;
	}
	if(file.size < maxSize){
		return new Promise(function (resolve, reject) {
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function(theFile) {
				let image = new Image();
			   	image.src = theFile.target.result;
			   	image.onload = function() {
					resolve({
						base64: this.src,
						file: file
					});
			   	};
			};
		});
	}
	return lrz(file, {width, height, fieldName, quality});
}
