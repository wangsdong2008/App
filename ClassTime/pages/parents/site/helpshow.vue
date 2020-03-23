<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="title">
				<image src="../../../static/img/message.png" mode=""></image>我的消息
			</view>	
		
			<view class="main-body write lists">
				<view class="titles ll">{{article_title}}</view>
				<view class="contents ll" v-html="article_content"></view>
				<view class="times ll">{{article_time}}</view>
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
			this.checkLogin(_self.identity);
			_self.article_id = options['id'];
		},
		onReady() {
			this.show();
		},
		data(){
			return{
				article_id:0,
				article_title:'',
				article_content:'',
				article_time:'',
				headermsg:'帮助文档',
				footer:'',
				identity:1
			}
		},
		methods:{			
			show(){
				let ret = this.getUserInfo();
				const data = {
				    guid: ret.guid,
				    token: ret.token,
					id:_self.article_id
				};
				this.getData(data);
			},			
			getData(data){
				this.sendRequest({
				    url : _self.helpshowUrl,
				    method : _self.Method,
				    data : {"token":data.token,"guid":data.guid,"id":data.id,"identity":_self.identity,"t":Math.random()},
				    hideLoading : true,
				    success:function (res) {
						if(res){
							let data = res.articlelist;
							if(res.status == 3){
								_self.article_title = data.article_title;
								_self.article_content = data.article_content;
								_self.article_time = data.addtime;
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
		border-bottom:1px solid #ccc;
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
