<template>
	<div class="hybrid content">
		<ul class="table-view table-view-chevron">
			<li data-n="0" class="table-view-cell collapse" :class="{'active': state==='jump'}">
				<a class="navigate-right" :class="{'down':state!=='jump', 'up': state==='jump'}" @click.stop.prevent="state=='jump'?state='':state='jump'">
					H5 Jump（H5跳转页面）
				</a>
				<ul class="table-view table-view-chevron">
					<li data-n="a" class="table-view-cell">
						<a class="navigate-right" @click.stop.prevent="forwardNative">
							向前跳转native页
						</a>
					</li>
					<li data-n="b" class="table-view-cell">
						<a class="navigate-right" @click.stop.prevent="forwardReplaceNative">
							向前replace跳转native页
						</a>
					</li>
					<li data-n="c" class="table-view-cell">
						<a class="navigate-right" @click.stop.prevent="backNative">
							向后跳转native页
						</a>
					</li>
					<li data-n="d" class="table-view-cell">
						<a class="navigate-right" @click.stop.prevent="forwardWebview">
							新开一个webview向前跳转到H5页面
						</a>
					</li>
					<li data-n="e" class="table-view-cell">
						<a class="navigate-right" @click.stop.prevent="backWebview">
							新开一个webview向后跳转到H5页面
						</a>
					</li>
					<li data-n="f" class="table-view-cell">
						<a class="navigate-right" @click.stop.prevent="forwardNTKFService">
							小能客服
						</a>
					</li>
					<li data-n="g" class="table-view-cell">
						<a class="navigate-right" @click.stop.prevent="forwardNTKFDietitian">
							小能营养师
						</a>
					</li>
				</ul>
			</li>
			<li data-n="1" class="table-view-cell">
				<a class="navigate-right" @click.stop.prevent="updateHeaderTitle">
					updateheadertitle（header标题更新）
				</a>
			</li>
			<li data-n="2" class="table-view-cell collapse" :class="{'active': state==='updateheader'}">
				<a class="navigate-right down" :class="{'down':state!=='updateheader', 'up': state==='updateheader'}" @click.stop.prevent="state=='updateheader'?state='':state='updateheader'">
					updateheader（header更新）
				</a>
				<ul class="table-view table-view-chevron">
					<li data-n="a" class="table-view-cell">
						<a class="navigate-right" @click.stop.prevent="updateHeaderBack">
							左边回退
						</a>
					</li>
					<li data-n="b" class="table-view-cell">
						<a class="navigate-right" @click.stop.prevent="updateHeaderCenter">
							中间标题回调
						</a>
					</li>
					<li data-n="c" class="table-view-cell">
						<a class="navigate-right" @click.stop.prevent="updateHeaderRight">
							右边标签文字
						</a>
					</li>
					<li data-n="d" class="table-view-cell">
						<a class="navigate-right" @click.stop.prevent="updateHeaderRightShare">
							显示右边标签分享
						</a>
					</li>
					<li data-n="e" class="table-view-cell">
						<a class="navigate-right" @click.stop.prevent="updateHeaderOpacity">
							头部透明
						</a>
					</li>
					<li data-n="f" class="table-view-cell">
						<a class="navigate-right" @click.stop.prevent="resetHeaderInfo">
							重置头部信息
						</a>
					</li>
				</ul>
			</li>
			<li data-n="3" class="table-view-cell">
				<a class="navigate-right" @click.stop.prevent="showHeader">
					showheader（显示header）
				</a>
			</li>
			<li data-n="4" class="table-view-cell">
				<a class="navigate-right" @click.stop.prevent="hideHeader">
					hideheader（隐藏header）
				</a>
			</li>
			<li data-n="5" class="table-view-cell">
				<a class="navigate-right" @click.stop.prevent="showFooterState">
					updateFooterState（显示底部导航）
				</a>
			</li>
			<li data-n="6" class="table-view-cell">
				<a class="navigate-right" @click.stop.prevent="hideFooterState">
					updateFooterState（隐藏底部导航）
				</a>
			</li>
			<li data-n="7" class="table-view-cell">
				<a class="navigate-right"  @click.stop.prevent="showLoading">
					showLoading（显示加载层协议）
				</a>
			</li>
			<li data-n="8" class="table-view-cell">
				<a class="navigate-right"  @click.stop.prevent="hideLoading">
					hideLoading（隐藏加载层协议）
				</a>
			</li>
			<li data-n="9" class="table-view-cell collapse">
				<a class="navigate-right"  @click.stop.prevent="showToast">
					showToast（toast消息框）
				</a>
			</li>
			<li data-n="10" class="table-view-cell">
				<a class="navigate-right" @click.stop.prevent="login">
					login（用户登录）
				</a>
			</li>
			<li data-n="11" class="table-view-cell">
				<a class="navigate-right" @click.stop.prevent="logout">
					logout（用户登出）
				</a>
			</li>
			<li data-n="12" class="table-view-cell collapse">
				<a class="navigate-right" @click.stop.prevent="getUserInfo">
					getUserInfo（获取用户登录信息）
				</a>
			</li>
			<li data-n="13" class="table-view-cell">
				<a class="navigate-right" @click.stop.prevent="share">
					share（用户分享）
				</a>
			</li>
			<li data-n="14" class="table-view-cell">
				<a class="navigate-right" @click.stop.prevent="setStorage">setstorage（设置数据存储）</a>
			</li>
			<li data-n="15" class="table-view-cell">
				<a class="navigate-right" @click.stop.prevent="getStorage">
					getstorage（获取数据存储值）
				</a>
			</li>
			<li data-n="16" class="table-view-cell">
				<a class="navigate-right" @click.stop.prevent="removeStorage">
					removestorage（移除数据存储值）
				</a>
			</li>
			<li data-n="17" class="table-view-cell collapse" :class="{'active': state==='stressTest'}">
				<a class="navigate-right down" @click.stop.prevent="stressTest" :class="{'down':state!=='stressTest', 'up': state==='stressTest'}">
					协议压力测试（{{stressTimes}}次）
				</a>
				<ul v-if="stressResult && stressResult.length > 0" class="table-view table-view-chevron stress-result-panel">
					<li :data-n="index" v-for="(item, index) in stressResult" :key="item.callbackFun" class="table-view-cell">
						<a class="navigate-right">
							执行顺序:{{item.callbackOrder}}
							名称:{{item.callbackFun}}
							执行时间:{{item.runTime}}
						</a>
					</li>
				</ul>
			</li>
		</ul>
		<div style="margin: 15px;">
			<button type="button" class="mui-btn mui-btn-success mui-btn-block" @click.stop.prevent="removeH5Storage">
				清除H5本地缓存信息并返回首页
			</button>
		</div>
	</div>
</template>

<script>
	import hybrid from '../../js/utils/hybrid'
	module.exports = {
	    data: function(){
	        return {
	        	state: '',//jump|updateheader|stressTest
	        	stressTimes: 100, //协议压力测试的次数
	        	stressResult: [] //协议测试的结果
	        }
	    },
	    created: function(){
	    },
	    methods: {
	    	forwardNative(){
	    		app.log.info("向前跳转native页");
	    		hybrid.forward({topage: 'shopping-cart', type: 'native'}, (data)=>{app.log.info(data);});
	    	},
	    	
	    	forwardReplaceNative(){
	    		app.log.info("向前replace跳转native页");
	    		hybrid.forward({topage: 'shopping-cart', type: 'native', replace: true}, (data)=>{app.log.info(data);});
	    	},
	    	
	    	backNative(){
	    		app.log.info("向后跳转native页");
	    		hybrid.back({topage: 'home', type: 'native'}, (data)=>{app.log.info(data);});
	    	},
	    	
	    	forwardWebview(){
	    		app.log.info("向前跳转webview页");
	    		hybrid.forward({topage: 'product', type: 'webview', urlParams: { id: "5d3e71ab-bfb7-498e-8fff-8d412ad0b73c" }}, (data)=>{app.log.info(data);});
	    	},
	    	
	    	backWebview(){
	    		app.log.info("向后跳转webview页");
	    		hybrid.forward({topage: 'my-orders', type: 'webview'}, (data)=>{app.log.info(data);});
	    	},
	    	
	    	forwardNTKFService(){
	    		app.log.info("小能客服");
	    		hybrid.forward({topage: 'ntkf-service', type: 'native'}, (data)=>{app.log.info(data);});
	    	},
	    	
	    	forwardNTKFDietitian(){
	    		app.log.info("小能营养师");
	    		hybrid.forward({topage: 'ntkf-dietitian', type: 'native'}, (data)=>{app.log.info(data);});
	    	},
	    	
	    	updateHeaderTitle(){
	    		app.log.info("header标题更新");
	    		hybrid.updateHeaderTitle("header标题更新测试", (data)=>{app.log.info(data);});
	    	},
	    	
	    	updateHeaderBack(){
	    		app.log.info("左边回退");
	    		hybrid.updateHeaderLeft({
    				actions: 'back',
    				value: '',
    				callback: (data)=>{app.log.info(data);}
	    		}, (data)=>{app.log.info(data);});
	    	},
	    	
	    	updateHeaderCenter(){
	    		app.log.info("中间标题");
	    		
	    		hybrid.updateHeaderCenter({
    				actions: 'title',
    				value: '中间标题测试',
    				callback: (data)=>{app.log.info(data);}
	    		}, (data)=>{app.log.info(data);});
	    	},
	    	
	    	updateHeaderRight(){
	    		app.log.info("右边标签文字");
	    		hybrid.updateHeaderRight({
	    			actions: 'label',
    				value: '右边标签',
    				callback: (data)=>{app.log.info(data);}
	    		}, (data)=>{app.log.info(data);});
	    	},
	    	
	    	updateHeaderRightShare(){
	    		app.log.info("显示右边标签分享");
	    		hybrid.updateHeaderRight({
	    			actions: 'share',
    				value: {
						title: "分享的标题", //
						desc: "分享的描述", //
						img: "https://img.jk724.com/upload/201707/1707280006405710076180628508.jpg",
						url: "分享的URL地址"
					},
    				callback: (data)=>{app.log.info(data);}
	    		}, (data)=>{app.log.info(data);});
	    	},
	    	
	    	updateHeaderOpacity(){
	    		app.log.info("头部半透明...");
	    		hybrid.showHeader({translucent: false}, (data)=>{app.log.info(data);});
	    		hybrid.updateHeaderOpacity({opacity:0.5}, (data)=>{app.log.info(data);});
	    	},
	    	
	    	resetHeaderInfo(){
	    		app.log.info("重置头部信息...");
	    		hybrid.updateHeader({
	    			left: {actions: 'empty'},
	    			center: {actions: 'empty'},
	    			right: {actions: 'empty'}
	    		}, (data)=>{app.log.info(data);});
	    		hybrid.showHeader({translucent: true}, (data)=>{app.log.info(data);});
	    		hybrid.updateHeaderOpacity({opacity:1}, (data)=>{app.log.info(data);});
	    	},
	    	
	    	showHeader(){
	    		app.log.info("显示header");
	    		hybrid.showHeader(null, (data)=>{app.log.info(data);});
	    	},
	    	
	    	hideHeader(){
	    		app.log.info("隐藏header");
	    		hybrid.hideHeader({animate: true}, (data)=>{app.log.info(data);});
	    	},
	    	
	    	showFooterState(){
	    		app.log.info("显示Footer");
	    		hybrid.updateFooterState({isShow: true}, (data)=>{app.log.info(data);});
	    	},
	    	
	    	hideFooterState(){
	    		app.log.info("隐藏Footer");
	    		hybrid.updateFooterState({isShow: false}, (data)=>{app.log.info(data);});
	    	},
	    	
	    	showLoading(){
	    		app.log.info("显示加载层");
	    		hybrid.showLoading();
	    		const _this = this;
	    		setTimeout(()=>_this.hideLoading(), 3000);
	    	},
	    	
	    	hideLoading(){
	    		app.log.info("隐藏加载层");
	    		hybrid.hideLoading();
	    	},
	    	
	    	showToast(){
	    		app.log.info("toast消息框");
	    		hybrid.showToast({title: "toast消息框内容！", timer: 2000}, (data)=>{app.log.info(data);});
	    	},
	    	
	    	login(){
	    		app.log.info("用户登录");
	    		//app.globalService.setUserInfo(JSON.parse('{"referralCode":"UUNVU311","token":"Bearer tBVU4_WYwvdQ3StxQ5FKQbTZPeln3oOo6F5fMi1w8-rL2UxWi-nfbACsbOrGIkyB8JFlDr0vANiI_smza05rckglP2dEoplvqtwySCwbwg6mQhiWtOyc44_vW-o2RBIdEGsIcb72tNhyBCPut6C3jOb1cA7leWBzHJAkno_elfHAzyupfspl4kd3HtCuNAnBtpoFHPgCKsnZWGjvO2wHR7WYpJELHbzNNJdb_-JWqD-xGqXJlKfLb6qPiKs6mVeoPBeMLiuOePRLiTtfnYsDYFbNK35cTw6fmRYVdESR_tMD_lGj3M4rf_8V3Vxucgm6N8HAZy5zXVZCTyBQxdvifgQ-Q9pbYv4x-ObprivvVPDgufbgrU2XC_8Ky6Jo_yZkqmO3IzCOz0KN4o63WIHRPjRC7027gJVaNB_S7TuVe4WMNhdbKmTgqQjwubk6CkwKwPjMpw","expiredTime":1505701318650,"version":"999.999.999","info":{"name":"程程10050","profile":{"birthday":"2017-07-17T00:00:00+08:00","gender":0},"fullName":"程程10050","headImgURL":"/upload/201707/1707210003505710005183753428","idCardNumber":"1","weChatQRCodeImgURL":"/upload/201707/1707180005105710017114404651.JPG"}}'));
	    		hybrid.login({
	    			"referralCode":"48WLM521",
	    			"token":"Bearer TgMsoS5LsdHWjqrIifq2IijtUMMO9OPX0tKoE2bDz_qdk6yGTJwGzR5Ea0Eauei2bY8V16-HP6RhH19Fps2XFAhHAdU6q4r1EnU0E1Ht9hHP_AT9xiShD6qo1lO-KkXimAw2l-c1lORwVv6KAtn_euFaUQs7AJbuPzcc3qpf9okOdYhThO4hPUUiNCqCflQ-YVga_6rp4LKAvwoL3OSH3xuRpGqTQRaXJA5YmYR-yRQ_lE0wxekdUY0JzZKfyklutwn3XqK1yookZMInICjtgLiYBH4vM54YytViMk326UHfu6ONd040l-8lAGzuVzT9lc-ywyQg1UNDMU5F1smQiCWEG6bgBUA0ePPzvA-sytFZNtBGteUJzniHuvFo0F9ESuhNxnW6KdyB8ywH8p0lQwngsvdvzaHtSCiLWJxDhd7EewZlgsy8R1-gpjR99KEzmaEMNw",
	    			"expiredTime": 60 * 60 * 24 * 30,
	    			"info":{
	    				"name":"18700000150",
	    				"profile":{
	    					"birthday":null,
	    					"gender":null
	    				},
	    				"fullName":null,
	    				"headImgURL":"/upload/201708/d47a2479-9096-4cec-a8dd-8debd743813a.png",
	    				"idCardNumber":null,
	    				"weChatQRCodeImgURL":null
	    			}
	    		}, (data)=>{app.log.info(data);});
	    	},
	    	
	    	logout(){
	    		app.log.info("用户登出");
	    		hybrid.logout((data)=>{app.log.info(data);});
	    	},
	    	
	    	getUserInfo(){
	    		app.log.info("获取用户登录信息");
	    		hybrid.getUserInfo((data)=>{alert(data);});
	    	},
	    	
	    	share(){
	    		app.log.info("用户分享");
	    		hybrid.share({
	    			title: "分享的标题测试", //分享的标题
					desc: "分享的描述测试", //分享的描述
					img: "分享的图片地址测试", //分享的图片地址
					url: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1491392303081&di=4c3e97bb4081bffe228dba685957f533&imgtype=0&src=http%3A%2F%2Fs8.sinaimg.cn%2Fmw690%2F001SPtdhgy6X2QmA8RNe7%26amp%3B690", //分享的URL地址
	    		}, (data)=>{app.log.info(data);});
	    	},
	    	
	    	setStorage(){
	    		app.log.info("设置数据存储");
	    		hybrid.setStorage({name: "startFlag", data: true}, (data)=>{app.log.info(data);});
	    	},
	    	
	    	getStorage(){
	    		app.log.info("获取数据存储值");
	    		hybrid.getStorage({name: "startFlag"}, (data)=>{app.log.info(data);});
	    	},
	    	
	    	removeStorage(){
	    		app.log.info("移除数据存储值");
	    		hybrid.removeStorage({name: "startFlag"}, (data)=>{app.log.info(data);});
	    	},
	    	
	    	stressTest(){
	    		// hybrid协议测试
	    		this.state=='stressTest'?this.state='':this.state='stressTest';
	    		let [_stressResult, _current_date_time, _callbackOrder] = [[], (new Date()).getTime(), 0];
	    		for(let i = 0; i < 100; i++){
	    			_stressResult.push({
	    				runTime: -1,
	    				callbackFun: hybrid.showHeader({translucent: false}, function(data){
		    				_stressResult.find((item)=>{
		    					if(item.callbackFun === this.callback){
		    						item.callbackOrder = _callbackOrder;
		    						item.runTime = (new Date()).getTime() - _current_date_time;
		    						++_callbackOrder;
		    						return true;
		    					}
		    				});
	    				}),
	    				hybridName: "showHeader",
	    				callbackOrder: -1
	    			});
	    		}
	    		this.stressResult = _stressResult;
	    	},
	    	
	    	removeH5Storage(){
	    		app.log.info("移除数据存储值");
	    		mui.toast('移除数据存储值成功');
	    		app.utils.localStorage("siteLocalStorage", "");
	    		window.location.replace("/");
	    	}
	    }
	};
</script>
<style scoped lang="less">
	.hybrid {
		.table-view-chevron .table-view-cell {
		    padding-right: 65px;
		}

		.table-view {
		    position: relative;
		    margin-top: 0;
		    margin-bottom: 0;
		    padding-left: 0;
		    list-style: none;
		    background-color: #fff;

		    &:before {
			    position: absolute;
			    right: 0;
			    left: 0;
			    height: 1px;
			    content: '';
			    -webkit-transform: scaleY(.5);
			    transform: scaleY(.5);
			    background-color: #c8c7cc;
			    top: -1px;
			}

			&:after {
			    position: absolute;
			    right: 0;
			    bottom: 0;
			    left: 0;
			    height: 1px;
			    content: '';
			    -webkit-transform: scaleY(.5);
			    transform: scaleY(.5);
			    background-color: #c8c7cc;
			}

		    .table-view-cell {
			    position: relative;
			    overflow: hidden;
			    padding: 11px 15px 11px 45px;
			    -webkit-touch-callout: none;

			    &:last-child:after {
			    	height: 0;
			    }
				&:before{
		 			content:attr(data-n);
		 			position: absolute;
		 			background: #ccc;
		 			color:#fff;
					width:20px;
					height:20px;
					text-align: center;
					line-height: 20px;
					border-radius: 20px;
					left:15px;
					font-weight: bold;
	 			}
			    &:after {
				    position: absolute;
				    right: 0;
				    bottom: 0;
				    left: 15px;
				    height: 1px;
				    content: '';
				    -webkit-transform: scaleY(.5);
				    transform: scaleY(.5);
				    background-color: #c8c7cc;
				}

				.table-view:before {
					height: 0px;
				}

				.table-view:after {
					height: 0px;
				}

				&.collapse {
					&.active {
	    				margin-top: -1px;
	    				background-color: #eee;

	    				.table-view {
							display: block;
						}
					}

					.table-view {
					    display: none;
					    margin-top: 11px;
					    margin-right: -15px;
					    margin-bottom: -11px;
					    margin-left: -45px;
					    border: 0;

					    .table-view-cell {
						    margin-left: 15px;
						    background-position: 31px 100%;
						}
					}
				}

				a {
					width: 100%;
					display: inline-block;
				}

				.navigate-right:after {
				    width: 14px;
				    height: 23px;
				    right: 18px;
				    /*-webkit-transform: rotate(-90deg);
    				transform: rotate(-90deg);*/
    				-webkit-transition: -webkit-transform .3s ease;
    				transition: transform .3s ease;
    				background: url(../../imgs/test/right_arrow.png) no-repeat center;
    				background-size: 10px 16px;
    				content: "";
				    position: absolute;

				}

				.navigate-right.down:after {
					-webkit-transform: rotate(90deg);
    				transform: rotate(90deg);
				}

				.navigate-right.up:after {
					-webkit-transform: rotate(-90deg);
    				transform: rotate(-90deg);
				}
				
				.stress-result-panel {
					font-size: 12px;
				}
			}
		}
	}
</style>
