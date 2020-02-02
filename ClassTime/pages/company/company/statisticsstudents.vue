<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			
			<view class="icenter bg">
				<view>姓名：</view>
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
	var _self = this;
	import {
	    mapState,
	    mapMutations
	} from 'vuex'
	
	Date.prototype.addMonth = function (addMonth) {
	 var y = this.getFullYear();
	 var m = this.getMonth();
	 var nextY = y;
	 var nextM = m;
	 //如果当前月+要加上的月>11 这里之所以用11是因为 js的月份从0开始
	 if ((m + addMonth)> 11) {
	  nextY = y + 1;
	  nextM = parseInt(m + addMonth) - 12;
	 } else {
	  nextM = this.getMonth() + addMonth
	 }	
	 return new Date(nextY, nextM);
	 }; 
	 
	 
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
			_self = this;
			_self.checkLogin();
			var pid = options['id'];
			 if(pid == '') pid = 1;
			_self.id =  pid;
			switch(parseInt(pid)){
				case 1:{
					_self.headermsg = '上课统计,Statistics';
					break;
				}
				case 2:{
					_self.headermsg = '吃饭统计,Statistics';
					break;
				}
				case 3:{
					_self.headermsg = '员工统计,Statistics';
					break;
				}
			}
		},
		onReady(){
			_self.show();
		},
		methods:{
			show(){
				let ret = _self.getUserInfo();
				const data = {
				    guid: ret.guid,
				    token: ret.token
				};
				_self.getData(data);
			},
			bindclick(){
				var uid = _self.cid;
				var d = _self.dateid;
				_self.navigateTo('statisticsresult?uid='+uid+"&d="+d+"&cid="+_self.c_id+"&id="+_self.id);
			},
			getData(data){
				let data1 = data;
				this.sendRequest({
					url : this.GetAllStudents,
				    method : "post",
				    data : {
						"guid": data.guid,
						"token":data.token,
						"t":Math.random()
					},
				    hideLoading : true,
				    success: (res) => {
						if(res){
							var data = res.studentslist; 
							if(parseInt(res.status) == 0){
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
									list.push(item.uname);
									idlist.push(item.uid);
									if(i == 0){
										uid = item.uid;
									}
								}								
								_self.dataList = list;
								_self.dataIDList = idlist;
								if(_self.id == 1){
									if(uid > 0){
										data1['uid'] = uid;
										_self.getStudentsCategory(data1);
									}
								}							
								
								_self.dateList = _self.GetStudyMonth();
								_self.cid = _self.dataIDList[0];
								_self.dateid = _self.dateList[0];
							}					    	
						}	    
				    }
				    
				},"1","");
				
				
			},
			getStudentsCategory:function(data){	
				var id = _self.id;
				this.sendRequest({
					url : this.GetStudentsCategory,
				    method : "post",
				    data : {
						"guid": data.guid,
						"token":data.token,
						"id":_self.id,
						"uid":data.uid,
						"t":Math.random()
					},
				    hideLoading : true,
				    success: (res) => {
				    	    if(res){
				    			var data = res.categorylist;
				    			if(parseInt(res.status) == 3){
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
				    				_self.c_id = catid;
				    				_self.cList = list;
				    				_self.cIDList = idlist;
				    			}else{
				    				uni.showToast({
				    					title: '无数据2',
				    					icon: 'none',
				    				});	
				    			}
				    		}
				    	},
				    
				},"1","");
				
				
			},
			pickerChange: function(e) {
			    console.log('picker发送选择改变，携带值为', e.target.value+"===="+_self.dataList[e.target.value] + _self.dataIDList[e.target.value]);
				_self.cid = _self.dataIDList[e.target.value];
				_self.index = e.target.value;
				//_self.navigateTo('statisticsresult?id='+_self.cid);
				let ret = _self.getUserInfo();
				const data = {
				    guid: ret.guid,
				    token: ret.token,
					uid:_self.dataIDList[e.target.value]
				};
				if(_self.id == 1){
					_self.getStudentsCategory(data);
				}
				
			},
			pickerDateChange:function(e){
				//console.log('picker发送选择改变，携带值为', e.target.value+"===="+_self.dateList[e.target.value]);
				_self.dateid = _self.dateList[e.target.value];
				_self.dindex = e.target.value; 
			},
			pickerCourseChange:function(e){
				console.log('picker发送选择改变，携带值为', e.target.value+"===="+_self.cList[e.target.value] + _self.cIDList[e.target.value]);
				_self.c_id = _self.cIDList[e.target.value];
				_self.cindex = e.target.value; 
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
