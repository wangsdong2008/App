<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="title">
				<image src="../../../static/img/category.png" mode=""></image>课程设置
			</view>
			<view>
				<!-- 一般用法 -->
				<uni-collapse>					
				    <uni-collapse-item v-for="(item,index) in dataList" :title="'【'+item.c_name+'】'" thumb="../../../static/img/course.png" :open="false" >
						<uni-list>
							<uni-list-item :show-arrow="false" :title="item.organname" thumb="../../../static/img/mechanismHL.png"></uni-list-item>
							<uni-list-item :show-arrow="false" :title="'地址：'+item.c_address" thumb="../../../static/img/addressHL.png">	</uni-list-item>
							<uni-list-item :show-arrow="false"><view class="statuslist"><span @tap="showorgan(item.c_id)">修改</span><span @tap="delorgan(item.c_id)">删除</span></view></uni-list-item>
						</uni-list>	
				    </uni-collapse-item>
				   
				</uni-collapse>
			</view>
			<view class="button-sp-area">
				<button type="primary" plain="true" @tap="showorganadd">添加课程</button>
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
			this.checkLogin();
		},
		onReady(){
			this.show();
		},
		data(){
			return{
				dataList:[],				
				headermsg:'课程设置,Course Manage',
				footer: ''
			}
		},
		methods:{
			showorganadd(){
				this.navigateTo('courseedit');
			},
			showorgan(id){				
				this.navigateTo('courseedit?id='+id);
			},
			DelData(data){
				let that = this;
				var data2 = {
					"guid": data.guid,
					"token":data.token,
					"id":data.id,
					"t":Math.random()
				};
				uni.request({
					url: this.DelOrganUrl,
					header: {
				        "Content-Type": "application/x-www-form-urlencoded"							 
				    },
				    data: data2,
				    method: "get",
					success: (res) => {
					    if(res.data){
							//debugger;
							if(parseInt(res.data.status) == 3){								
								uni.showToast({
									title: '删除成功',
									icon: 'none',
								});
								/* setTimeout(function(){
									that.navigateTo('./course');
								},2000); */
								var data = res.data.list;
								if(parseInt(res.data.status) == 3){
									let list = [];
									for (var i = 0; i < data.length; i++) {
										var item = data[i];
										list.push(item);
									}								
									this.dataList = list;
								}		
								
							}else{
								uni.showToast({
									title: '删除失败',
									icon: 'none',
								});
							}					    	
					    }
					}
				})
			},			
			delorgan(id){
				let ret = uni.getStorageSync(this.USERS_KEY);
				if(!ret){
					return false;
				}
				const data = {
				    guid: ret.guid,
				    token: ret.token,
					id:id
				};
				this.DelData(data);
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
					url: this.AllOrganUrl,
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
					    	var data = res.data.list; 
							if(parseInt(res.data.status) == 3){
								let list = [];
								for (var i = 0; i < data.length; i++) {
									var item = data[i];
									list.push(item);
								}								
								this.dataList = list;
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
