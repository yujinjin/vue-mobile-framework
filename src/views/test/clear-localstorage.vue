<template>
	<div class="clear-localstorage"></div>
</template>

<script>
	export default{
		data(){
			return {};
		},
		mounted(){
			this.clearLocalStorage();
		},
		methods: {
			clearLocalStorage(){
				app.log.info("移除数据存储值");
	    		mui.toast('移除数据存储值成功');
	    		app.utils.localStorage("siteLocalStorage", "");
	    		window.location.replace("/");
			}
		}
	}
</script>
