<template>
	<view class="main_content">
		<view class="h500 content">
			<view class="main-body header">
				<ul>
					<li class="imgs">重置密码</li>
					<li class="header_title">
						此操作将会重置您的登录密码，请牢记新密码
					</li>
				</ul>
			</view>			
		</view>
		<view class="main-body write lists">
			<ul>				
				<li class="li30">					
					<m-input class="m-input" type="password" clearable focus v-model="old_password" placeholder="请输入旧密码"></m-input>					
				</li>
				<li class="li30">					
					<m-input class="m-input" type="password" clearable v-model="new_password" placeholder="请输入新密码"></m-input>					
				</li>
				<li class="li30">					
					<m-input class="m-input" type="password" clearable v-model="again_password" placeholder="请输入确认密码"></m-input>					
				</li>
			</ul>
			<button type="primary" class="btn" @tap="bindsaveuserinfo">修改</button>
		</view>
	</view>
</template>
<style>
	.header{}
	.header ul,.main-body ul{ margin: 0upx; padding:0upx; list-style-type: none; }
	.header ul li{padding:20upx;}
	.imgs {	
		height: 40upx;
		text-align: left;
		font-weight: bold;
	}	
	.main-body{
		width: 95%;
		margin: 0 auto;
		margin-bottom: 20upx;
	}
	.header_title{
		 font-size: 30upx;
	}
	.write{
		background-color: #fff;
		margin-bottom: 30upx;
	}
	.header_txt li{
		clear: both;
	}	
	
	.header_txt li{			
		height: 50upx;
		line-height: 50upx;
		font-size: 30upx;
	}
	.gemmologist-name{
		display: block;
		height: 45upx;
		line-height: 45upx;
		font-size: 25upx;
		
	}
	.grid-item-box{
		text-align: center;		
		margin-top: 25upx;
		height: 45upx;
	}
	image.identify-head{
		width: 80upx;
		height: 80upx;
		clear: both;
	}
	.main_content{	}	
	.h500{
		padding-top: 120upx;
	}
	.btn{
		margin-top: 80upx;
		clear: both;
	}
	.lists ul li{
		padding: 25upx 20upx;	
		
	}
	.lists ul li.li30{
		margin-bottom: 30upx;
		background:url(../../../static/img/password1.png) 20upx 25upx no-repeat;
		/* border:1px solid #f00; */
		padding-left: 70upx;
	}
	
	.lists ul li>view{
		
	}
	.uni-list-cell-left{
		margin-right: 40upx;
		width:25%;
	}
	.cell-right{
		float: left;
		border: 1px solid #66ccff;
		width:65%;
		text-align: center;		
	}
	.m-input{
		height: 55upx;
		line-height: 55upx;
	}
</style>

<script>
	import service from '../../../service.js'
	import mInput from '../../../components/m-input.vue'
	import footerNav from "@/components/footer/footer_nav.vue"
	export default {
	    components: {			
			service,mInput,footerNav
		},
		onLoad(){
			this.checkLogin();
		},
		onReady() {
			this.show();
		},
		data(){
			return{
				old_password:'',
				new_password:'',
				again_password:''
			}
		},
		methods:{
			bindsaveuserinfo(){
				let that = this;
				if(!service.checkNull(that.old_password)){
					uni.showToast({
					    icon: 'none',
					    title: '请填写旧密码'
					});
					return;
				}
				if(!service.checkNull(that.new_password)){
					uni.showToast({
					    icon: 'none',
					    title: '请填写新密码'
					});
					return;
				}
				if(!service.checkNull(that.again_password)){
					uni.showToast({
					    icon: 'none',
					    title: '请填写确认密码'
					});
					return;
				}
				if(that.new_password != that.again_password){
					uni.showToast({
					    icon: 'none',
					    title: '两次密码不一致，请重新输入'
					});
					return;
				}
				let ret = that.getUserInfo();
				
				this.sendRequest({
				    url : this.ModifyUserInfoUrl,
				    method : _self.Method,
				    data : {
						"guid": ret.guid,
						"token": ret.token,	
						"old_password":that.old_password,
						"new_password":that.new_password,
						"again_password":that.again_password,						
						"status":1,
						"t":Math.random()
					},
				    hideLoading : false,
				    success:function (res) {
						let data = res;
						let str = '';
						switch(parseInt(data.status)){
							case 1:{
								str = '两次密码不一致，请重新输入';
								break;
							}
							case 2:{
								str = '旧密码错误';
								break;
							}
							case 3:{
								str = '密码修改成功，请使用新密码登录';
								break;
							}
						}
						this.userinfo = data.userinfo;
						uni.showToast({
						    icon: 'none',
						    title: str
						});	
                    }
				},"1","");
			},
			show(){
				let ret = this.getUserInfo();
				const data = {
				    guid: ret.guid,
				    token: ret.token
				};
				this.getData(data);
			},
			getData(data){
				this.sendRequest({
			       url : this.getUsersInfoUrl,
			       method : _self.Method,
			       data : {"token":data.token,"guid":data.guid},
			       hideLoading : true,
			       success:function (res) {
						if(data.status == 3){
							this.userinfo = data.userinfo;
							this.nick_name = this.userinfo.nick_name;
						}
			       }
			   },"1","");	
			}
			
		}
	}
		
</script>

