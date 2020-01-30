<template>
	<view class="main_content">
		<view class="h500 content">
			<view class="main-body header">
				<ul>
					<li class="imgs">						
						<image class="headimgsize" :src="childface" mode="" @click="upload"></image>
					</li>
					<li class="header_title">
						<ul class="header_txt">
							<li>{{userinfo.nick_name}}</li>
							<li><image src="../../../static/img/mobile2.png" mode=""></image>{{userinfo.mobile}}</li>
						</ul>
					</li>
				</ul>
				<view class="clear"></view>
			</view>		
		</view>
		<view class="center-body write main-body">					
			<uni-grid :column="3" :show-border="false" @change="navToDetailPage">
			    <uni-grid-item v-for="(item, i) in data_ctgy" :key="i">
			       <view class="grid-item-box" >
						<image :src="item.image" class="identify-head" mode="aspectFill" ></image>
			            <text class="gemmologist-name">{{item.text}}</text>
			        </view>
			    </uni-grid-item>
			</uni-grid>
		</view>
		<view class="main-body write lists">
			<uni-list>
				<uni-list-item v-for="(item,index) in dataList" :key="index" :title="item.text" :thumb="'../../../static/img/'+item.image" @tap="bindclick(index)"></uni-list-item>
			</uni-list>
		</view>
		
		<view class="footer">
			<footerNav :msg="footer"></footerNav>
		</view>
	</view>
</template>

<script>
	import footerNav from "@/components/footer/footer_nav.vue"
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	export default {
	    components: {			
			footerNav,uniGrid,uniGridItem,uniList,uniListItem
		},
		onLoad(){
			this.checkLogin();
		},
		onReady() {
			this.show();
		},
		data(){
			return{
				childface:'',
				userinfo:[],
				dataList:[
					{"text":"我的账号","url":"account","image":"power.png"},
					{"text":"修改密码","url":"modifypassword","image":"password.png"},
					{"text":"更换手机","url":"modifymobile","image":"mobile5.png"},
					{"text":"升级账号","url":"upgrade","image":"upgrade.png"},
					{"text":"推荐好友","url":"tjgoodsfriend","image":"tj.png"},
				],
				footer: 'mine',
				data_ctgy:[  
				    {image:'../../../static/img/message.png',text:'我的消息',url:"../../pages/mngt-ctgy/ctgy-indicator"},  
				    {image:'../../../static/img/favorites.png',text:'收藏夹',url:"../../pages/mngt-ctgy/ctgy-mix"},  
				   
					{image:'../../../static/img/orders.png',text:'我的账单',url:"../../pages/mngt-ctgy/style-followup"}        
				]
			}
		},
		methods:{			
			bindclick:function(num){
				this.navigateTo(this.dataList[num].url);
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
				let that = this;
				uni.request({
					url: that.getUsersInfoUrl,
					header: {
				        "Content-Type": "application/x-www-form-urlencoded"							 
				    },
				    data: {
						"guid": data.guid,
						"token":data.token,
						"t":Math.random()
				    },
				    method: "get",
					success: (res) => {
						if(res.data){
							let data = res.data;
							if(data.status == 3){
								that.userinfo = data.userinfo;
								that.childface = that.PicUrl + 'users' + data.userinfo.face;
							}
						}
					}
				});
			},
			upload(){
				var _self = this;
				uni.chooseImage({
				 count: 1,
				 sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				 sourceType: ['album'], //从相册选择
				 success: function (res) {					
					let ret = _self.getUserInfo();
					//debugger;
					var url = _self.ModifyParentfaceUrl;
					const tempFilePaths = res.tempFilePaths;
					const uploadTask = uni.uploadFile({
					"url" : url,
					"filePath": tempFilePaths[0],
					"name": 'file',
					"formData": {
						guid: ret.guid,
						token: ret.token,
						t:Math.random()
					},
					success: function (uploadFileRes) {
						_self.childface = uploadFileRes.data;
						uni.showToast({
							title: '上传成功',
							icon: 'none',
						});
					}
				});							 
				uploadTask.onProgressUpdate(function (res) {
					   _self.percent = res.progress;
					   console.log('上传进度' + res.progress);
					   console.log('已经上传的数据长度' + res.totalBytesSent);
					   console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
					  });
					},
					 error : function(e){
					  console.log(e);
					}
				});			   
			}			
		}
	}
		
</script>

<style>	
	.lists{
		/* height: 350upx; */
		padding: 20upx 0upx;
	}
	.gemmologist-name{
		display: block;
		/* border:1px solid #FF0; */
		height: 45upx;
		line-height: 45upx;
		font-size: 25upx;
		
	}
	.grid-item-box{
		/* border: 1px solid #f00; */
		text-align: center;
		height: 165upx;
		margin-top: 25upx;
	}
	.grid-item-box text{
		height: 45upx;
	}
	image.identify-head{
		width: 80upx;
		height: 80upx;
		clear: both;
		/* border:1px solid #f00; */
	}
	.main_content{
		background-color: #eaeaea;
	}
	.header_title{
		/* border:#f00 solid 1upx; */
	}
	.header_txt li{
		clear: both;
		color:#fff;		
	}
	.header_txt li image{
		width: 42upx;
		height: 42upx;
		margin-right: 5upx;
	}
	.header_txt li:first-child{		
		vertical-align: top;
		height: 78upx;
		line-height: 78upx;
		font-size: 45upx;
	}
	.header_txt li:last-child{
		height: 42upx;
		line-height: 42upx;
		font-size: 30upx;
	}
	.imgs {
		height:120upx;
		margin-right: 20upx;
		background-color: #fff;
		border-radius: 80upx;
		width: 130upx;
		height: 130upx;
		text-align: center;
		overflow: hidden;
	}
	.imgs image{
		height: 120upx;
		width: 120upx;
	}
	.h500{
		height: 280upx;
		background-color: #0a8aff;
		padding-top: 120upx;
	}		
	.main-body{
		width: 95%;
		margin: 0 auto;
	}
	.write{
		background-color: #fff;
		border-radius: 25upx;
		margin-bottom: 30upx;
	}
	.center-body{
		height: 180upx;	
		margin-top: -90upx;
	}
	.header{}
	.header ul{ margin: 0upx; padding:0upx; list-style-type: none; }
	.header ul li{
		float: left;
	}
	
</style>
