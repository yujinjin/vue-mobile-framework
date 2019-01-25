<template>
	<div class="tooltip" :class="classes" v-show="isShow" @click.stop.prevent>
		<div class="tooltip-arrow"></div>
		<div class="tooltip-inner" v-html="content"></div>
	</div>
</template>
<script>
	module.exports = {
		data: function() {
			return {
				isShow: false,
				classes: [],
				content: ""
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			// 弹层数据初始化
			init: function() {
				//this.show = true;
			},
			initValue(options){
				if(typeof(options) === "string") {
					options = {content: options};
				}
				this.content = options.content || "";
				this.classes = options.classes || [];
			},
			show(){
				this.isShow = true;
			},
			hide(){
				this.isShow = false;
			},
			toggle(){
				this.isShow = !this.isShow;
			},
			// destroy
			destroy() {
				
			}
		}
	}
</script>
<style lang="less" scoped>
	.tooltip {
		position: absolute;
		left: 0px;
		top: 0px;
		
		&.fade {
			opacity: 0;
		}
		
		.tooltip-arrow {
			width: 0;
		    height: 0;
		    border-style: solid;
		    position: absolute;
		    /*margin: 5px;*/
		    border-color: #666;
		}
		
		&.top { 
			padding-bottom: 7px;
			
			.tooltip-arrow {
				border-width: 5px 5px 0;
			    border-left-color: transparent!important;
			    border-right-color: transparent!important;
			    border-bottom-color: transparent!important;
			    bottom: -5px;
			    left: calc(~'50% - 5px');
			    margin-top: 0;
			    margin-bottom: 7px;
			}
		}
		&.right {
			padding-left: 5px;
			
			.tooltip-arrow {
				border-width: 5px 5px 5px 0;
			    border-left-color: transparent!important;
			    border-top-color: transparent!important;
			    border-bottom-color: transparent!important;
			    left: -5px;
			    top: calc(50% - 5px);
			    margin-left: 5px;
			    margin-right: 0;
			}
		}
		&.bottom {
			padding-top: 7px;
			
			.tooltip-arrow {
		    	border-width: 0 5px 5px;
			    border-left-color: transparent!important;
			    border-right-color: transparent!important;
			    border-top-color: transparent!important;
			    top: -5px;
			    left: calc(~'50% - 5px'); 
			    margin-top: 7px;
			    margin-bottom: 0;
		    }
		}
		
		&.left {
			padding-right: 5px;
			
			.tooltip-arrow {
		    	border-width: 5px 0 5px 5px;
			    border-top-color: transparent!important;
			    border-right-color: transparent!important;
			    border-bottom-color: transparent!important;
			    right: -5px;
			    top: calc(50% - 5px);
			    margin-left: 0;
			    margin-right: 5px;
		    }
		}
		
		.tooltip-inner {
			max-width: 250px;
			background: #666666;
		    padding: 5px;
		    border-radius: 4px;
		    display: inline-block;
		    text-align: left;
		    color: #FFFFFF;
		    font-size: 12px;
		    line-height: 20px;
		    font-weight: normal;
		}
	}
</style>