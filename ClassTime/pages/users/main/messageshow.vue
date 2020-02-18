<template>
	<view class="main_content">
		<view class="h500 content">
		</view>
		<view class="center-body write main-body">
			我的消息
		</view>
		
		<view class="main-body write lists">
			<view class="title ll">{{message_title}}</view>
			<view class="content ll" >{{message_content}}</view>
			<view class="times ll">{{message_time}}</view>
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
		onLoad(options){
			_self = this;
			this.checkLogin();
			_self.message_id = options['id'];
		},
		onReady() {
			this.show();
		},
		data(){
			return{
				message_id:0,
				message_title:'',
				message_content:'',
				message_time:''
			}
		},
		methods:{			
			show(){
				let ret = this.getUserInfo();
				const data = {
				    guid: ret.guid,
				    token: ret.token,
					id:_self.message_id
				};
				this.getData(data);
			},			
			getData(data){
				this.sendRequest({
				    url : _self.MessageshowUrl,
				    method : _self.Method,
				    data : {"token":data.token,"guid":data.guid,"id":data.id,"t":Math.random()},
				    hideLoading : true,
				    success:function (res) {
						if(res){
							let data = res.messagelist;
							if(res.status == 3){								
								_self.message_title = data.message_title;
								_self.message_content = data.message_content;
								_self.message_time = data.message_addtime;
							}
						}
				    }
				},"1","");
			}		
		}
	}
		
</script>

<style>	
	.times{
		padding: 20upx 0upx;
		font-size: 25upx;
		text-align: left;
	}
	.ll{
		width: 90%;
		margin: 0 auto;
	}
	.title{
		padding-bottom: 20upx;
		border-bottom:1px solid #058DD9;
		font-size: 35upx;
	}
	.content{
		padding-top: 40upx;
		font-size: 30upx;
		line-height: 50upx;
	}
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
		padding:40upx 0upx;
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
