<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="title">
				<image src="../../../static/img/students.png" mode=""></image>全部学生
			</view>
			<view>
				<uni-list>
					<uni-list-item v-for="(item,index) in dataList" :show-arrow="false" :title="item.uname" :index="index" :key="item.uid" :thumb="'../../../static/img/'+(item.sex==1?'boy':'gril')+'.png'" >
						<view class="statuslist"><span @tap="studentsedit(item.uid)">修改</span><span @tap="studentsdel(item.uid)">删除</span></view>
						</uni-list-item>
				</uni-list>	
			</view>			
			<view class="example-body">
				<uni-pagination @change="handlePage" :show-icon="true" :total="total" :current="page" :pageSize="pagesize" title="标题文字" />
			</view>		    
		</view>
		<view class="button-sp-area">
			<view>
				<button type="primary" @tap="studentsadd">添加学生</button>
			</view>
		</view>
	</view>
</template>

<script>
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import headerNav from "@/components/header/company_header.vue"
	import uniPagination from '@/components/uni-pagination/uni-pagination.vue'
	var _self;
	export default {
	    components: {
			uniList,
			uniListItem,
			headerNav,
			uniPagination
		},
		data(){
			return{
				dataList:[],				
				headermsg:'学生管理,Students Manage',
				page:1,
				current: 1,
				total: 0,
				pagesize: 10
			}
		},
		onLoad(options){
			_self = this;
			_self.page = options['page'];
			if(_self.page == undefined){
				_self.page = 1;
			}
			_self.checkLogin();
		},
		onReady(){
			_self.show();
		},
		
		methods:{
			handlePage(params){
				//debugger;
				_self.page = params.current;
				_self.show();
			},
			studentsadd(){
				_self.navigateTo('studentsedit');
			},
			studentsedit(id){				
				_self.navigateTo('studentsedit?id='+id);
			},
			studentsdel(id){
				let ret = _self.getUserInfo();
				if(!ret){
					return false;
				}
				const data = {
				    guid: ret.guid,
				    token: ret.token,
					id:id,
					page:_self.page,
					pagesize:_self.pagesize
				};
				_self.delData(data);
			},
			delData(data){
				this.sendRequest({
				        url : this.DelStudentsInfoUrl,
				        method : _self.Method,
				        data : {
							"guid": data.guid,
							"token":data.token,
							"id":data.id,
							"page":data.page,
							"pagesize":data.pagesize,
							"t":Math.random()
						},
				        hideLoading : false,
				        success: (res) => {
				        	    if(res){					    	
				        			if(parseInt(res.status) == 3){
				        				_self.show();
				        				uni.showToast({
				        					title: '删除学生成功',
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
				    token: ret.token,
					"page":_self.page,
					"pagesize":_self.pagesize,
				};
				_self.getData(data);
			},
			getData(data){
				this.sendRequest({
				        url : this.GetAllStudentsUrl,
				        method : _self.Method,
				        data : {
							"guid": data.guid,
							"token":data.token,
							"page":data.page,
							"pagesize":data.pagesize,
							"t":Math.random()
						},
				        hideLoading : true,
				        success: (res) => {
				        	    if(res){
				        	    	var data = res.studentslist.list; 
				        			if(parseInt(res.status) == 3){
				        				if(data.length > 0){
				        					let list = [];
				        					for (var i = 0; i < data.length; i++) {
				        						var item = data[i];
				        						list.push(item);
				        					}								
				        					_self.dataList = list;
											_self.total = res.studentslist.count;
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
	.button-sp-area{
		position: fixed;
		bottom: 0upx;
		height: 100upx;
		background-color: #fff;
		width: 100%;
	}
	.button-sp-area view{
	}
	.example-body {
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 0;
		font-size: 14rpx;
		background-color: #ffffff;
		margin-bottom: 120upx;
	}	
	
	.disable{
		color:#f00;
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
