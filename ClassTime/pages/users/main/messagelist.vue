<template>
	<view class="main_content">
		<view class="h500 content">
		</view>
		<view class="center-body write main-body">
			我的消息
		</view>
		
		<view class="main-body write lists">
			<uni-list>
				<uni-list-item v-for="(item,index) in dataList" :key="index" :title="item.message_title" @tap="bindclick(item.message_id)" :show-arrow="false" :show-badge="item.isread==0?true:false" badge-text="new"></uni-list-item>
			</uni-list>
			<uni-list>
				<uni-list-item :show-arrow="false" :showIcon="false"><uni-pagination @change="handlePage" :show-icon="true" :total="total" :current="page" :pageSize="pagesize" /></uni-list-item>
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
	import uniPagination from '@/components/uni-pagination/uni-pagination.vue'
	
	var _self;
	
	export default {
	    components: {			
			footerNav,uniGrid,uniGridItem,uniList,uniListItem,uniPagination
		},
		onLoad(){
			_self = this;
			this.checkLogin();
		},
		onReady() {
			this.show();
		},
		data(){
			return{
				page:1,
				current: 1,
				total: 0,
				pagesize: 6,
				dataList:[					
				],
				dataList2:[
					
				]
			}
		},
		methods:{
			navToDetailPage:function(e){
				let index = e.detail.index;
				let url = _self.data_ctgy[index].url;
				_self.navigateTo(url);
			},
			bindquit:function(){
				_self.quit();
			},
			bindclick:function(message_id){
				_self.navigateTo('messageshow?id='+message_id+"&page="+_self.page);
				
			},
			show(){
				let ret = this.getUserInfo();
				const data = {
				    guid: ret.guid,
				    token: ret.token
				};
				this.getData(data);
			},
			handlePage(params){
				//debugger;
				_self.page = params.current;
				_self.show();
			},
			getData(data){
				this.sendRequest({
				    url : _self.MessagelistUrl,
				    method : _self.Method,
				    data : {"token":data.token,"guid":data.guid,"page":_self.page,"pagesize":_self.pagesize,"t":Math.random()},
				    hideLoading : true,
				    success:function (res) {
						if(res){
						//	debugger;
							let data = res.messagelist;
							if(res.status == 3){
								let data1 = data.list;
								let list = [];
								for (var i = 0; i < data1.length; i++) {
									var item = data1[i];
									list.push(item);
								}								
								_self.dataList = list;
								_self.total =  data.count;
							}
						}
				    }
				},"1","");
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
	.uni-pagination{
		width: 100%;
		margin: 0 auto;
	}
	.example-body {
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 0;
		font-size: 14rpx;
		background-color: #ffffff;
		margin-bottom: 120upx;
	}	
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
		overflow: hidden;
	}
	.write{
		background-color: #fff;
		border-radius: 25upx;
		margin-bottom: 20upx;
	}
	.center-body{
		height:120upx;	
		line-height: 120upx;
		margin-top: 20upx;
		font-size: 35upx;		
		padding-left: 80upx;
		overflow: hidden;
		background:url(../../../static/img/message.png) 30upx 40upx no-repeat;
		background-size: 42upx 42upx;
		border-radius: 0upx;
		background-color: #fff;
	}
	
	
	.header{}
	.header ul{ margin: 0upx; padding:0upx; list-style-type: none; }
	.header ul li{
		float: left;
	}
	
</style>
