<template>
	<footer class="footer-bar">
		<div class="row">
			<router-link tag="div" :to="{name:'home'}" :class="{'router-link-active': $route.name == 'home'}" class="col-xs-2" exact>
				<span class="icon icon-home"></span>
				<span class="title">首页</span>
			</router-link>
			<router-link tag="div" :to="{name:'product-category'}" class="col-xs-2">
				<span class="icon icon-class"></span>
				<span class="title">分类</span>
			</router-link>
			<router-link tag="div" :to="{name:'discovery-list'}" class="col-xs-2">
				<span class="icon icon-find"></span>
				<span class="title">发现</span>
			</router-link>
			<router-link tag="div" :to="{name:'shopping-cart'}" class="col-xs-2">
				<span class="icon icon-shoppingcart"><i v-show="shoppingCartCount > 0" class="tip">{{shoppingCartCount}}</i></span>
				<span class="title">购物车</span>
			</router-link>
			<router-link tag="div" :to="{name:'user-center'}" class="col-xs-2">
				<span class="icon icon-personal"></span>
				<span class="title">我的</span>
			</router-link>
		</div>
	</footer>
</template>
<script>
	export default {
		data(){
		    return {
		    	shoppingCartCount: 1
		    };
		},
		mounted(){
		    this.getShoppingCartCount();
		},
		methods:{
		    getShoppingCartCount(){
				
			}
		}
	}
</script>
<style lang="less" rel="stylesheet/less" type="text/css" scoped>
	.footer-bar {
		position: fixed;
		z-index: 10;
		left: 0;
		bottom: 0;
		height: 50px;
		background: #fff;
		border-top: 1px solid #ccc;
		width: 100%;
		text-align: center;
		font-size: 10px;
		.col-xs-2{
			width: 20%;
		}
		.mui-row div {
			height: 49px;
		}
		span.icon {
			display: block;
			width: 23px;
			height: 23px;
			margin: 8px auto 2px;
			background-repeat: no-repeat;
			background-position: center center;
			-webkit-background-size: 100% 100%;
			background-size: 100% 100%;
			position: relative;
		}
	}

	.router-link-active {
		color: #09BB07;
		
	}
	.tip{
		background: #f55424;
		min-width: 15px;
		height: 15px;
		color: #fff;
		line-height: 15px;
		top: -2px;
		left: 18px;
		padding: 0 2px;
		display: block;
		border-radius: 15px;
		font-style: normal;
		position: absolute;
		z-index: 9;
	}
</style>
