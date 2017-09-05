<template>
    <div class="home">
        <router-link :to="{name: 'hybrid'}" class="toolbar-link">
            hybrid测试
        </router-link>
        <router-link :to="{name: 'component'}" class="toolbar-link">
            component测试
        </router-link>
        <br>
        <router-link :to="{name: 'search'}" class="toolbar-link">
            搜索页
        </router-link>
    </div>
</template>
<script>
module.exports = {
    created: function() {
        console.info("home.vue  ....created");
    },
    mounted: function() {
        
    },
    beforeRouteEnter: function(to, from, next) {
        // 在渲染该组件的对应路由被 confirm 前调用
        // 不！能！获取组件实例 `this`
        // 因为当钩子执行前，组件实例还没被创建
        next();
        return true;
    },
    beforeRouteLeave: function(to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        next();
    },
    data: function() {
        return {}
    },
    methods: {
       
    },
};
</script>
<style lang="less" scoped>

</style>
