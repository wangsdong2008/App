<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="title">
				<image src="../../../static/img/category.png" mode=""></image>孩子设置
			</view>
			<view>
				<uni-list>
					<uni-list-item v-for="(item,index) in dataList" :key="item.child_id" :title="'【'+item.child_name+'】'" :thumb="'../../../static/img/'+(item.sex==1?'p_boy':'p_gril')+'.png'" :show-arrow="false">
						<view class="statuslist"><span @tap="showchild(item.child_id)">修改</span><span @tap="delchild(item.child_id)">删除</span></view>
						</uni-list-item>
				</uni-list>
				
			</view>
			<view class="button-sp-area">
				<button type="primary" plain="true" @tap="childadd">添加孩子</button>
			</view>
		</view>
	    <view class="footer">
	    	<footerNav :msg="footer"></footerNav>
	    </view>
	</view>
</template>

<script>
	import service from '../../../service.js';
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import headerNav from "@/components/header/company_header.vue"
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'	
	import footerNav from "@/components/footer/footer_nav.vue"
	var _self;
	export default {
	    components: {
			uniList,
			uniListItem,
			headerNav,
			uniCollapse,
			uniCollapseItem,
			footerNav
		},
		onLoad(){
			_self = this;
			_self.checkLogin();
		},
		onReady(){
			_self.show();
		},
		data(){
			return{
				dataList:[],				
				headermsg:'孩子设置,Children Manage',
				footer: ''
			}
		},
		methods:{
			childadd(){
				uni.navigateTo({
					url: './childshow',
				});
			},
			delchild(id){
				//debugger;
				let ret = _self.getUserInfo();
				if(!ret){
					uni.showToast({
						title: '孩子不存在',
						icon: 'none',
					});	
					return false;
				}
				const data = {
				    guid: ret.guid,
				    token: ret.token
				};
				this.sendRequest({
				       url : this.DelChildrenUrl,
				       method : "post",
				       data : {
						"guid": data.guid,
						"token":data.token,
						"id":id,
						"t":Math.random()
						},
				       hideLoading : false,
				       success:function (res) {
							if(res){
								var data = res; 
								if(parseInt(res.status) == 0){
									uni.showToast({
										title: '删除失败',
										icon: 'none',
									});		
								}else{
									var data = res.list;
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
				       }
				   },"1","");
				
			},
			showchild(id){
					uni.navigateTo({
					    url: './childshow?id='+id,
					});
			},
			show(){
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
				       url : this.AllChildrenUrl,
				       method : "post",
				       data : {
						"guid": data.guid,
						"token":data.token,
						"t":Math.random()
					   },
				       hideLoading : true,
				       success:function (res) {
						if(res){
							var data = res.list; 
							if(parseInt(res.status)==0){
								uni.showToast({
									title: '无数据',
									icon: 'none',
								});		
							}else{	
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
		}
	}
	
</script>

<style>
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
	.uni-grid-item{
		line-height: 65upx;
		height: 65upx;	
		
	}
	.statuslist{
		position:absolute;
		right: 40upx;
		font-size: 30upx;
		margin-top: 10upx;
	}
	.statuslist span{
		margin-right: 10upx;
	}
	.uni-list-item{
		font-size: inherit;
	}
	.uni-list-item .uni-view{
		padding: 10upx;
		border: 0upx;
	}
	.uni-list{
		padding-bottom: 50upx;
	}
	.uni-list-item__container{
		padding: 10upx;
		border: 0upx;
	}
	.button-sp-area{
		margin-top: 40upx;
	}
</style>
