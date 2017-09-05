<template>
	<div class="modal fade" v-show="show" v-bind:style="{backgroundColor:opacity}" @click.stop.prevent="modalFadeClick">
		<div class="modal-dialog" :class="className">
			<div class="modal-content" v-bind:style="{width: width?width:'270px', height: height?height:'inherit'}">
				<div class="modal-header" v-if="title">
					<h4 class="modal-title" v-html="title"></h4>
				</div>
				<div class="modal-body" ref="body" v-if="contents" @click.stop>
					<div class="modal-body-con" v-html="contents"></div>
				</div>
				<div class="modal-footer" v-if="buttons.length > 0">
					<div class="modal-button" :class="buttonItem.className" v-for="(buttonItem, index) in buttons" :key="index" @click.stop.prevent="buttonClick(buttonItem);" v-html="buttonItem.label">{{buttonItem.label}}</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	module.exports = {
		data: function() {
			return {
				ISroll: {
					options: {}, //ISroll配置参数
					isUse: false, //是否使用
					ISrollInstance: null, //初始化后的ISroll实例对象
				},
				initCallback: null, //初始化后的回调方法
				show: false, //是否显示弹层
				autoHide: true, //点击遮罩层是否隐藏
				opacity: "", //遮罩层透明度
				animated: true, //是否添加动画
				className: null,
				contents: null, //
				title: null, //标题
				width: 270, //弹层宽度
				height: null, //弹层高度
				buttons: [], //{className|label|callback}
				onClose: null // 用户关闭后的方法
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			// 弹层数据初始化
			init: function() {
				this.show = true;
				this.addDocumentPreventEvent();
				if(this.ISroll.isUse) {
					this.IScrollInit();
				} else if(this.initCallback && typeof(this.initCallback) === "function") {
					this.$nextTick(()=>this.initCallback(this.$refs.body));
				}
			},
			
			// IScroll初始化
			IScrollInit: function() {
				var _this = this;
				this.destroyIScroll();
				require(["iscroll"], function(IScroll) {
					var _IScrollOption = {
						preventDefault: false,
						hScroll: false,
						vScroll: true,
						scrollbars: true
					};
					if(_this.ISroll.options && typeof(_this.ISroll.options) === "object") {
						_IScrollOption = app.utils.extend(true, _IScrollOption, _this.ISroll.option);
					}
					_this.$nextTick(function(){
						_this.ISroll.ISrollInstance = new IScroll(_this.$refs.body, _IScrollOption);
						if(_this.initCallback && typeof(_this.initCallback) === "function") {
							_this.initCallback(_this.$refs.body);
						}
					});
				});
			},
			
			//阻止事件
			preventDefault: function(e) {
				e.preventDefault();
			},
			
			// 阻止弹窗背后的页面滚动事件
			addDocumentPreventEvent: function() {
				document.addEventListener("touchmove", this.preventDefault, false); //阻止浏览器默认事件
				document.addEventListener("mousewheel", this.preventDefault, false); //阻止浏览器默认事件
			},
			
			// 移除弹窗背后的页面滚动事件
			removeDocumentPreventEvent: function() {
				document.removeEventListener("touchmove", this.preventDefault, false); //释放浏览器默认事件
				document.removeEventListener("mousewheel", this.preventDefault, false); //释放浏览器默认事件
			},
			
			//按钮点击事件
			buttonClick: function(buttonItem) {
				var _this = this;
				if(buttonItem.callback && typeof(buttonItem.callback) === "function") {
					buttonItem.callback(_this.$refs.body);
				}
			},

			//点击遮罩层是否隐藏
			modalFadeClick: function() {
				if(this.autoHide === true && this.onClose) {
					this.onClose();
				}
			},
			
			// 销毁IScroll插件
			destroyIScroll(){
				if(this.ISroll.ISrollInstance) {
					this.ISroll.ISrollInstance.destroy();
					this.ISroll.ISrollInstance = null;
				}
			},
			
			// destroy
			destroy: function() {
				var _this = this;
				this.destroyIScroll();
				this.removeDocumentPreventEvent();
				this.show = false;
				this.autoHide = true;
				this.opacity = "";
				this.animated = true;
				this.className = null;
				this.contents = null;
				this.title = null;
				this.width = 270;
				this.height = null;
				this.buttons = [];
			}
		}
	}
</script>
<style lang="less" scoped>
	/* === 弹层样式  (start) === */
	/* === Modals === */
	
	.modal {
		position: fixed;
		z-index: 9998;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .8);
		display: table;
		transition: opacity .3s ease;
		.modal-dialog {
			display: table-cell;
			vertical-align: middle;
		}
		.modal-content {
			width: 270px;
			max-width: 540px;
			margin: 0px auto;
			background-color: #fff;
			border-radius: 7px;
			transition: all .3s ease;
			box-sizing: border-box;
			//			max-height:330px;
			.modal-header h4 {
				font-size: 16px;
				font-weight: 300;
				color: #333;
				text-align: center;
				padding-top: 10px;
			}
			.modal-body {
				position: relative;
				max-height: 250px;
				overflow: hidden;
				.modal-body-con {
					padding: 15px 15px 24px;
					color: #333;
				}
			}
			.modal-footer {
				height: 42px;
				line-height: 42px;
				text-align: center;
				border-top: 1px solid #e4e4e4;
				font-size: 14px;
				color: #d70000;
			}
		}
		.modal-vertical-buttons,
		.actions-modal-group {
			.modal-footer {
				height: auto;
				line-height: auto;
				.modal-button {
					width: 100%;
					height: 42px;
					line-height: 42px;
				}
				.modal-button:not(:first-child) {
					border-top: 1px solid #e4e4e4;
					text-align: center;
					color: #666;
				}
			}
		}
		.actions-modal-group {
			transition: all .4s ease;
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
		}
		.actions-modal-group .modal-content {
			border-radius: 0;
			width: auto;
		}
		.actions-modal-group .modal-body {
			padding: 10px 0 0;
		}
		.modal-confirm,
		.modal-prompt,
		.modal-confirm-notitle {
			.modal-footer {
				div:first-child {
					border-right: 1px solid #e4e4e4;
					box-sizing: border-box;
				}
				.button-ok,
				.button-cancel {
					width: 50%;
					float: left;
				}
				.button-cancel {
					color: #666;
				}
			}
		}
		.modal-confirm-notitle {
			.modal-body {
				min-height: 66px;
				width: 100%;
				display: table;
				text-align: center;
				.modal-body-con {
					padding-bottom: 15px;
					display: table-cell;
					vertical-align: middle
				}
			}
		}
		.modal-alert {
			.modal-footer {
				.button-alert {
					width: 100%;
					text-align: center;
				}
			}
		}
		.modal-alert-notitle {
			.modal-body {
				min-height: 66px;
				width: 100%;
				display: table;
				text-align: center;
				.modal-body-con {
					display: table-cell;
					vertical-align: middle;
					padding-bottom: 15px;
				}
			}
		}
		.modal-info .modal-content,
		.modal-error .modal-content,
		.modal-success .modal-content {
			box-shadow: none;
			color: #fff;
			font-size: 14px;
			width: auto;
			background: none;
			text-align: center;
		}
		.modal-info .modal-content .modal-body,
		.modal-error .modal-content .modal-body,
		.modal-success .modal-content .modal-body {
			padding: 10px 20px;
			box-sizing: border-box;
			background-color: rgba(0, 0, 0, .7);
			text-align: center;
			border-radius: 5px;
			display: inline-block;
			margin: 0 20px;
		}
		.modal-success .modal-content .modal-body .modal-body-con,
		.modal-info .modal-content .modal-body .modal-body-con,
		.modal-error .modal-content .modal-body .modal-body-con {
			padding: 0;
			color: #fff;
		}
		.modal-prompt .modal-body input {
			width: 100%;
			border: 1px solid #ccc;
			height: 40px;
			box-shadow: 1px 1px #e4e4e4;
			padding-left: 5px;
		}
	}
	
	.modal .modal-explain {
		transition: all .4s ease;
	}
	
	.modal .modal-explain .modal-content {
		background: none;
		color: #fff;
		text-align: left;
		margin-top: -50px;
	}
	
	.modal .modal-explain .modal-body .modal-body-con,
	.modal .modal-explain .modal-content .modal-header h4 {
		color: #fff;
	}
	
	.modal .modal-explain .modal-content .modal-footer {
		position: fixed;
		bottom: 36px;
		left: 0;
		width: 100%;
		border-top: none;
	}
	
	.modal .modal-explain .modal-footer .button-explain {
		position: absolute;
		left: 50%;
		top: 10px;
		width: 23px;
		height: 23px;
		margin-left: -12px;
		background: url(../../../imgs/colse.png) no-repeat;
		background-size: 23px 23px;
	}
	
	.modal .modal-explain .modal-content .modal-body {
		max-height: 300px;
		overflow: auto;
	}
	
	.disbackground {
		background: rgb(255, 255, 255, .0)
	}
	
	.custom-fluid {
		.modal-content {
			height: 100%;
			width: 100%;
			background-color: initial;
		}
		.modal-content .modal-header h4 {
			color: #fff;
			border-bottom: 1px solid #666;
			height: 56px;
			line-height: 56px;
		}
		.modal-content .modal-footer {
			border-top: 0px solid #666;
			// position:fixed;
			// bottom:0;
			// left:0;
			// right:0; 
			height: 150px;
			text-align: center;
		}
		.detail-con {
			padding: 6px 10px;
			color: #fff;
			.price-detail-con {
				padding: 5px 0;
				li {
					position: relative;
					padding-right: 50px;
					padding: 5px 50px 5px 0;
				}
				.fr {
					position: absolute;
					right: 0;
					top: 5px;
				}
			}
			p {
				padding: 8px 0 2px;
			}
		}
		//	    .modal-content .modal-footer .total{
		//	    	padding:0 10px;
		//	    	text-align: left;
		//			line-height: 28px;
		//			.d7000{color:#d70000}
		//	    }
		.modal-button {
			position: relative;
		}
		.modal-button .colse {
			width: 20px;
			height: 20px;
			position: fixed;
			left: 50%;
			margin-left: -10px;
			bottom: 50px;
		}
		.modal-button .colse img {
			width: 100%;
			height: 100%;
			vertical-align: middle;
		}
	}
	
	.modal .total {
		position: relative;
		overflow: hidden;
		height: 40px;
		border-top: 1px solid #666;
		font-size: 14px;
		color: #fff;
		padding: 8px 18px;
		line-height: 18px;
		text-align: left;
		.d7000 {
			color: #F17C7C;
			font-size: 12px;
		}
	}
</style>