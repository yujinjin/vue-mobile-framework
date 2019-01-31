<template>
    <div class="header navbar" :style="{background: 'rgba(255, 255, 255, ' + opacity + ')'}" :class="{'bg-opacity':opacity<1}">
        <!--
            作者：yujinjin9@126.com
            时间：2019-01-31
            描述：左边
        -->
        <div v-if="left.contents" v-html="leftContents" class="navbar-left" :class="left.className" @click.stop.prevent="leftEvents"></div>
        <div v-else class="navbar-left" :class="left.className" @click.stop.prevent="leftEvents"><svg-icon class="back" value="angle-left"></svg-icon></div>
        <!--
            作者：yujinjin9@126.com
            时间：2019-01-31
            描述：中间
        -->
        <div v-html="center.contents" class="navbar-center title" :class="center.className" @click.stop.prevent="centerEvents"></div>
        <!--
            作者：yujinjin9@126.com
            时间：2019-01-31
            描述：右边
        -->
        <div v-html="right.contents" class="navbar-right" :class="right.className" @click.stop.prevent="rightEvents"></div>
    </div>
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
<style lang="less">
.header.navbar { 
    background: rgb(255, 255, 255);
    width: 100vw;
    z-index: 999;
    top: 0;
    position: fixed;
    right: 0;
    left: 0;
    height: 44px;
    line-height: 44px;
    border-bottom: 0;
    border-bottom: 1px solid #e6e4e4;
    backface-visibility: hidden;
    display: flex;
    justify-content:space-between;

    .bg-opacity {
	    -webkit-box-shadow: 0 0 0px rgba(0, 0, 0, 0);
	    box-shadow: 0 0 0px rgba(0, 0, 0, 0);
    }
    
    .navbar-left {
        text-align: center;
        width: 45px;
        
        i.back {
            font-size: 30px;
            color: #afafaf;

            &:active {
                opacity: 0.3;
            }
        }
        
        // .left-text {
        //     margin-left: 5px;
        //     line-height: 44px;
        //     color: #007aff;
        //     font-size: 15px;
        //     display: inline-block;
        // }
    }
    
    .navbar-center {
        text-align: center;
        font-size: 17px;
        color: #000;
        text-overflow: ellipsis;
        flex: 1;
    }

    .navbar-right {
        width: 50px;
    }
    
    
}
</style>
