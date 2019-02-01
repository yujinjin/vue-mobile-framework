<template>
    <div class="view">
        <navbar v-if="!isApp" @goBack="goBack" v-show="$store.state.appData.isShowHead" :left="$store.state.appData.header.left" :center="$store.state.appData.header.center" :right="$store.state.appData.header.right" :opacity="$store.state.appData.header.opacity"></navbar>
		<div class="pages" :class="{'pages-content': $store.state.appData.isShowHead && !isApp, 'toolbar-fixed': $store.state.appData.isShowFoot  && !isApp}">
			<!--<transition :name="$store.state.appData.transition">-->
			<!-- 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们 -->
			<keep-alive :include="cachedRouters">
			<router-view class="page"></router-view>
			</keep-alive>
			<!--</transition>-->
		</div>
		<footerBar v-if="!isApp" v-show="$store.state.appData.isShowFoot"></footerBar>
    </div>
</template>
<script>
	import "../style/less/app.less" //加载公共样式
	import footerBar from "./components/footer" //底部导航
	import navbar from "./components/header" //底部导航
	export default {
	    data() {
	        return {
	        	isWeixin: app.Config.isWeiXin, //是否微信环境
				isApp: app.Config.isApp, // 是否在APP环境内
				isIOS: app.Config.device.isIOS, // 是否是iOS APP
				isAndroid: app.Config.device.isAndroid,//是否是andriod APP
				cachedRouters: ["home", "product-category", "shopping-cart", "user-center"] // 当前缓存的路由名称
	        }
	    },
	    components: {footerBar, navbar},
	    created() {},
	    mounted() {
	    	this.initApp();
	    },
	    methods: {
	        initApp() {
	            
	        },
	        goBack(){
				if(this.isApp) {
					app.hybrid.back();
					return;
				}
				this.$store.dispatch("updateDirection", "backing");
				if(window.history.length > 1) {
					this.$router.go(-1);
				} else {
					this.$router.push({"name":"home"});
				}
			}
	    }
	}
</script>
<style lang="less" scoped>

</style>
