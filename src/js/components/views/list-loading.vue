<template>
	<div class="isShowLoading" v-show="isShowLoading">
       	<div class="loading overlay">
			<div class="content-block">
				<span class="icon-bars">
					<svg viewBox="0 0 64 64">
						<g stroke-width="4" stroke-linecap="round">
							<line y1="17" y2="29" transform="translate(32,32) rotate(180)">
								<animate attributeName="stroke-opacity" dur="750ms" values="1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1" repeatCount="indefinite"></animate>
							</line>
							<line y1="17" y2="29" transform="translate(32,32) rotate(210)">
								<animate attributeName="stroke-opacity" dur="750ms" values="0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0" repeatCount="indefinite"></animate>
							</line>
							<line y1="17" y2="29" transform="translate(32,32) rotate(240)">
								<animate attributeName="stroke-opacity" dur="750ms" values=".1;0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1" repeatCount="indefinite"></animate>
							</line>
							<line y1="17" y2="29" transform="translate(32,32) rotate(270)">
								<animate attributeName="stroke-opacity" dur="750ms" values=".15;.1;0;1;.85;.7;.65;.55;.45;.35;.25;.15" repeatCount="indefinite"></animate>
							</line>
							<line y1="17" y2="29" transform="translate(32,32) rotate(300)">
								<animate attributeName="stroke-opacity" dur="750ms" values=".25;.15;.1;0;1;.85;.7;.65;.55;.45;.35;.25" repeatCount="indefinite"></animate>
							</line>
							<line y1="17" y2="29" transform="translate(32,32) rotate(330)">
								<animate attributeName="stroke-opacity" dur="750ms" values=".35;.25;.15;.1;0;1;.85;.7;.65;.55;.45;.35" repeatCount="indefinite"></animate>
							</line>
							<line y1="17" y2="29" transform="translate(32,32) rotate(0)">
								<animate attributeName="stroke-opacity" dur="750ms" values=".45;.35;.25;.15;.1;0;1;.85;.7;.65;.55;.45" repeatCount="indefinite"></animate>
							</line>
							<line y1="17" y2="29" transform="translate(32,32) rotate(30)">
								<animate attributeName="stroke-opacity" dur="750ms" values=".55;.45;.35;.25;.15;.1;0;1;.85;.7;.65;.55" repeatCount="indefinite"></animate>
							</line>
							<line y1="17" y2="29" transform="translate(32,32) rotate(60)">
								<animate attributeName="stroke-opacity" dur="750ms" values=".65;.55;.45;.35;.25;.15;.1;0;1;.85;.7;.65" repeatCount="indefinite"></animate>
							</line>
							<line y1="17" y2="29" transform="translate(32,32) rotate(90)">
								<animate attributeName="stroke-opacity" dur="750ms" values=".7;.65;.55;.45;.35;.25;.15;.1;0;1;.85;.7" repeatCount="indefinite"></animate>
							</line>
							<line y1="17" y2="29" transform="translate(32,32) rotate(120)">
								<animate attributeName="stroke-opacity" dur="750ms" values=".85;.7;.65;.55;.45;.35;.25;.15;.1;0;1;.85" repeatCount="indefinite"></animate>
							</line>
							<line y1="17" y2="29" transform="translate(32,32) rotate(150)">
								<animate attributeName="stroke-opacity" dur="750ms" values="1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1" repeatCount="indefinite"></animate>
							</line>
						</g>
					</svg>
				</span>
		        <span class="indicator-text">加载中...</span>
			</div>
		</div>
    </div>
</template>

<script>
	module.exports = {
		data(){
			return {
				isShowLoading: false, // 是否显示加载中
			}
		},
		mounted(){},
		methods: {
			// 显示
			showLoading(){
				this.isShowLoading = true;
			},
			// 隐藏
			hideLoading(){
				this.isShowLoading = false;
			}
		}
	}
</script>

<style lang="less" rel="stylesheet/less" type="text/css">
	.isShowLoading {
		.overlay {
			z-index: 5;
		    width: 100%;
		    height: 100%;
		    left:0;
		    top:0;
		    right:0;
		    bottom:0;
		    text-align: center;
		    color:#999;
		    position:absolute;
			background: #f2f2f2;
		}

		.content-block {
			padding: 15px;
		    text-align: center;
		    color:#999;
		    position:absolute;
		    left:50%;
		    top:50%;
		    -webkit-transform: translate(-50%,-50%);
			transform: translate(-50%,-50%);
			border-radius: 5px;
			font-size: 16px;
			line-height: 30px;
			vertical-align: middle;
			span{
				display: block;
			}
			.indicator-text{
				color:#AAAAAA;
				font-size: 12px;
			}
		    .icon-bars {
				height:60px;
		    	text-align: center;
		    	stroke: #AAAAAA;
		    	fill: #fff;
				margin-right: 10px;
		    	svg {
		    		width: 50px;
		    		height: 50px;
		    	}
		    }
		}
	}
</style>
