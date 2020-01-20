<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="title">
				<image src="../../../static/img/school.png" mode=""></image>学生所在学校
			</view>
			<view>
				<uni-list>
					<uni-list-item v-for="(item,index) in dataList" :show-arrow="false" :title="item.school_name" :note="item.school_address" :extra-icon="{color: '#4cd964',size: '45'}">
						<view class="statuslist"><span @tap="schooledit(item.school_id)">修改</span><span @tap="schooldel(item.school_id)">删除</span></view>
						</uni-list-item>
				</uni-list>	
			</view>
			<view class="button-sp-area">
				<button type="primary" plain="true" @tap="schooladd">添加新学校</button>
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
				headermsg:'学校管理,School Manage'
			}
		},
		methods:{
			schooladd(){
				this.navigateTo('schooledit');
			},
			schooledit(id){				
				this.navigateTo('schooledit?id='+id);
			},
			schooldel(id){
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
					url: this.DelSchoolInfoUrl,
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
									title: '删除学校成功',
									icon: 'none',
								});	
							}
							else{
								uni.showToast({
									title: '删除失败，请检查此学校是否还有学生',
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
					url: this.GetAllSchoolUrl,
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
					    	var data = res.data.schoollist; 
							if(parseInt(res.data.status) == 3){
								if(data.list.length > 0){
									let list = [];
									for (var i = 0; i < data.list.length; i++) {
										var item = data.list[i];
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
