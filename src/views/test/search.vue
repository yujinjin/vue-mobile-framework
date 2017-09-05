<template>
    <div>
        <navbar :left="headerLeft" :center="headerCenter" :right="headerRight">
            <div class="search-bar" slot="center">
                <label class="flex">
                    <i class="mui-icon mui-icon-search"></i>
                    <input class="flex-1" @focus="focusHandler" type="search">
                </label>
            </div>
            <a slot="right" @tap="cancelHandler" class="search-right-btn">取消</a>
        </navbar>
    </div>
</template>
<script>
import navbar from "../components/header"
export default {
    data() {
            return {
                headerLeft: {
                    isShow: false
                },
                headerRight: {
                    isShow: true
                },
                headerCenter: {
                    isShow: true,
                }
            };
        },
        components: {
            navbar
        },
        methods: {
            focusHandler(e) {
                console.info('开始聚焦');
            },
            cancelHandler() {
                this.$router.go(-1);
            }
        }
}
</script>
<style lang="less" rel="stylesheet/less" type="text/css">
.search-bar {
    height: 34px;
    font-size: 16px;
    line-height: 34px;
    color: #999;
    text-align: center;
    background-color: rgba(0, 0, 0, .1);
    border-radius: 6px;
    margin-top: 5px;
    margin-right: 38px;
    line-height: 34px;
    label {
        i.mui-icon.mui-icon-search {
            margin: 0;
            padding: 0 6px;
            line-height: 34px;
        }
        input {
            height: 34px;
            margin-bottom: 0px;
            background: none;
            border: none;
            padding: 0;
        }
    }
}

.search-right-btn {
    font-size: 14px;
    margin-top: 5px;
    color: #666;
    position: absolute;
    line-height: 34px;
    padding: 0 10px;
    right: 0;
    top: 0;
}

.flex {
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
}

.flex-1 {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    width: 20%;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
}
</style>
