<!--
	作者：yujinjin9@126.com
	时间：2017-06-05
	描述：页面转场切换时的动画
-->
<template>
	<div class="router-transition overlay" @touchstart.stop.prevent v-show="isShow">
	    <div class="content-block">
	        <span class="icon-bars" :class="{'turn-on': effectFlag}"></span>
	        <span class="indicator-text">加载中...</span>
	    </div>
	</div>
</template>
<script>
	module.exports = {
		data(){
			return {
				isShow: false, // 是否显示页面路由转场动画、
				effectFlag: false, // 动画标记
			}
		},
		mounted(){},
		methods: {
			// 显示动画
			showTransition(){
				this.isShow = true;
				this.effectFlag = true;
			},
			// 结束动画
			endTransition(){
				this.isShow = false;
				this.effectFlag = false;
			}
		}
	}
</script>
<style lang="less" scoped>
	.router-transition {
		&.overlay {
			z-index: 2001;
		    width: 100%;
		    height: 100%;
		    left:0;
		    top:0;
		    right:0;
		    bottom:0;
		    text-align: center;
		    color:#999;
		    position:fixed;
		    background: rgba(255,255,255,1);
		}
		
		.content-block {
		    width: 100px;
		    height: 100px;
		    text-align: center;
		    color:#999;
		    position:fixed;
		    left:50%;
		    top:50%;
		    margin: -50px 0 0 -50px;
		    
		    .icon-bars {
		    	display: block;
			    width: 45px; height: 45px;
			    background: url("../../../imgs/wheel.png") no-repeat 0 0;
			    background-size: 45px 45px;
			    margin: 0 auto 10px;
		    }
		    
		    .turn-on {
		    	-webkit-animation: turn-on-transform .8s linear infinite normal both;
    			animation: turn-on-transform .8s linear infinite normal both;
		    }
		    
		    @-webkit-keyframes turn-on-transform{
			    0%{
			    	-webkit-transform:rotate(0deg);
			    }
			    100%{
			        -webkit-transform:rotate(360deg);
			    }
			}
			
			@keyframes turn-on-transform{
			  	0%{
			    	transform:rotate(0deg);
			    }
			    100%{
			        transform:rotate(360deg);
			    }
			}
		}
	}
</style>