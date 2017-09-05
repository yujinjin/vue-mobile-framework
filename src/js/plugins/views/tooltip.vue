<template>
	<div class="tooltip" :class="classes" v-show="show" @click.stop.prevent="hideTooltip">
		<div class="tooltip-inner" :class="className">
			<div class="tooltip-content" v-html="contet"></div>
			<div class="tooltip-arrow"></div>
		</div>
	</div>
</template>
<script>
	module.exports = {
		data: function() {
			return {
				show: false,
				classes: [],
				content: "",
				positions: "top"
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
			showTooltip(options){
				let defaults = Object.assign({classes: [], content: "", positions: "top"}, options || {});
				this.show = true;
				this.classes = defaults.classes;
				this.content = defaults.content;
				
			},
			hideTooltip(){
				this.show = false;
			},
			// destroy
			destroy() {
				
			}
		}
	}
</script>
<style lang="less" scoped>
	.tooltip {
		position: fixed;
		z-index: 9999;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .8);
		display: table;
		transition: opacity .3s ease;
		
	}
</style>