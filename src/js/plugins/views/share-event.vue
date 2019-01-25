<template>
	<div class="share-event fade" v-show="isShow" @touchmove.stop.prevent @click.stop.prevent="modalFadeClick">
		<div class="modal-dialog">
			<div class="modal-content">
				<img src="../../../imgs/share-notice.png"/>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			isShow: false,
			onClose: null // 用户关闭后的方法
		};
	},
	methods: {
		modalFadeClick(){
			this.isShow = false;
			this.onClose();
		},
		show(){
			this.isShow = true;
		},
		destroy(){
			this.isShow = false;
		}
	}
}
</script>

<style lang="less" scoped>
.share-event {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, .5);
	display: table;
	transition: opacity .3s ease;

	.modal-dialog {
		display: table-cell;

		.modal-content {
			max-height: 100%;
			position: relative;
			margin: 0 auto;
			padding: 20px 30px;
			text-align: right;
		}

		@media screen and (min-width: 540px) {
			.modal-content {
				max-width: 540px;
			}
		}
	}
}
</style>