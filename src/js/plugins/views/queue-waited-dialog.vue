<template>
	<div class="queue-waited-dialog fade" v-show="isShow" @touchmove.stop.prevent>
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="header-banner">
					<div class="icon-box">
						<img src="../../../imgs/spinner.svg" width="67" height="61"/>
					</div>
				</div>
				<div class="tips-content">
					前方人太多，小七压力山大
					<br>请稍后再试吧~
				</div>
				<div class="btn">倒计时：{{countDownInfo.second}}秒</div>
			</div>
		</div>
	</div>
</template>

<script>
	module.exports = {
		data: function() {
			return {
				isShow: false, //是否显示弹层
				onClose: null, // 用户关闭后的方法
				countDownInfo: {
					duration: 20, // 倒计时长5秒
					second: 0, // 倒计时秒数
					timerId: undefined //定时器ID
				}
			}
		},
		
		methods: {
			show(){
				this.isShow = true;
				this.countDownInfo.second = this.countDownInfo.duration;
				this.countDown();
			},
			
			countDown(){
				clearInterval(this.countDownInfo.timerId);
				this.countDownInfo.timerId = setInterval(()=>{
					-- this.countDownInfo.second;
					if(this.countDownInfo.second <= 0) {
						clearInterval(this.countDownInfo.timerId);
						this.show = true;
						this.onClose();
					}
				}, 1000);
			},
			
			destroy(){
				this.isShow = false;
				clearInterval(this.countDownInfo.timerId);
				this.countDownInfo.timerId = null;
			}
		},
		
		destroy: function() {
			this.destroy();
		}
	}
</script>

<style lang="less" scoped>
	.queue-waited-dialog {
		position: fixed;
		z-index: 9998;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: table;
		transition: opacity .3s ease;
		
		&.fade {
			background-color: rgba(0, 0, 0, .8);
		}
		
		.modal-dialog {
			display: table-cell;
			vertical-align: middle;
		}
		
		.modal-content {
			color: #FFFFFF;
			width: 270px;
			height: 320px;
			background-color: #38C864;
			border-radius: 30px;
			margin: 0px auto;
			
			.header-banner {
				padding-top: 35px;
				background-image: url(../../../imgs/floating-wadding.png);
				background-size: 241px 38px;
				background-repeat: no-repeat;
				background-position: 12px 39px;
				
				.icon-box {
					margin: 0px auto;
					height: 125px;
					width: 125px;
					border-radius:50%;
					background-color: #FFFFFF;
					text-align: center;
					line-height: 125px;
					box-shadow: 0px 0px 15px;
				}
			}
			
			.tips-content {
				text-align: center;
				padding: 27px 0px 22px;
				font-size: 15px;
				line-height: 24px;
			}
			
			.btn {
				width: 193px;
				height: 40px;
				line-height: 40px;
				text-align: center;
				border-radius: 5px;
				background-color: #FFFFFF;
				opacity: 0.9;
				color: #29BD56;
				font-weight: bold;
				font-size: 14px;
				margin: 0 auto;
			}
		}
	}
</style>