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
				<li>身份信息</li>
				<li class="li30">
					<view class="uni-list-cell-left">
现在身份:
					</view>
					<view class="cell-right">
						{{userinfo.user_identity == 2?'机构':'家长'}}
					</view>
				</li>
				<li class="li30">
					<view class="uni-list-cell-left">
				升级为:
					</view>
					<view class="cell-right">
						<radio-group @change="radioChange">
							<label class="radio" v-for="(item, index) in items" :index="index" :key="item.value">
								<radio :value="item.value" :disabled="parseInt(item.value) == parseInt(upgrade_id)" :checked="parseInt(item.value) == parseInt(upgrade_id)"/><text>{{item.name}}</text>
							</label>							
						</radio-group>
					</view>
				</li>
			</ul>	
			<button type="primary" class="btn" @tap="bindupgrade" :disabled="items.length==0">申请升级</button>
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
				user_identity:0,
				upgrade_id:0,
				items: []
			}
		},
		methods:{
			radioChange: function(evt) {
				var current = evt.detail.value;
				_self.upgrade_id = current;
			},
			bindupgrade(){				
				let ret = _self.getUserInfo();
				const data = {
				    guid: ret.guid,
				    token: ret.token
				};
				if(parseInt(_self.upgrade_id) <= parseInt(ret.identity)){
					uni.showToast({
					icon: 'none',
					    title: '请选择更高的级别',
						duration:2000
					});
					return;
				}
				_self.sendRequest({
					url : _self.UpgradeUrl,
				    method : "post",
				    data : {"token":ret.token,"guid":ret.guid,upgrade_id:_self.upgrade_id,"t":Math.random()},
				    hideLoading : true,
				    success:function (res) {
						let str = '';
						switch(parseInt(res.status)){
							case 1:{
								str = '请不要重复申请';
								break;
							}
							case 2:{
								str = '不可以降级申请';
								break;
							}
							case 3:{
								str = '已申请，等待审核';
								break;
							}
						}
						uni.showToast({
						icon: 'none',
						    title: str,
							duration:2000
						});
					}
				});				
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
				    method : "post",
				    data : {"token":ret.token,"guid":ret.guid,"t":Math.random()},
				    hideLoading : true,
				    success:function (res) {
						if(res){
							let data = res;
							if(data.status == 3){
								_self.userinfo = data.userinfo;
								_self.nick_name = data.userinfo.nick_name;
								_self.upgrade_id = data.userinfo.user_identity;
								
								var arr = [{value: '1',name: '家长'},{value: '2',name: '机构'}];
								var len = arr.length;
								for(let i = len; i > 0; i--){
									if(arr[i-1].value <= data.userinfo.user_identity){
										arr.splice(i-1,1); //移掉以前的身份
									}
								}
								_self.items = arr;
								
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
		text-align: left;
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
		width:65%;
		text-align: left;		
	}
	.cell-right label{
		margin-right: 30upx;
	}
	.m-input{
		height: 55upx;
		line-height: 55upx;
	}
</style>
