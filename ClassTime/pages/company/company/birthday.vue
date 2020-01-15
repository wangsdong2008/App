<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<uni-section title="即将过生日的学生" type="line"></uni-section>
			<view class="studentlist">
				<!-- 包含图片 -->					
				<uni-list v-for="(item,index) in dataList">
					<uni-list-item class="list-title" :title="item.com_name" :show-arrow="false" :show-badge="true" ></uni-list-item>
					<uni-list-item :show-arrow="false" :show-badge="true">
						
						<uni-list v-for="(item3,index3) in item.studentslist"> 
							<uni-list-item class="slist" :title="item3.uname" :show-arrow="false" :show-badge="true" :scroll-y="true" :badge-text="item3.birthday" :thumb="item3.sex_img" @tap="bindStudents(item3.uid)">
							</uni-list-item>
						</uni-list>
						
					</uni-list-item>
				</uni-list>
			</view>
			<!-- <uni-list>
				
				<uni-list-item title="吃饭统计" thumb="@/static/img/ftj.png" @tap="bindtj(2)" :show-arrow="false" /></uli-list-item>
				
			</uni-list> -->
		</view>
	</view>
</template>

<script>
	import service from '@/service.js';
	import mInput from '@/components/m-input.vue'
	import headerNav from "@/components/header/company_header.vue"
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	import uniSection from '@/components/uni-section/uni-section.vue'
	
	import {
	    mapState,
	    mapMutations
	} from 'vuex'
	
	export default {
	    components: {
			headerNav,uniList,uniListItem,uniSection
		},
		data(){
			return{		
				headermsg:'生日提醒,Birthday',
				dataList:[]
			}
		},
		onLoad:function() {
			this.checkLogin();			
		},
		onReady:function(){
			this.show();
		},
		methods:{
			bindStudents(uid){
				this.navigateTo('studentsshow?id='+uid);
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
					url: this.GetBirthdaytStudentsUrl,
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
							if(res.data.status == '3'){
								let data = res.data.subcompanylist;
								//debugger;
								
								let list = [];
								let str = '';
								//debugger;
								for (var i = 0; i < data.length; i++) {				
									var item = data[i];
									list.push(item);									
								}								
								this.dataList = list;
								
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
		padding:0upx;
		width:94%;
		margin: 0 auto;
	}
	.uni-list-item.slist{
		border-bottom: 1upx dotted #007AFF;
		
	}
	.studentlist{
		overflow: auto;
		margin-bottom: 20upx;
	}
	.list-title{
		font-weight: bold;
		
	}
</style>
