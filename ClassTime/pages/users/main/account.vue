<template>
	<view class="main_content">
		<view class="h500 content">
			<view class="main-body header">
				<ul>
					<li class="imgs"><image src="../../../static/img/qq.png"></image></li>
					<li class="header_title">
						<ul class="header_txt">
							<li>{{userinfo.nick_name}}</li>
							<li>{{userinfo.user_identity == 2?'机构':'家长'}}</li>
						</ul>
					</li>
				</ul>
				<view class="clear"></view>
			</view>			
		</view>
		<view class="main-body write lists">
			<ul>
				<li>个人信息</li>
				<li class="li30">
					<view class="uni-list-cell-left">
					    昵称
					</view>
					<view class="cell-right">
						<m-input class="m-input" type="text" clearable focus v-model="nick_name" placeholder="请输入昵称"></m-input>
					</view>
				</li>				
			</ul>
			<button type="primary" class="btn" @tap="bindsaveuserinfo">保存</button>
		</view>
	</view>
</template>

<script>
	import mInput from '../../../components/m-input.vue'
	import footerNav from "@/components/footer/footer_nav.vue"
	import uniSection from '@/components/uni-section/uni-section.vue'
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	
	var _self;
	
	export default {
	    components: {			
			mInput,footerNav,uniList,uniListItem,uniSection
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
				user_identity:0
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
								uni.showToast({
								    icon: 'none',
								    title: '修改成功'
								});
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

<style>
	.header{}
	.header ul,.main-body ul{ margin: 0upx; padding:0upx; list-style-type: none; }
	.header ul li{
		float: left;
	}
	.imgs {
		margin-right: 20upx;
		background-color: #eaeaea;
		width: 130upx;
		height: 130upx;
		text-align: center;
		border-radius: 80upx;
	}
	.imgs image{
		height: 100upx;
		width: 100upx;
		margin-top: 15upx;
	}
	.main-body{
		width: 95%;
		margin: 0 auto;
		margin-bottom: 20upx;
	}
	.write{
		background-color: #fff;
		margin-bottom: 30upx;
	}
	.header_txt li{
		clear: both;
	}
	
	.header_txt li:first-child{			
		height: 80upx;
		line-height: 80upx;
		font-size: 45upx;
	}
	.header_txt li:last-child{			
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
	}
	.lists ul li:first-child{		
		border-bottom: 1upx solid #eeeeee;
	}
	.lists ul li>view{
		float: left;
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
