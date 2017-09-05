<template>
	<div class="login">
		
    </div>
</template>
<script>
	export default {
		data() {
			return {}
		},
		watch: {
			mobile: function (newVal, oldVal) {
				if(newVal && newVal.length === 11) {
					this.isCanSendCode = this.checkMobile(true);
				} else {
					this.isCanSendCode = false;
				}
			}
		},
		mounted(){
			
		},
		methods: {
		}
	}
</script>
<style lang="less" rel="stylesheet/less" type="text/css" scoped>
	.login{
		background: #fff;
	}
</style>
