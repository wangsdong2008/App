<template>
	<view class="login_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="login_center content">
			<view class="register_account">新用户</view>	
			<view class="register_account_input">				
				<m-input class="m-input register-input register-input-mobile" type="text" clearable focus v-model="mobile" placeholder="填写手机号码"></m-input>
			</view>
			<view class="register_account_input">
				<m-input class="m-input register-input register-input-mail" type="text" clearable v-model="code" placeholder="填写验证码"></m-input>
				<button class="btn1 btn" type="default" @tap="send_sms">获取验证码</button>
			</view>
			<view class="clear"></view>
			<view class="register_account_input">
				<m-input class="m-input register-input register-input-password" displayable type="password" clearable v-model="password" placeholder="6-20位登录密码"></m-input>
			</view>
			<view class="register_account_input">
				<m-input class="m-input register-input register-input-password" displayable type="password" clearable v-model="againpassword" placeholder="再次确认密码"></m-input>
			</view>
			<view class="btn-row">
			    <button type="primary" class="primary" @tap="register">注册</button>
			</view>			
		</view>		
	</view>
</template>

<style>	
	.clear{
		clear: both;
	}
	.action-row {
		display: flex;
	    flex-direction: row;
	    justify-content: center;
	}	
	.action-row navigator {
	    color: #007aff;
	    padding: 0 20upx;
		font-size: 30upx;
	}
	.action-row text{
		font-size: 20upx;		
	}
	.btn-row{
		margin-top: 40upx;	
		padding: 0upx;
	}
	
	uni-button{
		border-radius: 25upx;		
	}
	uni-button:after{
		border: 0px;		
	}
	.remeber{
		font-size: 28upx;
		margin-top: 10upx;		
	}
	.remeber checkbox{
		
	}
	.content{
		background-color: #fff;		
		padding-top: 10upx;
    }
	.register_account_input{
		padding-top: 20upx;
		padding-bottom: 10px;
		border-bottom: 1px solid #eeeeee;
		line-height: 90upx;
		height: 100upx;
	}
	.register_account{
		font-size: 42upx;
		font-family: '黑体';
		margin-top: 30upx;
		margin-bottom: 20upx;
	}
	.m-input{
		border: 0upx;
		font-size: 28upx;
	}
	.register-input{		
		width:90%;
		line-height: 60upx;
		height: 110upx;
		padding-left: 90upx;
	}
	.register-input-username{
		background:url(../../../static/img/user.png) no-repeat;
		-webkit-background-size:30upx 42upx ;
		background-size:30upx 42upx ;
	}
	.register-input-mobile{
		background:url(../../../static/img/mobile.png) no-repeat;
	}
	.register-input-mail{
		background:url(../../../static/img/mail.png) no-repeat;	
		width:48%;
		float: left;
		/* border:1px solid #ff0000; */
	}
	.btn1{
		border:0upx;
		background-color: #ccc;
		
	}
	.btn{
		float: right;
		background-color: #eee;
		color:#225181;
		font-size: 32upx;
		align:center;
		width: 35%;
		height: 76upx;
		line-height: 76upx;
		border-radius: 45upx;
		top:10upx;
		
		
	}
	.register-input-password{
		background:url(../../../static/img/password.png) no-repeat;		
	}
	.login_content{
	        width: 100%;
	    }
	.title{
		background:url('../../../static/img/login_title.png') #ffffff center 0 no-repeat;
	    background-size:100% 100%;
	    padding-bottom:20%
	}
	.login_center{
		width:85%;			
		margin: 0 auto;
		padding-bottom: 60upx;
	}
	.login_title_txt{
	    color:#fff;
	    font-family:'微软雅黑';
	    font-size:60upx;
	    padding-top:150upx;
	}
	.login_title_txt span{
	    font-size: 48upx;
	}
	
		
		
	
</style>

<script>
    import service from '../../../service.js';
    import mInput from '../../../components/m-input.vue';
	import headerNav from "@/components/header/company_header.vue";
	var _self;
	
	export default {
        components: {
            mInput,headerNav
        },
		onLoad(){
			_self = this;
		},
        data() {
            return {
				headermsg:'注册,Register',
				code:'',
                password: '',
                againpassword: '',
				mobile:'',
				sessionid:''
            }
        },
        methods: {
			send_sms(){		
				if(!service.checkMobile(_self.mobile)){
					uni.showToast({
					    icon: 'none',
					    title: '手机号码不合法'
					});
					return;
				}
				
				if(_self.temp_status == 1){ //测试
					try {
						uni.clearStorageSync();  
					} catch (e) {  
					// error  
					}
					debugger;
				}
									
				var ret = uni.getStorageSync(_self.Temp_KEY);
				if(ret == undefined || ret == ""){//如果不能获取的话，获取新的sessionid，防止软件直接注册
					return false;
				}else{
					//正常的页面，通过登录页面过来的
					const data = {
					    "token": ret.token,
					    "mobile": _self.mobile,
						"smsid":ret.smsid,
						"status":1
					};
					_self.sendsms2(data);
				}
			},
            register() {                
				if(!service.checkMobile(_self.mobile)){
				    uni.showToast({
				        icon: 'none',
				        title: '手机号码不合法'
				    });
				    return;
				}
				
				if(!service.checkNull(_self.code)){
				    uni.showToast({
				        icon: 'none',
				        title: '验证码不能为空'
				    });
				    return;
				}
				
                if (_self.password.length < 6) {
                    uni.showToast({
                        icon: 'none',
                        title: '密码最短为 6 个字符'
                    });
                    return;
                }
				if (_self.againpassword.length < 6) {
				    uni.showToast({
				        icon: 'none',
				        title: '密码最短为 6 个字符'
				    });
				    return;
				}
				if(_self.againpassword != _self.password){
					uni.showToast({
					    icon: 'none',
					    title: '两次密码不一致，请重新填写！'
					});
					return;
				}
				
                const data = {
                    password: _self.password,
					againpassword: _self.againpassword,
                    mobile: _self.mobile,
					code:_self.code
                }
                _self.addUsers(data);
                /* uni.showToast({
                    title: '注册成功'
                });
                uni.navigateBack({
                    delta: 1
                }); */
            }
        }
    }
</script>

