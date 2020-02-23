<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="title">
				<image src="../../../static/img/userHL.png" mode=""></image>所有员工
			</view>
			<view>
				<!-- 一般用法 -->
				<uni-collapse>					
				    <uni-collapse-item v-for="(item,index) in dataList" :title="item.com_name" :open="true" thumb="../../../static/img/company.png" :index="index" :key="item.com_id" >
						<uni-list>
							<uni-list-item v-for="(item2,index2) in item.memberlist.list" :show-arrow="false" :title="item2.true_name+'('+item2.username+')'" :index="index2" :key="item2.id" >
								<view class="statuslist"><span @tap="memberedit(item2.id)">修改</span><span @tap="memberdel(item2.id)">删除</span></view>
								</uni-list-item>
						</uni-list>	
						
				    </uni-collapse-item>
				   
				</uni-collapse>
			</view>
			<view class="button-sp-area">
				<button type="primary" plain="true" @tap="memberadd">添加员工</button>
			</view>
		</view>
	</view>
</template>

<script>
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import headerNav from "@/components/header/company_header.vue"
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'	
	var _self;
	export default {
	    components: {
			uniList,
			uniListItem,
			headerNav,
			uniCollapse,uniCollapseItem
		},
		onLoad(){	
			_self = this;
			_self.checkLogin(2);
		},
		onReady(){
			_self.show();
		},
		data(){
			return{
				dataList:[],				
				headermsg:'员工管理,Member Manage'
			}
		},
		methods:{
			memberadd(){
				_self.navigateTo('memberedit');
			},
			memberedit(id){				
				_self.navigateTo('memberedit?id='+id);
			},
			memberdel(id){
				let ret = uni.getStorageSync(_self.USERS_KEY);
				if(!ret){
					return false;
				}
				const data = {
				    guid: ret.guid,
				    token: ret.token,
					id:id
				};
				_self.delData(data);
			},
			delData(data){
				_self.sendRequest({
				        url : _self.DelMemberinfoUrl,
				        method : _self.Method,
				        data : {
							"guid": data.guid,
							"token":data.token,
							"id":data.id,
							"t":Math.random()
						},
				        hideLoading : false,
				        success: (res) => {
				        	    if(res){					    	
				        			if(parseInt(res.status) == 3){
				        				_self.show();
				        				uni.showToast({
				        					title: '删除员工成功',
				        					icon: 'none',
				        				});	
				        			}
				        			else{
				        				uni.showToast({
				        					title: '删除失败',
				        					icon: 'none',
				        				});	
				        			}
				        	    }
				        	},
				        
				    },"1","");							
			},
			show(){
				let ret = _self.getUserInfo();
				if(!ret){
					return false;
				}
				const data = {
				    guid: ret.guid,
				    token: ret.token
				};
				_self.getData(data);
			},
			getData(data){
				this.sendRequest({
				        url : this.GetAllMemberUrl,
				        method : _self.Method,
				        data : {
							"guid": data.guid,
							"token":data.token,
							"t":Math.random()
						},
				        hideLoading : true,
				        success: (res) => {
				       	    if(res){
				       	    	var data = res.subcompanylist; 
				       			if(parseInt(res.status) == 3){
				       				if(data.length > 0){
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
			}
		}
	}
	
</script>

<style>
	.button-sp-area{
		margin: 40upx 0upx;
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
		right: 30upx;
		font-size: 30upx;
		margin-top: 10upx;
	}
	.statuslist span{
		margin-right: 10upx;
	}
	
</style>
