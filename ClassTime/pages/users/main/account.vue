<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="title">
				<image src="../../../static/img/power.png" mode=""></image>修改昵称
			</view>		
			<view class="main-body write lists">
				<ul>
					<li>
						<view class="uni-list-cell-left">
						    昵称
						</view>
						<view class="cell-right">
							<m-input class="m-input" type="text" clearable focus v-model="nick_name" placeholder="请输入昵称"></m-input>
						</view>
					</li><view class="clear"></view>				
				</ul>
				<view>
					<button type="primary" class="btn" @tap="bindsaveuserinfo">保存</button>
				</view>
			</view>	
			
		</view>
		<view class="footer">
			<footerNav :msg="footer"></footerNav>
		</view>
		
		
		
	</view>
</template>
<style>
	*{
		margin: 0;
		padding: 0;
	}
	.main_content{		
	}	

	.btn{
		margin-top: 40upx;
		clear: both;
	}
	.lists{		
		/* border:1px solid #f00; */
		width:96%;
		margin: 0 auto;
		margin-top: 40upx;
		padding-top: 40upx;
	}
	.lists ul{
		list-style-type: none;		
	}
	.lists ul li{
		padding: 25upx 20upx;
		height: 60upx;
		line-height: 60upx;
	}	
	
	.uni-list-cell-left{
		margin-right: 40upx;
		width:20%;
		float: left;
	}
	.cell-right{
		float: left;
		border: 1px solid #66ccff;
		width:70%;
		text-align: center;		
	}
	.m-input{
		height: 55upx;
		line-height: 55upx;
	}
	
	.content{
		width:96%;
		margin: 0 auto;
	}
	.content .title{
		border-bottom: 1px solid #66ccff;
		height: 45upx;
		line-height: 45upx;
		margin: 30upx 0upx;
		padding-bottom: 30upx;
	}
	.content .title image{
		width: 50upx;
		height: 50upx;
		margin-right: 20upx;
	}
</style>

<script>
	import mInput from '../../../components/m-input.vue'
	import headerNav from "@/components/header/users_header.vue"
	import footerNav from "@/components/footer/footer_nav.vue"
	import uniSection from '@/components/uni-section/uni-section.vue'
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	
	var _self;
	
	export default {
	    components: {			
			mInput,headerNav,footerNav,uniList,uniListItem,uniSection
		},
		onLoad(){
			_self = this;
			_self.checkLogin();
		},
		onReady() {
			_self.show();
		},
		data(){
			return{
				userinfo:[],
				dataList:[],
				nick_name:'',
				user_identity:0,
				headermsg:'会员中心,Member Center',
				footer:''
			}
		},
		methods:{
			bindsaveuserinfo(){				
				if(_self.nick_name.trim() == '' || _self.nick_name.trim().length == 0){
					uni.showToast({
					    icon: 'none',
					    title: '请填写昵称'
					});
					return;
				}			
				let ret = _self.getUserInfo();
				 _self.sendRequest({
				        url : _self.ModifyUserInfoUrl,
				        method : _self.Method,
				        data : {
							"guid": ret.guid,
							"token": ret.token,	
							"nick_name":_self.nick_name,
							"status":0,
							"t":Math.random()
						},
				        hideLoading : false,
				        success:function (res) {
							let data = res;
							if(parseInt(data.status) == 3){
								
								_self.userinfo = data.userinfo;
								/* uni.showToast({
								    icon: 'none',
								    title: '修改成功',
									duration:2000
								}); */
								_self.navigateTo('main');
							}
				        }
				    },"1");
			},
			show(){
				let ret = _self.getUserInfo();
				const data = {
				    guid: ret.guid,
				    token: ret.token
				};
				_self.getData(data);
			},
			getData(data){
				let ret = _self.getUserInfo();
				_self.sendRequest({
					url : _self.getUsersInfoUrl,
				    method : _self.Method,
				    data : {"token":ret.token,"guid":ret.guid,"t":Math.random()},
				    hideLoading : true,
				    success:function (res) {
						if(res){
							let data = res;
							if(data.status == 3){
								_self.userinfo = data.userinfo;
								_self.nick_name = _self.userinfo.nick_name;
							}
						}
				    }
				},"1");				
			}
			
		}
	}
		
</script>

