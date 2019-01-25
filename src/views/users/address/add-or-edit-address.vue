<template>
	<div class="user-info bgwhite add-address">
		<div class="mui-input-row borderbottom">
			<label>收货人：</label>
			<input type="text" class="mui-input-clear" v-model="name">
		</div>
		<div class="mui-input-row borderbottom">
			<label>手机号码：</label>
			<input type="text" class="mui-input-clear" v-model="mobilePhone">
		</div>
		<!--<div class="mui-input-row borderbottom">
			<label>身份证号：</label>
			<input type="text" class="mui-input-clear" placeholder="因海关需要，请填写身份证号" v-model="idCardNumber">
		</div>-->
		<div class="mui-input-row borderbottom mui-navigate-right" id="showCityPicker" @tap.stop.prevent="showCityPicker">
			<label>所在区域：</label>
			<input type="text" v-model="mergeName" readonly="readonly" >
		</div>
		<div class="mui-input-row borderbottom">
			<label>详细地址：</label>
			<textarea v-model="specificAddress"  placeholder="请填写详细地址"></textarea>
			<!-- <input type="text" placeholder="请填写详细地址" v-model="specificAddress"> -->
		</div>
		<div class="mui-table-view-cell switch">
			<div class="mui-input-row input-switch">
				<label class="set-default">设置为默认地址：</label>
				<div class="mui-switch switch-btn fr" ref="mySwitch" v-bind:class="{ 'mui-active': isActive }">
					<div class="mui-switch-handle"></div>
				</div>
			</div>
			<!--<div class="notice">注: 请确保收货人姓名与身份证一致</div>-->
		</div>
		<div class="address-footer">
			<button type="button" class="mui-btn mui-btn-primary submit-btn" @tap="addAddress($event)">保存地址</button>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				ctPicker:null,
				cityData:"",
				id:null,
				para:"",
				isDefault:false,
//				idCardNumber:"",
				regionId:"",
				name:"",
				mobilePhone:"",
				specificAddress:"",
				isEdit:false,
				mergeName:"",
				isActive:false
			};
		},
		mounted(){
			return this.init();
		},
		destroyed(){
		    if(this.ctPicker){
				this.ctPicker.dispose();
			}
		},
		methods: {
			init(){
				if(this.$route.query.id){
					this.id=this.$route.query.id;
					this.editDoneHandle();
					this.isEdit = true;
					this.getEditAddress();
				}else{
					this.addDoneHandle();
				}
				mui('.mui-switch')['switch']();
				this.getAllRegionList();
				this.goswitch();
			},
			editDoneHandle() {
				this.$store.dispatch("updateHeader", {
					right: {
						isShow: true,
						contents: '删除',
						actions: 'label',
						value: "删除",
						callback: this.delBtnHandler
					}
				});
			},
			addDoneHandle() {
				this.$store.dispatch("updateHeader", {
					right: {
						isShow: true,
						contents: '',
						actions: 'label',
						value: "",
						callback: this.delOne
					},
					center:{
						isShow: true,
						contents: '新建地址',
						callback: null
					}
				});
			},
			//删除地址按钮事件
			delBtnHandler(){
			    mui.confirm('确定删除此收货地址吗?','提示',['取消','确定'],(e)=>{
			        if(e.index == 1){
			            this.delOne();
					}
				});
			},
			//删除地址
			delOne(){
				let _this=  this;
				app.api.address.deleteAddresses({addressId:this.id}).then((data)=>{
					app.mui.toast('删除成功');
					setTimeout(function(){
						_this.$parent.goBack();
					},1000);
				});
			},
			//获取省市区
			getAllRegionList(){
				app.api.address.GetAllRegionList().then((data)=>{
					this.cityData = data;
				});
			},

			//选择省市区
			showCityPicker(){
				document.activeElement.blur();
				let _this = this;
				if(!this.ctPicker) {
					this.ctPicker = new mui.PopPicker({
					    layer: 3
					});
				}
				if(this.cityData){
					this.cityData.forEach((item,index)=>{
						item.text = item.name;
						item.children.forEach((childrenItem,index)=>{
							childrenItem.text = childrenItem.name;
							childrenItem.children.forEach((secondchildItem,index)=>{
								secondchildItem.text = secondchildItem.name;
							});
						});
					});
					this.ctPicker.setData(this.cityData);
					this.ctPicker.show(function(SelectedItem) {
						_this.mergeName = '';
						SelectedItem.forEach((item)=>{
						    if(item.text){
								_this.mergeName = _this.mergeName + item.text + ' ';
							}
						});
						_this.regionId = SelectedItem[2].id;
					})
				}
			},

			//修改-添加地址
			addAddress(e){
				let _this= this;
				dataReport.eventReport('click-addresses');
				if(_this.name == ""){
					app.mui.toast('请输入收货人姓名');
					return;
				}
				if(_this.name.length<2 || _this.name.length > 11){
					app.mui.toast('收货人姓名:2-11个字符限制');
					return;
				} else if(_this.name.indexOf("先生") != -1 || _this.name.indexOf("女士") != -1) {
					app.mui.toast("请输入真实的收货人姓名，不要带有'先生'或'女士'的称呼！");
					return;
				}
				if(!app.utils.validateMobile(_this.mobilePhone)){
					app.mui.toast('请输入正确的手机号');
					return;
				}
//				if(_this.idCardNumber == ""){
//					app.mui.toast('请输入身份证');
//					return;
//				}
				if(_this.regionId == ""){
					app.mui.toast('请输入地址');
					return;
				}
				if(_this.specificAddress == ""){
					app.mui.toast('请输入详细地址');
					return;
				}
				if(_this.specificAddress.length > 68){
					app.mui.toast('详细地址:68个字符以内');
					return;
				}
				mui(e.target).button('loading');
				let para = {
					"id": _this.id,
//					"idCardNumber": _this.idCardNumber,
					"regionId": _this.regionId,
					"name": _this.name,
					"mobilePhone": _this.mobilePhone,
					"specificAddress": _this.specificAddress,
					"isDefault": _this.isDefault
				};
				app.api.address.GetAddresses(para).then((data)=>{
					mui(e.target).button('reset');
					if(this.isEdit){
						app.mui.toast('修改成功');
					}else{
						app.mui.toast('添加成功');
					}
					_this.$parent.goBack();
				}).catch(()=>{
					mui(e.target).button('reset');
				});
			},

			//是否默认
			goswitch(){
				let _this = this;
				_this.$refs.mySwitch.addEventListener("toggle",function(event){
				  if(event.detail.isActive){
				   _this.isDefault = true;
				  }else{
				    _this.isDefault = false;
				  }
				})
			},

			//修改-获得地址信息
			getEditAddress(){
				let _this = this;
				app.api.address.Addresses({
					success(data){
						_this.name= data.name;
						_this.mobilePhone = data.mobilePhone;
//						_this.idCardNumber = data.userIdCards.idCardNumber;
						_this.mergeName = data.regions.mergeName;
						_this.regionId = data.regions.id;
						_this.specificAddress = data.specificAddress;
						_this.isDefault = data.isDefault;
						if(_this.isDefault){
							_this.isActive = true;
						}
					}
				},this.id);
			}
		}
	}
</script>
<style lang="less" rel="stylesheet/less" type="text/css" scoped>
	.user-info {
		input::-webkit-input-placeholder{
			color: #ccc !important;
		}
		position: absolute;
		width: 100%;
		height: 98%;
		margin-top:2%;
		label{
			color:#666;
			font-size:14px;
			padding:11px 0px;
			width:24%;
			text-align:center;
		}
		input,textarea{
			color:#333;
			font-size:14px;
			width:73%;
		}
		textarea{
			padding: 10px 0;
		}
		.mui-table-view-cell {
			.set-default{
				line-height: 28px;
				white-space: nowrap;
			}
		}
		.mui-table-view-cell > a:not(.mui-btn).mui-active {
			background: none;
		}
		.mui-table-view-cell:after {
			background: #fff;
		}
		.add-address {
			position: fixed;
			right: 0;
			top: 0;
			z-index: 999;
			top: 10px;
			right: 10px;
			a {
				color: #333;
			}
		}
		.submit-btn.submit-btn-gray {
			background: #e4e4e4;
			color: #666;
		}
		.switch-btn {
			width: 30px;
			height: 18px;
			background: #e4e4e4;
			border: 0;
			&.mui-active {
				background: #1aad19;
				border-color: #1aad19;
				.mui-switch-handle {
					-webkit-transform: translate(14px, 0);
	    			transform: translate(14px, 0);
	    			z-index:999;
				}
			}
			.mui-switch-handle {
				width: 12px;
				height: 12px;
				margin-top: 4px;
				margin-left: 3px;
			}
			&:before {
				content: "";
			}
		}
		.mui-input-row:after {
			background: #fff;
			right:1%;
		}
		.switch{
			border-top:5px solid #efeff4;
			.input-switch {
				label {
					padding: 0;
				}
			}
			.notice{
				color:#f55424;
				margin-top:30px;
			}
		}
		.address-footer{
			position:absolute;
			bottom:0;
			width:100%;
			z-index:9;
			.submit-btn{
				width: 100%;
				border-radius: 0;
			}
		}
	}
</style>
