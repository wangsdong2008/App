<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			
			<view class="icenter bg">
				<view>公司：</view>
				<view class="searchinput input-txt">
					<picker @change="pickerChange($event)" :value="index" :range="dataList">
						<view class="uni-input">{{dataList[index]}}</view>
					</picker>
				</view>
				<view v-if="id == 1">课程：</view>
				<view class="searchinput input-txt" v-if="id == 1">
					<picker @change="pickerCourseChange($event)" :value="cindex" :range="cList">
						<view class="uni-input">{{cList[cindex]}}</view>
					</picker>
				</view>
				<view>月份：</view>
				<view class="input-txt">
					<picker @change="pickerDateChange($event)" :value="dindex" :range="dateList">
						<view class="uni-input">{{dateList[dindex]}}</view>
					</picker>
				</view>
				<view class="btn"><button type="primary" @tap="bindclick">搜索</button></view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import service from '@/service.js';
	import mInput from '@/components/m-input.vue'
	import headerNav from "@/components/header/company_header.vue"
	import {
	    mapState,
	    mapMutations
	} from 'vuex'
	
 
	export default {
	    components: {
			headerNav
		},
		data(){
			return{
				index:0,
				dindex:0,
				cindex:0,				
				dataList:[],
				dataIDList:[], //这里是每个值对应的id
				dateList:[], //日期
				cList:[], //分类
				cIDList:[], //分类id
				dateIDList:[], 
				headermsg:'',
				id:0,
				cid:0,
				dateid:'',
				c_id:0
			}
		},
		onLoad(options){
			this.checkLogin();
			var pid = options['id'];
			 if(pid == '') pid = 1;
			this.id =  pid;
			switch(parseInt(pid)){
				case 1:{
					this.headermsg = '上课统计,Statistics';
					break;
				}
				case 2:{
					this.headermsg = '吃饭统计,Statistics';
					break;
				}
				case 3:{
					this.headermsg = '员工统计,Statistics';
					break;
				}
			}
		},
		onReady(){
			this.dateList = this.GetStudyMonth();
			this.show();
		},
		methods:{
			show(){
				let ret = this.getUserInfo();
				const data = {
				    guid: ret.guid,
				    token: ret.token
				};
				this.getData(data);
				var date = new Date();
				var str = date.getMonth() + 1;
				str = "00" + str;
				this.dateid = date.getFullYear() + "-" + str.substr(str.length-2,str.length);
			},
			bindclick(){
				//debugger;
				var com_id = this.cid;
				var d = this.dateid;
				var c_id = this.c_id;
				this.navigateTo('statisticcompanysresult?com_id='+com_id+'&d='+d+'&cid='+this.c_id+'&id='+this.id);
			},
			getData(data){
				let data1 = data;
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
							if(parseInt(res.data.status) == 0){
								uni.showToast({
									title: '无数据1',
									icon: 'none',
								});		
							}else{
								let uid = 0;
								let list = [];
								let idlist = [];
								for (var i = 0; i < data.length; i++) {
									var item = data[i];									
									list.push(item.com_name);
									idlist.push(item.com_id);
									if(i == 0){
										uid = item.com_id;
									}
								}
								this.dataList = list;
								this.dataIDList = idlist;
								if(this.id == 1){
									if(uid > 0){
										data1['uid'] = uid;										
										this.getCompanyCategory(data1);
									}
								}
								
								/* list = [];
								var dlist = res.data.datelist;
								for(var i = dlist.length-1; i > 0; i--){
									var item = dlist[i];
									list.push(item.d);
								}
								this.dateList = list; */
								this.cid = this.dataIDList[0];
							}					    	
					    }
					}
				})
			},
			getCompanyCategory:function(data){	
				var id = this.id;
				uni.request({
					url: this.GetCompanyCategory,
					header: {
				        "Content-Type": "application/x-www-form-urlencoded"							 
				    },
				    data: {
						"guid": data.guid,
						"token":data.token,
						"id":this.id,
						"cid":data.uid,
						"t":Math.random()
				    },
				    method: "get",
					success: (res) => {
					    if(res.data){
							var data = res.data.categorylist;
							if(parseInt(res.data.status) == 3){
								let list = [];
								let idlist = [];
								let catid = 0;
								for (var i = 0; i < data.length; i++) {
									var item = data[i];									
									list.push(item.cat_name);
									idlist.push(item.cat_id);
									if(i == 0){
										catid = item.cat_id;
									}
								}
								this.c_id = catid;
								this.cList = list;
								this.cIDList = idlist;
							}else{
								uni.showToast({
									title: '无数据2',
									icon: 'none',
								});	
							}
						}
					},
				});
			},
			pickerChange: function(e) {
			    console.log('picker-company发送选择改变，携带值为', e.target.value+"===="+this.dataList[e.target.value] + this.dataIDList[e.target.value]);
				this.cid = this.dataIDList[e.target.value];
				this.index = e.target.value;
				//this.navigateTo('statisticsresult?id='+this.cid);
				let ret = this.getUserInfo();
				const data = {
				    guid: ret.guid,
				    token: ret.token,
					uid:this.dataIDList[e.target.value]
				};
				if(this.id == 1){
					this.getCompanyCategory(data);
				}
				
			},
			pickerDateChange:function(e){
				console.log('picker-date发送选择改变，携带值为', e.target.value+"===="+this.dateList[e.target.value]);
				this.dateid = this.dateList[e.target.value];
				this.dindex = e.target.value; 
			},
			pickerCourseChange:function(e){
				console.log('picker-course发送选择改变，携带值为', e.target.value+"===="+this.cList[e.target.value] + this.cIDList[e.target.value]);
				this.c_id = this.cIDList[e.target.value];
				this.cindex = e.target.value; 
			}
			
		}
	}
	
</script>

<style>	
	.content{
		background-color: #fff;
		
		padding-top: 150upx;
	}
	.icenter > view{
		float: left;
		margin-bottom: 30upx;
	}
	.icenter .input-txt{		
		width: 65%;
		border:1upx solid #eeeeee;
		line-height: 55upx;
		height: 55upx;
		padding-left: 60upx;
		border-radius: 25upx;
	}
	.icenter > view.searchinput{
		background: url(../../../static/img/search.png) no-repeat 5upx 10upx;
		-webkit-background-size: 55upx 55upx;
		background-size: 55upx 55upx;
	}
	.btn{
		width: 100%;
	}
	
</style>
