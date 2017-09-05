<template>
    <header class="navbar" :style="{background: 'rgba(255, 255, 255, ' + opacity + ')'}" :class="{'bg-opacity':opacity<1}">
        <slot name="left">
            <a v-html="left.contents" class="navbar-left back pull-left" :class="left.className" @click.stop.prevent="leftEvents" v-show="left.isShow"></a>
        </slot>
        <slot name="center">
            <h1 v-html="center.contents" class="navbar-center title" :class="center.className" @click.stop.prevent="centerEvents" v-show="center.isShow"></h1>
        </slot>
        <slot name="right">
            <a v-html="right.contents" class="navbar-right pull-right right-bar-text" :class="right.className" @click.stop.prevent="rightEvents" v-show="right.isShow">默认</a>
        </slot>
    </header>
</template>
<script>
export default {
    data: function() {
        return {};
    },
    props: {
        left: Object, //头部左边对象 className|isShow|contents|callback
        center: Object, //头部中间对象 className|isShow|contents|callback
        right: Object, //头部右边对象 className|isShow|contents|callback
        opacity: Number //头部透明度 0~1
    },
    computed: {
        isOpacity() {
            return this.opacity === 1;
        }
    },
    methods: {
        //左边点击事件, 默认返回
        leftEvents: function() {
            const _this = this;
            if (_this.left && _this.left.callback && typeof(_this.left.callback) === "function") {
                _this.left.callback(function(){
                	_this.$emit("goBack");
                });
            } else {
                _this.$emit("goBack");
            }
        },

        //中间事件
        centerEvents: function() {
            const _this = this;
            if (_this.center && _this.center.callback && typeof(_this.center.callback) === "function") {
                _this.center.callback();
            }
        },

        //右边事件
        rightEvents: function() {
            const _this = this;
            if (_this.right && _this.right.callback && typeof(_this.right.callback) === "function") {
                _this.right.callback();
            }
        }
    }
}
</script>
<style scoped lang="sass">
.navbar {
	.bg-opacity {
	    -webkit-box-shadow: 0 0 0px rgba(0, 0, 0, 0);
	    box-shadow: 0 0 0px rgba(0, 0, 0, 0);
	}
}

</style>
