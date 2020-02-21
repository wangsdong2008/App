<template>
	<view class="main_content">
		<view class="header-title">
		    <view class="login_center login_title_txt">
				<view class="header-img"><image :src="childface" mode=""  @click="upload"></image></view>
				<view class="titles"> <span>{{userinfo.nick_name}}</span></view>	
			</view>
		</view>	
		<view class="center100 content">
			<view class="title">
				<image src="../../../static/img/userHL.png" mode=""></image>会员中心
			</view>		
			<view class="main-body write lists">
				<uni-list>
					<uni-list-item v-for="(item,index) in dataList" :key="index" :title="item.text" :thumb="'../../../static/img/'+item.image" @tap="bindclick(index)"></uni-list-item>
					<uni-list-item title="退出" thumb="/static/img/quit.png" @tap="bindquit"></uni-list-item>
				</uni-list>	
			</view>	
			<!-- <view> <button type="primary" class="primary" @tap="bindface">更换头像</button></view> -->
			
		</view>
	    <view class="footer">
	    	<footerNav :msg="footer"></footerNav>
	    </view>
	</view>
</template>

<script>	
	import footerNav from "@/components/footer/footer_nav.vue"
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	
	
	var _self;
	
	export default {
	    components: {			
			footerNav,uniList,uniListItem
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
				name:'',
				en_name:'',				
				childface:'',
				userinfo:[],
				dataList:[					
					{"image":"power.png","url":"account","text":"修改昵称"},
					{"image":"password.png","text":"修改密码","url":"modifypassword"},
					{"image":"mobile5.png","text":"更换手机","url":"modifymobile"},					
					{image:'message.png',text:'我的消息(0)',url:"messagelist"},
					{"text":"升级账号","url":"upgrade","image":"upgrade.png"},
					{"text":"会员续费","url":"pay","image":"xf.png"}, 
				],
				headermsg:'',
				footer: 'mine'
			}
		},
		methods:{
			bindface:function(){
				//_self.childface = "http://192.168.1.103/uploadfile/users/20200220/f2ebe7a571357bd83c6708cdf702d44b.jpg";
			},
			navToDetailPage:function(e){
				let index = e.detail.index;
				let url = _self.data_ctgy[index].url;
				_self.navigateTo(url);
			},
			bindquit:function(){
				_self.quit();
			},
			bindclick:function(num){
				_self.navigateTo(_self.dataList[num].url);				
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
				_self.sendRequest({
				    url : _self.getUsersInfoUrl,
				    method : _self.Method,
				    data : {"token":data.token,"guid":data.guid,"t":Math.random()},
				    hideLoading : true,
				    success:function (res) {
						if(res){
							let data = res;
							if(data.status == 3){
								_self.userinfo = data.userinfo;
								_self.childface = _self.PicUrl + 'users' + data.userinfo.face;
								_self.dataList[3].text = "我的消息("+data.messagenum+")";
							}
						}
				    }
				},"1","");
			},
			
			upload(){
				uni.chooseImage({
				 count: 1,
				 sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				 sourceType: ['album'], //从相册选择
				 success: function (res) {					
					let ret = _self.getUserInfo();
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
						let imgpath = uploadFileRes.data;
						_self.childface = imgpath;
						uni.showToast({
							title: '上传成功',
							icon: 'none'
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
	.titles{
		line-height: 40upx;
		margin-top: 20upx;
		text-align: center;
		
	}
	.header-title{
		background:url(../../../static/img/login_title.png) #ffffff center 0 no-repeat;
	    background-size:100% 100%;
	    padding-bottom:20%
	}
	.header-img{
		width:150upx;
		height: 150upx;
		margin: 0 auto;
		overflow: hidden;
		border-radius: 90upx;	
		border:1px solid #fff;
		background-color: #fff;
	}
	.login_center{
		width:85%;			
		margin: 0 auto;
	}
	.login_center image{
		width:150upx;
		height: 150upx;
		margin: 0 auto;
	}
	.login_title_txt{
	    color:#fff;	   
	    padding-top:90upx;
	}
	.login_title_txt span{
		font-family:'微软雅黑';
	    font-size: 35upx;
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
