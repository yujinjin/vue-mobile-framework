<template>
	<div class="notfound">
		<img src="../../../imgs/404.png" alt="" />
	</div>
</template>

<script>
module.exports = {
	data: function() {
		return {};
	}
};
</script>
<style lang="less" scoped="true">
.notfound {
	height: -webkit-calc(~'100vh - 44px');
	height: calc(~'100vh - 44px');
	background-color: #fff;

	img {
		max-width: 100%;
	}
}
</style>
