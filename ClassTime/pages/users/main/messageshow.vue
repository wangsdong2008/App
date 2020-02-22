<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="title">
				<image src="../../../static/img/message.png" mode=""></image>我的消息
			</view>	
		
			<view class="main-body write lists">
				<view class="titles ll">{{message_title}}</view>
				<view class="contents ll" >{{message_content}}</view>
				<view class="times ll">{{message_time}}</view>
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
			headerNav,footerNav
		},		
		onLoad(options){
			_self = this;
			this.checkLogin(0);
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
				message_time:'',
				headermsg:'会员中心,Member Center',
				footer:'',
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
								_self.message_time = data.addtime;
							}
						}
				    }
				},"1","");
			}		
		}
	}
		
</script>

<style>	
	.contents{
		padding: 40upx 0upx 0upx 0upx;
		font-size: 30upx;
		line-height: 50upx;
	}
	.times{
		padding: 20upx 0upx 40upx 0upx;		
		font-size: 30upx;
		text-align: left;
	}
	.ll{
		width: 90%;
		margin: 0 auto;
	}
	.titles{
		padding-bottom: 20upx;
		border-bottom:1px solid #058DD9;
		font-size: 35upx;
	}
	.lists{
		border:1upx solid #eaeaea;
		width:96%;
		margin: 0 auto;
		margin-top: 40upx;
		padding-top: 30upx;
		border-radius: 15upx;
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
