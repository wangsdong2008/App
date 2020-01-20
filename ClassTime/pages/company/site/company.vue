<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="title">
				<image src="../../../static/img/company.png" mode=""></image>公司设置
			</view>
			<view>
				<uni-list>
					<uni-list-item v-for="(item,index) in dataList" :show-arrow="false" :title="item.com_name" :note="item.com_address" :extra-icon="{color: '#4cd964',size: '45'}">
						<view class="statuslist"><span @tap="companyedit(item.com_id)">修改</span><span @tap="companydel(item.com_id)">删除</span></view>
						</uni-list-item>
				</uni-list>	
			</view>
			<view class="button-sp-area">
				<button type="primary" plain="true" @tap="companyadd">添加公司</button>
			</view>
		</view>
	</view>
</template>

<script>
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import headerNav from "@/components/header/company_header.vue"
	export default {
	    components: {
			uniList,
			uniListItem,
			headerNav,
		},
		onLoad(){
			this.checkLogin();
		},
		onReady(){
			this.show();
		},
		data(){
			return{
				dataList:[],				
				headermsg:'公司管理,Company Manage'
			}
		},
		methods:{
			companyadd(){
				this.navigateTo('companyedit');
			},
			companyedit(id){				
				this.navigateTo('companyedit?id='+id);
			},
			companydel(id){
				let ret = uni.getStorageSync(this.USERS_KEY);
				if(!ret){
					return false;
				}
				const data = {
				    guid: ret.guid,
				    token: ret.token,
					id:id
				};
				this.delData(data);
			},
			delData(data){
				uni.request({
					url: this.DelCompanyInfoUrl,
					header: {
				        "Content-Type": "application/x-www-form-urlencoded"							 
				    },
				    data: {
						"guid": data.guid,
						"token":data.token,
						"id":data.id,
						"t":Math.random()
				    },
				    method: "get",
					success: (res) => {
					    if(res.data){					    	
							if(parseInt(res.data.status) == 3){
								this.show();
								uni.showToast({
									title: '删除公司成功',
									icon: 'none',
								});	
							}
							else{
								uni.showToast({
									title: '删除失败，请检查此公司是否删除干净',
									icon: 'none',
								});	
							}
					    }
					},
				});					
			},
			show(){
				let ret = uni.getStorageSync(this.USERS_KEY);
				if(!ret){
					return false;
				}
				const data = {
				    guid: ret.guid,
				    token: ret.token
				};
				this.getData(data);
			},
			getData(data){
				uni.request({
					url: this.GetAllSubCompanyUrl,
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
					    	var data = res.data.subcompanylist; 
							if(parseInt(res.data.status) == 3){
								if(data.length > 0){
									let list = [];
									for (var i = 0; i < data.length; i++) {
										var item = data[i];
										list.push(item);
									}								
									this.dataList = list;
								}
							}
							else{
								uni.showToast({
									title: '无数据为空',
									icon: 'none',
								});		
								
							}
					    }
					}
				})
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
		right: 30upx;
		font-size: 30upx;
		margin-top: 10upx;
	}
	.statuslist span{
		margin-right: 10upx;
	}
	
</style>
