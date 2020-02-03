<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="main_content content">			
			<uni-section :title="'搜索：'+course_name" type="line"></uni-section>
			<view class="searchlist">
				<view class="icenter">
					<!-- 带描述信息 -->
					<uni-list>
						
					    <uni-list-item v-for="(item,index) in dataList" :index="index" :key="item.cat_id" :title="item.cat_name" :note="'【'+item.com_name + '】 ' + item.com_address + ' 距离' + item.distance + '米'" :show-arrow="true" :show-badge="false" badge-text="12" :thumb="'../../../static/img/course.png'"></uni-list-item> 
						
					</uni-list>
					
				</view>
			</view>
		</view>		
	</view>
</template>
<script>
	import service from '../../../service.js';
	import mInput from '../../../components/m-input.vue';
	import headerNav from "@/components/header/company_header.vue"
	import uniSection from '@/components/uni-section/uni-section.vue'
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	
	export default {
	    components: {
			headerNav,			
			uniList,
			uniListItem,
			uniSection,
			mInput
		},
		onLoad(options) {
			this.course_name = options['keyword'];
			this.longitude = options['longitude'];
			this.latitude = options['latitude'];			
		},
		onReady(){
			this.show();
		},
		data(){
			return{
				headermsg:'查找结果,Search Result',
				course_name:'',
				latitude:0,
				longitude:0,
				dataList:[]
			}
		},
		methods:{
			show(){
				let ret = uni.getStorageSync(this.USERS_KEY);
				if(!ret){
					return false;
				}
				const data = {
				    guid: ret.guid,
				    token: ret.token,
					keyword:this.course_name,
					longitude:this.longitude,
					latitude:this.latitude
				};				
				this.getData(data);
			},
			getData(data){				
				uni.request({
					url: this.SearchCourseUrl,
					header: {"Content-Type": "application/x-www-form-urlencoded"},
				    data: {
				        "token": data.token,
				        "guid": data.guid,
						"keyword":data.keyword,
						"longitude":data.longitude,
						"latitude":data.latitude,
						"t":Math.random()
				    },
				    method: "get",
					success: (res) => {
						var data = res.data.courselist;
						switch(parseInt(res.data.status)){
							case 1:{
								uni.showToast({
									title: '无数据',
									icon: 'none',
								});		
								break;
							}
							case 3:{
								let list = [];
								for (var i = 0; i < data.length; i++) {
									var item = data[i];
									list.push(item);
								}								
								this.dataList = list;
								break;
							}
						}
						
					}
				});
			}
		}
	}
	
</script>
<style>	
	.uni-list-item{
		width:100%;
		padding:0upx;
	}
	.content{
		background-color: #fff;		
		padding-top: 10upx;
	}
	.main_center{
		width:95%;			
		margin: 0 auto;
	}
	.icenter{
		width: 90%;
		margin: 0 auto;
		margin-top: 40upx;
	}
	.imgs{	
		border:1upx solid #ccc;	
		padding-left: 20upx;
		width: 60%;		
		padding: 10upx;
		background:url(../../../static/img/search2.png) no-repeat 10upx 25upx;
		background-size: 60upx 60upx;
		float: left;
		border-radius: 15upx;
	}
	
	.m-input{
		height: 80upx;
		line-height: 80upx;
		margin-left: 60upx;
		float: left;
	}
	
	.btn{
		width:30%;
		margin-left: 20upx;
		float: left;
	}	
	
	
</style>