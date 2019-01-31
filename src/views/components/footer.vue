<template>
	<footer class="footer-bar">
		<div class="row">
			<router-link tag="div" :to="{name:'home'}" class="tap" exact>
				<span class="icon icon-home"></span>
				<span class="title">商城</span>
			</router-link>
			<router-link tag="div" :to="{name:'product-category'}" class="tap">
				<span class="icon icon-class"></span>
				<span class="title">分类</span>
			</router-link>
			<router-link tag="div" :to="{name:'shopping-cart'}" class="tap">
				<span class="icon icon-shoppingcart"><i v-show="shoppingCartCount > 0" class="tip">{{shoppingCartCountText}}</i></span>
				<span class="title">购物车</span>
			</router-link>
			<router-link tag="div" :to="{name:'user-center'}" class="tap">
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
		computed: {
			shoppingCartCountText(){
				if(this.shoppingCartCount > 99) return "99+";
				return this.shoppingCartCount;
			}
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
<style lang="less" scoped>
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
		font-size: 11px;

		.row {
			display: flex;

			.tap {
				flex: 1;
				
				span.icon {
					display: block;
					width: 23px;
					height: 23px;
					margin: 5px auto 2px;
					background-repeat: no-repeat;
					background-position: center center;
					background-size: 90%;
					position: relative;

					.tip {
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

					&.icon-home {
						background-image: url("../../imgs/footer/tab_bar_store_not@2x.png");
					}
					&.icon-class {
						background-image: url("../../imgs/footer/tab_bar_classify_not@2x.png");
					}
					&.icon-shoppingcart{
						background-image: url("../../imgs/footer/tab_bar_shopping_not@2x.png");
					}
					&.icon-personal{
						background-image: url("../../imgs/footer/tab_bar_my_not@2x.png");
					}
				}

				
				&.router-link-active {
					color: #09BB07;

					span.icon-home {
						background-image: url("../../imgs/footer/tab_bar_store@2x.png");
					}
					span.icon-class {
						background-image: url("../../imgs/footer/tab_bar_classify@2x.png");
					}
					span.icon-shoppingcart{
						background-image: url("../../imgs/footer/tab_bar_shopping@2x.png");
					}
					span.icon-personal{
						background-image: url("../../imgs/footer/tab_bar_my@2x.png");
					}
				}
			}
		}
	}
</style>
