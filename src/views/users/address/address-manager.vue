<template>
	<div class="user-info relative">
		<div class="user-address">
			<ul class="mui-table-view">
				<li class="mui-table-view-cell mui-transitioning" v-for="(item, index) in list" :key="index">
					<div class="mui-slider-right mui-disabled">
						<a @tap.stop.prevent="delOne(item.id)" class="mui-btn mui-btn-red">删除</a>
					</div>
					<div class="mui-slider-handle">
						<div @click="goEdit(item.id)" class="mui-navigate-right address-item">
							<div class="address-name">{{item.name}}<span class="ml20">{{item.mobilePhone}}</span></div>
							<div class="address-regions"><span v-if="item.isDefault">[ 默认地址 ]</span>{{item.regions}}</div>
							<div class="address-specfic">{{item.specificAddress}}</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
		<div v-if="list.length == 0" class="no-data">
			<img src="../../../imgs/default_not_find@2x.png" alt="">
			<p>您还没有收货地址哦～添加一个吧!</p>
			<router-link class="go-add-address" :to="{name:'add-or-edit-address'}">
				添加新地址
			</router-link>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				list:[]
			};
		},
		mounted: function () {
			this.editDoneHandle();
			this.getList();
		},
		methods: {
			editDoneHandle() {
				let imgurl = app.utils.getLocalImageUrl(null, "user");
				this.$store.dispatch("updateHeader", {
					right: {
						className:"add-address-icon",
						isShow: true,
						contents: '+',
						value: '+',
						actions: 'label',
						callback: this.editHandle
					}
				});
			},
			editHandle() {
				this.$router.push({ name: 'add-or-edit-address', params: { id: null }});
			},

			getList(){
				app.api.address.Addresses({isShowLoading: true}).then((data)=>{
			        data.items.forEach((item,index)=>{
			        	if(!item.regions){
			        		return;
			        	}
			        	item.regions = item.regions['mergeName'];
			        }); 
			        this.list = data.items;
				});
			},
			//确认删除地址
			delOne(id){
				let _this=  this;
				mui.confirm('确定将这个地址删除?', '提示', ['取消', '确认'], (obj) => {
					if (obj.index == 0)return;
					if (obj.index == 1) {
						this.del([id]);
					}
				}, 'div');
			},
			//删除地址
			del(id){
				let _this=  this;
				app.api.address.deleteAddresses({addressId:id}).then((data)=>{
					app.mui.toast('删除成功');
					this.getList();
				});
			},
			//修改地址
			goEdit(id){
				this.$router.push({ path: 'add-or-edit-address', query: {id: id }});
			}
		}
	}
</script>
<style lang="less" scoped>
	.add-address-icon{
		font-size:30px !important;
	}
	.user-address {
		font-size: 13px;
		color: #333;
		margin-top:5px;
		.address-item{
			line-height: 24px;
			.address-regions{
				font-size:14px;
				line-height: 30px;
				color: #333;
				span{
					color:#f55424;
					margin-right: 10px;
				}
			}
			.address-specfic{
				font-size:13px;
			}
		}
		.address-name {
			color: #010101;
			font-size: 16px;
			span {
				font-size: 12px;
				color:#000;
			}
		}
		li{
			border-bottom:1px solid #c8c7cc;
			&:last-child{
				border-bottom:none;
			}
		}
		.mui-table-view:before{
			background: #efeff4;
		}
		.mui-table-view:after{
			background: #efeff4;
		}
		.mui-table-view-cell:after{
			background: #efeff4;
		}
		.mui-navigate-right:after{
			font-size:25px;
		}
	}
	.no-data{
		width: 100%;
		font-size: 15px;
		padding-top: 15%;
		text-align: center;
		img {
			width: 124px;
		}
		.go-add-address {
			width: 140px;
			height: 44px;
			font-size: 17px;
			color: #09bb07;
			border: 1px solid #09bb07;
			border-radius: 20px;
			background: transparent;
			margin: 15px auto;
			display: block;
			line-height: 42px;
		}
	}
</style>
