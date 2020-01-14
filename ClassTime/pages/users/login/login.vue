<template>
	<view class="login_content">
		<view class="title">
		    <view class="login_center login_title_txt">登录<br /><span>Welcome back</span></view>
		</view>
		<view class="login_center content">
			<view class="login_account">帐号</view>
			<view class="login_account_input">
				<m-input class="m-input login-input" type="text" clearable focus v-model="account" placeholder="请输入手机号码"></m-input>
			</view>
			<view class="login_account">密码</view>
			<view class="login_account_input">
				<m-input class="m-input login-input-password" type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
			</view>
			<view class="login_account_input">
				<view class="remeber">
					<checkbox value="1" checked="checked" />记住密码
				</view>
			</view>
			<view class="btn-row">
				<button class="btn" type="submit" cursor @tap="bindLogin" >登录</button>
			</view>
			<view class="action-row">
			    <navigator url="../reg/reg">注册账号</navigator>
			    <text>|</text>
			    <navigator url="../pwd/pwd">忘记密码</navigator>
			</view>
			</view>
		</view>
	</view>
</template>

<script>
	import service from '../../../service.js';
	import mInput from '../../../components/m-input.vue'
	import {
	    mapState,
	    mapMutations
	} from 'vuex'
	
	export default {
	    components: {
	        mInput
	    },
	    data() {
	        return {
	            providerList: [],
				hasProvider: false,
	            account: '13816141683',
	            password: '123123',
	            positionTop: 0
	        }
	    },
		
		computed: mapState(['forcedLogin']),
		methods: {
		    ...mapMutations(['login']),
			getsession(){
				this.getcurrentsession();	
			},
			bindLogin() {
                /**
                 * 客户端对账号信息进行一些必要的校验。
                 * 实际开发中，根据业务需要进行处理，这里仅做示例。
                 */
                if (this.account.length < 5) {
                    uni.showToast({
                        icon: 'none',
                        title: '账号最短为 5 个字符'
                    });
                    return;
                }
                if (this.password.length < 6) {
                    uni.showToast({
                        icon: 'none',
                        title: '密码最短为 6 个字符'
                    });
                    return;
                }
                /**
                 * 下面简单模拟下服务端的处理
                 * 检测用户账号密码是否在已注册的用户列表中
                 * 实际开发中，使用 uni.request 将账号信息发送至服务端，客户端在回调函数中获取结果信息。
                 */
                const data = {
                    username: this.account,
                    password: this.password
                };
                /* const validUser = service.getUsers().some(function (user) {
                    return data.account === user.account && data.password === user.password;
                });
                if (validUser) {
                    this.toMain(this.account);
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: '用户账号或密码不正确',
                    });
                } */
				this.userLogin(data);
            },
            initPosition() {
                /**
                 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
                 * 反向使用 top 进行定位，可以避免此问题。
                 */
                this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
            },
			userLogin(data){
				//清空缓存
				var self = this;				
				let name = data.username,password = data.password;
				console.log(self.LoginUrl);
				//debugger;
				uni.request({
					url: self.LoginUrl,
					header: {
				             "Content-Type": "application/x-www-form-urlencoded"							 
				    },
				    data: {
				        "username": name,
				        "password": password
				    },
				    method: "get",
					success: (res) => {
					    var data = res.data;
					    if(data.status == 3){
							//清空原来的缓存
							try {
								uni.clearStorageSync();  
							} 
							catch (e) {  
							}
							
							var d = {
								id:data.id,
								mobile:data.mobile,
								username:data.username,
								token:data.token,
								guid:data.guid,
								time:data.time,
								identity:data.user_identity,
								is_brithday:data.is_brithday
							}
							
							let url = '';
							switch(parseInt(data.user_identity))
							{
								case 1:{
									url = 'parents/parents/index';
									break;
								}
								case 2:{
									url = 'company/company/index';
									break;
								}
								case 3:{
									url = 'teacher/teacher/index';
									break;
								}
							}
							url = '../../' + url;
							
							uni.setStorage({
								key:this.USERS_KEY,
								data:d
							});
							
							uni.showToast({
								title: '登录成功!',
								mask: true,
								duration: 1500,
								success: function(){
									
								    uni.reLaunch({  
								        url: url  
								    }); 
									
								}  
							});	
							
							
						}else{
							uni.showToast({
								icon: 'none',
								title: '用户账号或密码不正确',
							});
						}
					}
				})
			},
			
		},
        onReady() {
            this.initPosition();
            /* this.initProvider(); */
			this.getsession();
        }
	}
</script>

<style>
	.action-row {
		display: flex;
	    flex-direction: row;
	    justify-content: center;
	}
	
	.action-row navigator {
	    color: #007aff;
	    padding: 20upx 20upx;
		font-size: 35upx;
	}
	.action-row text{
		font-size: 30upx;
		margin-top: 20upx;
	}
	.btn-row{
			margin-top: 15upx;
		}
		.btn{
			background-color: #55c5ff;
			border-radius: 50upx;
			border: 0px;
			text-align: center;
			line-height:80upx;
			height: 80upx;
			color: #ffffff;
			cursor: pointer;		
		}
		uni-button:after{
			border: 0px;
		}
	.remeber{
		font-size: 28upx;
		margin-top: 20upx;		
	}
	.remeber checkbox{
		
	}	
	.m-input{
		border: 0upx;
		border-bottom: 1px solid #eeeeee;
		line-height: 70upx;
		height: 70upx;
		font-size: 28upx;
		
	}
	.content{
		background-color: #fff;
		
		padding-top: 20upx;
    }
	.login_account_input{
		padding-top: 10upx;
	}
	.login_account{
		font-size: 32upx;
		font-family: '黑体';
		margin-top: 40upx;
	}
	.login_content{
	        width: 100%;/* 
	        height: 2500upx; */
	    }
	.title{
		background:url('../../../static/img/login_title.png') #ffffff center 0 no-repeat;
	    background-size:100% 100%;
	    padding-bottom:20%
	}
	.login_center{
		width:85%;			
		margin: 0 auto;
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
