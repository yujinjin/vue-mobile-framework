<template>
	<div class="iOS-web">
		<p>屏幕分辨率的高：{{screenHeight}}</p>
		<p>屏幕可用工作区高度：{{availHeight}}</p>
		<p>网页可见区域高：{{clientHeight}}</p>
		<p>网页可见区域高(包括边线的高)：{{offsetHeight}}</p>
	</div>
</template>
<script>
	module.exports = {
	    data: function(){
	        return {
	        	screenHeight: 0,
	        	availHeight: 0,
	        	clientHeight: 0,
	        	offsetHeight: 0
	        }
	    },
	    mounted(){
	    	this.init();
	    },
	    methods: {
	    	init(){
	    		this.screenHeight = window.screen.height; //屏幕分辨率的高
	    		this.availHeight = window.screen.availHeight; // 屏幕可用工作区高度
	    		this.clientHeight = document.body.clientHeight || document.documentElement.clientHeight; // 网页可见区域高
	    		this.offsetHeight = document.body.offsetHeight || document.documentElement.offsetHeight; // 网页可见区域高(包括边线的宽)
	    	}
	    }
	}
</script>
<style scoped lang="less">
	.iOS-web {
		height: 100%;
		width: 100%;
		border: 1px solid #09BA07;
	}
</style>