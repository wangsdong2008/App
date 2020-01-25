<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="title">
				<image src="../../../static/img/plan.png" mode=""></image>一周学习时间安排
			</view>
			<view>
				<!-- 一般用法 -->
				<uni-collapse accordion="true">					
				    <uni-collapse-item v-for="(item,index) in dataList" :title="item.child_name" :open="item.open" :thumb="'../../../static/img/'+(item.sex==1?'p_boy':'p_gril')+'.png'" :show-arrow="true" class="colbg">
						<uni-collapse>
						    <uni-collapse-item :open="true" :option="true" v-for="(item2,index2) in item.weeklist" :title="item2.weekname":show-arrow="true"  :thumb="'../../../static/img/week.png'" >
								<uni-list>
									<uni-list-item :show-arrow="false" v-for="(item3,index3) in item2.list" :title="item3.c_name + '（'+item3.p_time +'）' " :thumb="'../../../static/img/course.png'" >
										<view class="statuslist"><span @tap="showplan(item3.p_id)">修改</span><span @tap="delplan(item3.p_id)">删除</span></view>
									</uni-list-item>
								</uni-list>
							</uni-collapse-item>
						</uni-collapse>
				    </uni-collapse-item>
				</uni-collapse>
				
				
			</view>
			<view class="button-sp-area">
				<button type="primary" plain="true" @tap="planadd">添加计划</button>
			</view>
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
	export default {
	    components: {
			uniList,
			uniListItem,
			headerNav,
			uniCollapse,uniCollapseItem
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
				headermsg:'上课安排,Class Plan'
			}
		},
		methods:{
			show(){
				let ret = uni.getStorageSync(this.USERS_KEY);
				if(ret){
					this.hasLogin = true;
				}
				const data = {
				    guid: ret.guid,
				    token: ret.token
				};
				this.getData(data);
			},
			getData(data){
				uni.request({
					url: this.ChildWeekUrl,
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
						//debugger;
					    if(res.data){
					    	var data = res.data.childlist; 
							if(parseInt(res.data.status) == 3){
								let list = [];
								for (var i = 0; i < data.length; i++) {
									var item = data[i];
									list.push(item);
								}								
								this.dataList = list;	
							}else{	
								uni.showToast({
									title: '无数据',
									icon: 'none',
								});	
							}
					    }
					}
				})
			},
			planadd(){
				uni.navigateTo({
					url: './planshow',
				});
			},
			delplan(id){
				//debugger;
				let ret = uni.getStorageSync(this.USERS_KEY);
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
				uni.request({
					url: this.DelChildPlanUrl,
					header: {
				        "Content-Type": "application/x-www-form-urlencoded"							 
				    },
				    data: {
						"guid": data.guid,
						"token":data.token,
						"id":id,
						"t":Math.random()
				    },
				    method: "get",
					success: (res) => {
					    if(res.data){							
					    	var data = res.data; 
							if(parseInt(res.data.status) == 0){
								uni.showToast({
									title: '删除失败',
									icon: 'none',
								});		
							}else{
								var data = res.data.list;
								if(parseInt(res.data.status)==0){
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
									this.dataList = list;
								}
							}
					    }
					}
				})
			},
			showplan(id){
					uni.navigateTo({
					    url: './planshow?id='+id,
					});
			}
		}
	}
	
</script>

<style>
	 .uni-collapse > .colbg{
		color:#fff;
		background-color: #66ccff;
		margin-bottom: 40upx;
	}
	.uni-collapse .uni-collapse > .uni-collapse-item{
		color:#f00;
	}
	.uni-collapse .uni-collapse{
		width: 100%;
		margin: 0 auto;
	}
	.uni-collapse .uni-collapse .uni-view{
		padding-left: 20upx;
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
		padding-bottom: 0upx;
	}
	.uni-list-item__container{
		padding: 10upx;
		border: 0upx;
	}
	.button-sp-area{
		margin-top: 40upx;
	}
</style>
