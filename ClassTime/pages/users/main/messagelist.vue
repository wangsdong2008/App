<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="title">
				<image src="../../../static/img/message.png" mode=""></image>我的消息
			</view>	
			<view class="main-body write lists">
				<uni-list>
					<uni-list-item v-for="(item,index) in dataList" :key="index" :title="item.message_title" @tap="bindclick(item.message_id)" :show-arrow="false" :show-badge="item.isread==0?true:false" badge-text="new"></uni-list-item>
				</uni-list>
			</view>
			<view>
				<uni-pagination @change="handlePage" :show-icon="true" :total="total" :current="page" :pageSize="pagesize" />
			</view>
		
		</view> 
		<view class="footer">
			<footerNav :msg="footer"></footerNav>
		</view>
	</view>
</template>

<script>
	import headerNav from "@/components/header/users_header.vue"
	import footerNav from "@/components/footer/footer_nav.vue"
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'	
	import uniPagination from '@/components/uni-pagination/uni-pagination.vue'
	
	var _self;
	
	export default {
	    components: {			
			headerNav,footerNav,uniGrid,uniGridItem,uniList,uniListItem,uniPagination
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
				headermsg:'会员中心,Member Center',
				footer:'',
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
		width: 80%;
		margin: 0 auto;
		margin-top: 40upx;
	}		
	.lists{
		border:1px solid #eaeaea;
		width:96%;
		margin: 0 auto;
		margin-top: 40upx;
		padding-top: 10upx;
		border-radius: 15upx;
	}	
	
	.lists ul{
		list-style-type: none;
	}
	.lists ul li{
		padding: 20upx 20upx;
	}
	
	.write{
		background-color: #fff;
	}	
	.content{
		width:100%;
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
