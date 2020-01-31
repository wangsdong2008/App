<template>
	<view class="main_content">
		<view class="h500 content">
			<view class="main-body header">
				<ul>
					<li class="imgs">更换手机</li>
					<li class="header_title">
						此操作将会更换您的手机，更换后请使用新手号码登录
					</li>
				</ul>
			</view>
		</view>
		<view class="main-body write lists">
			<ul>
				<li class="li31">
					<m-input class="m-input" type="text" clearable focus v-model="old_mobile" placeholder="请输入旧手机"></m-input>
				</li>
				<li class="li31">
					<m-input class="m-input" type="text" clearable v-model="new_mobile" placeholder="请输入新手机"></m-input>
				</li>
				<li class="li30">
					<m-input class="m-input inputs" type="text" clearable v-model="code" placeholder="请输入验证码"></m-input>
					<button type="default" class="btns" size="mini" @tap="bindcode">获取验证码</button>
				</li>
			</ul>
			<button type="primary" class="btn" @tap="bindsavemobile">修改</button>
		</view>
	</view>
</template>
<style>
	.header {}

	.header ul,
	.main-body ul {
		margin: 0upx;
		padding: 0upx;
		list-style-type: none;
	}

	.header ul li {
		padding: 20upx;
	}

	.imgs {
		height: 40upx;
		text-align: left;
		font-weight: bold;
	}

	.main-body {
		width: 95%;
		margin: 0 auto;
		margin-bottom: 20upx;
	}

	.header_title {
		font-size: 30upx;
	}

	.write {
		background-color: #fff;
		margin-bottom: 30upx;
	}

	.header_txt li {
		clear: both;
	}

	.header_txt li {
		height: 50upx;
		line-height: 50upx;
		font-size: 30upx;
	}

	.gemmologist-name {
		display: block;
		height: 45upx;
		line-height: 45upx;
		font-size: 25upx;

	}

	.grid-item-box {
		text-align: center;
		margin-top: 25upx;
		height: 45upx;
	}

	image.identify-head {
		width: 80upx;
		height: 80upx;
		clear: both;
	}

	.main_content {}

	.h500 {
		padding-top: 120upx;
	}

	.btn {
		margin-top: 80upx;
		clear: both;
	}

	.lists ul li {
		padding: 25upx 20upx;

	}

	.lists ul li.li30 {
		margin-bottom: 30upx;
		background: url(../../../static/img/password1.png) 20upx 25upx no-repeat;
		padding-left: 70upx;
	}

	.inputs {
		border: 1px solid #f00;
		float: left;
		width: 60%;
		margin-right: 20upx;
		height: 35upx;
	}

	.btn2 {
		float: left;
		border: 1px solid #f00;
	}

	.lists ul li.li31 {
		margin-bottom: 30upx;
		background: url(../../../static/img/mobile1.png) 20upx 25upx no-repeat;
		padding-left: 70upx;
	}

	.lists ul li>view {}

	.uni-list-cell-left {
		margin-right: 40upx;
		width: 25%;
	}

	.cell-right {
		float: left;
		border: 1px solid #66ccff;
		width: 65%;
		text-align: center;
	}

	.m-input {
		height: 55upx;
		line-height: 55upx;
	}
</style>

<script>
	import service from '../../../service.js'
	import mInput from '../../../components/m-input.vue'
	import footerNav from "@/components/footer/footer_nav.vue"
	var _self;
	export default {
		components: {
			service,
			mInput,
			footerNav
		},
		onLoad() {
			_self = this;
			_self.checkLogin();
		},
		onReady() {
			_self.show();
			_self.getcurrentsession();
		},
		data() {
			return {
				old_mobile: '',
				new_mobile: '',
				code: ''
			}
		},
		methods: {
			bindcode(){
				if(!service.checkMobile(_self.new_mobile)){
					uni.showToast({
					    icon: 'none',
					    title: '新手机号码不合法'
					});
					return;
				}
				
				if(this.temp_status == 1){ //测试
					uni.removeStorage({
					    key:_self.Temp_KEY,
					    success:function() {
					        console.log(' 移除成功')　　　　　
					    }
					});
				}
				
				//debugger;				
				var ret = uni.getStorageSync(_self.Temp_KEY);
				if(ret == undefined || ret == ""){//如果不能获取的话，获取新的sessionid，防止软件直接注册
					return false;
				}else{
					//通过更换手机页面过来的
					const data = {
					    "token": ret.token,
					    "mobile": _self.new_mobile,
						"smsid":ret.smsid,
						"status":2
					};
					_self.sendsms2(data);
				}
				
			},
			bindsavemobile() {
				if (!service.checkMobile(_self.old_mobile)) {
					uni.showToast({
						icon: 'none',
						title: '请填写旧手机'
					});
					return;
				}
				if (!service.checkMobile(_self.new_mobile)) {
					uni.showToast({
						icon: 'none',
						title: '请填写新手机'
					});
					return;
				}
				if (!service.checkNull(_self.code)) {
					uni.showToast({
						icon: 'none',
						title: '请填写验证码'
					});
					return;
				}
				
				let ret = _self.getUserInfo();
				 _self.sendRequest({
				        url : _self.ModifyUserInfoUrl,
				        method : "post",
				        data : {
							"guid": ret.guid,
							"token": ret.token,
							"old_mobile": _self.old_mobile,
							"new_mobile": _self.new_mobile,
							"code": _self.code,
							"status": 2,
							"t": Math.random()
						},
				        hideLoading : false,
				        success:function (res) {
							//debugger;
				            //console.log("获取数据:" + JSON.stringify(res));
							let data = res;
							let str = '';
							switch (parseInt(data.status)) {
								case 1:
									{
										str = '旧手机错误';
										break;
									}
								case 2:
									{
										str = '手机号码不存在的';
										break;
									}
								case 3:
									{
										str = '手机修改成功，请使用新手机登录';
										break;
								}
								case 4:{
									str = '验证码不正确';
									break;
								}
							}
							//this.userinfo = data.userinfo;
							uni.showToast({
								icon: 'none',
								title: str
							});
							try {
								uni.clearStorageSync();
							} 
							catch (e) {  
							}
							this.reLaunchurl('../login/login');
							
				        }
				    },"1","");			
			},
			show() {
				let ret = this.getUserInfo();
				const data = {
					guid: ret.guid,
					token: ret.token
				};
				this.getData(data);
			},
			getData(data) {
				this.sendRequest({
					url : this.getUsersInfoUrl,
				    method : "post",
				    data : {
						"guid": data.guid,
						"token": data.token,
						"t": Math.random()
					},
				    hideLoading : true,
				    success:function (res) {
						if (res) {
							let data = res;
							if (data.status == 3) {
								this.userinfo = data.userinfo; 
							}
						
						}
				    }
				},"1","");				
			}
		}
	}
</script>
