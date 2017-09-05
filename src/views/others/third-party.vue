<template>
	<div class="third-party">
		<div class="third-party-wrap">
	        <iframe :src="target" frameborder="no" SECURITY="restricted" v-if="target"></iframe>
	        <p class="content-block" v-else>目前什么要显示的数据</p>
	    </div>
	</div>
</template>
<script>
module.exports = {
	data(){
		return {
			target: this.$route.query.target,
			title: this.$route.query.title || '第三方网站'
		}
	},
	mounted(){
		this.$store.dispatch("updateNavbarTitle", this.title);
	}
}
</script>
<style lang="less" scoped>
	.third-party {
		height: 100vh;
		
		.third-party-wrap {
			width: 100%;
			min-width: 320px;
			height: 100%;
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			box-sizing: border-box;
			
			.content-block {
				margin-top: 40px;
				text-align: center;
			}
			
			iframe {
				width: 100%;
				height: 100%;
				border: none;
			}
		}
	}
</style>