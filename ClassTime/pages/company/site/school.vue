<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="title">
				<image src="../../../static/img/school.png" mode=""></image>学生所在学校
			</view>
			<view>
				<uni-list>
					<uni-list-item v-for="(item,index) in dataList" :show-arrow="false" :title="item.school_name" :note="item.school_address" :extra-icon="{color: '#4cd964',size: '45'}" :index="index" :key="item.school_id">
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
	var _self;
	export default {
	    components: {
			uniList,
			uniListItem,
			headerNav,
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
				headermsg:'学校管理,School Manage'
			}
		},
		methods:{
			schooladd(){
				_self.navigateTo('schooledit');
			},
			schooledit(id){				
				_self.navigateTo('schooledit?id='+id);
			},
			schooldel(id){
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
				this.sendRequest({
				    url : this.DelSchoolInfoUrl,
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
				},"1","");
			},
			show(){
				let ret = uni.getStorageSync(_self.USERS_KEY);
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
				        url : this.GetAllSchoolUrl,
				        method : _self.Method,
				        data : {
							"guid": data.guid,
							"token":data.token,
							"t":Math.random()
						},
				        hideLoading : true,
				        success: (res) => {
				      	    if(res){
				      	    	var data = res.schoollist; 
				      			if(parseInt(res.status) == 3){
				      				if(data.list.length > 0){
				      					let list = [];
				      					for (var i = 0; i < data.list.length; i++) {
				      						var item = data.list[i];
				      						list.push(item);
				      					}								
				      					_self.dataList = list;
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
		right: 30upx;
		font-size: 30upx;
		margin-top: 10upx;
	}
	.statuslist span{
		margin-right: 10upx;
	}
	
</style>
