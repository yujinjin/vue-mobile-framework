<template>
	<div class="selectaddress">
		<div class="item" v-for="item in items" :key="item.id" @tap="selectAddress(item.id)">
			<span class="name">{{item.name}}</span>
			<span class="mobile">{{item.mobilePhone}}</span>
			<br/>
			<span class="default" v-if="item.isDefault">[ 默认地址 ]</span>
			<span>{{item.regions && item.regions.mergeName.replace(/\,/g, '&nbsp;')}}</span>
			<br/>
			<span>{{item.specificAddress}}</span>
			<span class="right-arrow"></span>
		</div>
		<div v-if="items.length == 0" class="no-data">
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
		mounted() {
			this.$store.updateHeader({
				right: {
					isShow: true,
					contents: '管理',
					actions: 'label',
					value: "管理",
					callback: this.mgrHandle
				}
			});
			this.getAddress();
		},
		data() {
			return {
				items: []
			}
		},
		methods: {
			mgrHandle() {
				dataReport.eventReport('go-add-or-edit-address');
				this.$router.push({name: 'my-address'});
			},
			getAddress() {
				let _this = this;
				app.api.address.Addresses({
				    isShowLoading:true,
					success(data) {
						_this.items = data.items;
					}
				})
			},
			selectAddress(id) {
			    app.globalService.setOrderSubmitSelectedAddressId(id);
				this.$parent.goBack();
			},
		}
	}
</script>
<style lang="less" rel="stylesheet/less" type="text/css" scoped>
	.selectaddress {
		margin-top: 5px;
		.right-arrow {
			position: absolute;
			width: 20px;
			height: 20px;
			top: 0;
			right: 12px;
			bottom: 0;
			margin: auto;

			&:before {
				content: "";
				position: absolute;
				width: 12px;
				height: 12px;
				border: 1px solid #999999;
				border-width: 1px 0 0 1px;
				transform: rotate(135deg);
				top: 4px;
				left: 7px;
			}

		}
		.item {
			position: relative;
			height: 107px;
			width: 100%;
			line-height: 24px;
			padding: 19px;
			background: #fff;
			border-bottom: 1px solid #e4e4e4;

			.name {
				font-size: 16px;
				font-weight: bold;
				margin-right: 36px;
			}

			.default {
				color: #f55424;
				margin-right: 10px;
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
	}
</style>
