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
				    <uni-collapse-item v-for="(item,index) in dataList" :title="item.child_name" :open="item.open" :thumb="'../../../static/img/'+(item.sex==1?'p_boy':'p_gril')+'.png'" :show-arrow="true" :index="index" :key="item.child_id" class="colbg">
						<uni-collapse>
						    <uni-collapse-item :open="true" :option="true" v-for="(item2,index2) in item.weeklist" :title="item2.weekname" :show-arrow="true" class="colweek" :index="index2" :key="item2.weekid">
								<uni-list>
									<uni-list-item :show-arrow="false" v-for="(item3,index3) in item2.list" :title="item3.c_name + '（'+item3.p_time +'）' " :index="index3" :key="item3.cat_id">
										<view class="statuslist"><span @tap="showplan(item3.p_id)">修改</span><span @tap="delplan(item3.p_id)">删除</span></view>
									</uni-list-item>
								</uni-list>
							</uni-collapse-item>
						</uni-collapse>
				    </uni-collapse-item>
				</uni-collapse>
				
				
			</view>
			<view class="button-sp-area">
				<button type="primary" plain="true" @tap="planadd">添加上课安排</button>
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
				headermsg:'上课安排,Class Plan',
				footer: ''
			}
		},
		methods:{
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
			       url : this.ChildWeekUrl,
			       method : "post",
			       data : {
						"guid": data.guid,
						"token":data.token,
						"t":Math.random()
					},
			       hideLoading : true,
			       success:function (res) {
					if(res){
						var data = res.childlist; 
						if(parseInt(res.status) == 3){
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
			},
			planadd(){
				uni.navigateTo({
					url: './planshow',
				});
			},
			delplan(id){
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
				       url : this.DelChildPlanUrl,
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
								if(parseInt(res.status) == 3){
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
			showplan(id){
				this.navigateTo('./planshow?id='+id);
			}
		}
	}
	
</script>

<style>	
	.colweek{
		color:#3b4144;
	}
	.colweek uni-image{
		width:60upx;
		height: 60upx;
	}
	.colbg{
		color:#fff;
		background-color: #66ccff;
		margin-bottom: 40upx;
		border-radius: 25upx;		
		
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
		border: 0upx;
	}
	.uni-list-item .uni-view{
		padding: 10upx;
		border: 0upx;
	}
	.uni-list{
		padding-bottom: 0upx;
		padding: 10upx 0px;
		/* border: 1upx solid #f00; */
		margin-bottom: 0upx;		
	}
	.uni-list-item__container{
		padding: 10upx;
		border: 0upx;
	}
	.button-sp-area{
		margin-top: 40upx;
	}
</style>
