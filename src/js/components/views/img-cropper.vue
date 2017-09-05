<template>
	<div class="img-cropper">
		<div ref="popover" class="mui-popover">
			<header class="mui-bar mui-bar-nav">
				<a @click="$emit('cancelCallback');" class="mui-icon mui-pull-left">取消</a>
				<!--<h1 class="mui-title">图片裁剪</h1>-->
				<a @click="finish" class="mui-icon mui-pull-right right-bar-text">完成</a>
			</header>
			<div class="img-content">
				<vueCropper
					ref="cropper"
					:img="img"
					:info="false"
					outputType="png"
					:canScale="false"
					:autoCrop="true"
					:autoCropWidth="200"
					:autoCropHeight="200"
					:fixed="fixed"
					:fixedNumber="[1, 1]"></vueCropper>
			</div>
		</div>
	</div>
</template>
<script>
	import vueCropper from 'vue-cropper'
	export default{
		data(){
			return {};
		},
		props: [
			'isShow', //是否显示
			'img',	 //裁剪图片
			'isSquare',  //是否保持正方形
			'finishCallback',  //完成后的callback
			'cancelCallback'	//取消后的callback
		],
		components: {
			vueCropper
		},
		methods: {
			show(){
				mui(this.$refs['popover']).popover("show");
			},
			hide(){
				mui(this.$refs['popover']).popover("hide");
			},
			finish(){
				this.$refs.cropper.getCropData((data) => {
					let blob = dataURLtoBlob(data);
					this.uploadImage(blob);
					function dataURLtoBlob(dataurl) {
						var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
							bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
						while(n--){
							u8arr[n] = bstr.charCodeAt(n);
						}
						return new Blob([u8arr], {type:mime});
					}
				})
			},
			uploadImage(file){
				app.api.common.imageUpload({isShowLoading: true},{"file": file}).then((response) => {
					this.$emit('finishCallback',response);
				});
			},
		},
		computed:{
			fixed(){
			    return this.isSquare ? this.isSquare : false;
			}
		},
		watch: {
			isShow(newVal){
				if (newVal) {
					this.show();
				} else {
					this.hide();
				}
			}
		}
	}
</script>
<style lang="less" rel="stylesheet/less" type="text/css" scoped>
	.mui-popover {
		border-radius: 0px;
		background: #fff;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		.mui-bar.mui-bar-nav {
			border-radius: 0px;
			background: #fff;
			.mui-pull-left,.mui-pull-right {
				font-size: 14px;
				line-height: 24px;
				color: #666;
			}
		}
		.img-content {
			position: fixed;
			top: 44px;
			left: 0;
			right: 0;
			bottom: 0;
		}
	}
</style>
<style lang="less" rel="stylesheet/less" type="text/css">
	//防止图片变形
	.cropper-view-box img {
		max-width: none !important;
	}

	//防止图片可以移动
	.vue-cropper {
		pointer-events: none;
	}

	.cropper-crop-box {
		pointer-events: auto;
	}
</style>
