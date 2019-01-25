/**
 * 作者：yujinjin9@126.com
 * 时间：2016-03-07
 * 描述：PRD 外部接口配置文件
 */
module.exports = {
	//当前环境
	env: "PRD",
	//M站点的接口地址
	webapiDomain: window.location.protocol + '//wx.jk724.com/',
	//图片上传服务
	uploadImgServer: window.location.protocol + '//resource.jk724.com/Uploader/UploadImage',
	//本地站点的地址
	localDomain: window.location.origin,
	//获取资源服务器地址
	imageDomain: window.location.protocol + '//img.jk724.com'
}
