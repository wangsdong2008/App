<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="title">
				<image src="../../../static/img/help.png" mode=""></image>帮助文档
			</view>
			
			<uni-list>
			    <uni-list-item class="ulist" :show-arrow="false" v-for="(item,index) in dataList" :title="item.article_title"  @tap="bindclick(item.article_id)"  :index="index" :key="item.help_id" :thumb="'../../../static/img/step.png'"></uni-list-item>
			</uni-list>
			
			<view>
				<uni-pagination class="pagination" @change="handlePage" :show-icon="true" :total="total" :current="page" :pageSize="pagesize" />
			</view>
			
			
		</view>
		<view class="footer">
			<footerNav :msg="footer"></footerNav>
		</view>
	</view>
</template>

<script>
	import headerNav from "@/components/header/company_header.vue"
	import footerNav from "@/components/footer/footer_nav.vue"
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	import uniPagination from '@/components/uni-pagination/uni-pagination.vue'
	
	var _self;
	export default {
		components: {
			uniList,
			uniListItem,
			uniPagination,
			headerNav,
			footerNav
		},
		data(){
			return{
				page:1,
				current: 1,
				total: 0,
				pagesize: 5,
				dataList:[
					
				],
				headermsg:'帮助,Help',
				footer: 'help'
			}
		},
		onLoad:function() {
			_self = this;
			_self.checkLogin(1);
		},
		onReady:function(){
			_self.show();
		},
		methods:{
			handlePage(params){
				//debugger;
				_self.page = params.current;
				_self.show();
			},
			bindclick:function(id){
				//debugger;
				_self.navigateTo('helpshow?id='+id+"&page="+_self.page);
				
			},		
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
				_self.sendRequest({
				       url : _self.ArticleListUrl,
				       method : _self.Method,
				       data : {
							"guid": data.guid,
							"token":data.token,
							"page":_self.page,
							"pagesize":_self.pagesize,
							"cat_id":1,
							"t":Math.random()
					   },
				       hideLoading : true,
				       success:function (res) {
						if(res){
							var data = res.articlelist; 
							if(parseInt(res.status)==3){
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
			}
		},
	}
</script>

<style>
	.uni-pagination{
		width:100%;
	}
	.ulist{
		padding-left: 0upx;
	}
	.newcontent{
		width: 92%;	
		margin: 20upx auto;
		font-size: 30upx;
		background-color: #fff;
		line-height: 50upx;
		padding: 20upx 30upx;
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
