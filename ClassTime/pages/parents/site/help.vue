<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="title">
				<image src="../../../static/img/help.png" mode=""></image>帮助
			</view>
			<uni-collapse accordion="true">
			    <uni-collapse-item v-for="(item,index) in dataList" :title="item.article_title" :open="item.open" :index="index" :key="item.help_id" :thumb="'../../../static/img/step.png'" class="colbg">
					<view class="newcontent">{{item.article_content}}</view>					
			    </uni-collapse-item>
			</uni-collapse>
			
		</view>
		<view class="footer">
			<footerNav :msg="footer"></footerNav>
		</view>
	</view>
</template>

<script>
	import headerNav from "@/components/header/company_header.vue"
	import footerNav from "@/components/footer/footer_nav.vue"
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	var _self;
	export default {
		components: {
			uniCollapse,
			uniCollapseItem,
			headerNav,
			footerNav
		},
		data(){
			return{
				dataList:[
					
				],
				headermsg:'帮助,Help',
				footer: 'help'
			}
		},
		onLoad:function() {
			_self = this;
			_self.checkLogin();
		},
		onReady:function(){
			_self.show();
		},
		methods:{
			show:function(){
				let ret = _self.getUserInfo();
				if(!ret){
					return;
				}
				const data = {
				    guid: ret.guid,
				    token: ret.token
				};
				_self.getData(data);
			},
			getData(data){
				this.sendRequest({
				       url : this.ArticleListUrl,
				       method : _self.Method,
				       data : {
							"guid": data.guid,
							"token":data.token,
							"cat_id":1,
							"t":Math.random()
					   },
				       hideLoading : true,
				       success:function (res) {
						if(res){
							var data = res.articlelist; 
							if(parseInt(res.status)==3){
								let list = [];
								for (var i = 0; i < data.length; i++) {
									var item = data[i];
									list.push(item);
								}								
								_self.dataList = list;
							}					    	
						}
				       }
				   },"1","");
			}
		},
	}
</script>

<style>
	.newcontent{
		width: 92%;	
		margin: 20upx auto;
		font-size: 30upx;
		background-color: #fff;
		line-height: 50upx;
		padding: 20upx 30upx;
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
