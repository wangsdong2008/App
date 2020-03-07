<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<uni-section title="上课统计" class="section" type="line"></uni-section>
			<view class="icenter bg">
				<view class="lefttxt">姓名：</view>
				<view class="searchinput input-txt">
					<picker @change="pickerChange($event)" :value="index" :range="dataList">
						<view class="uni-input">{{dataList[index]}}</view>
					</picker>
				</view>
				<view class="lefttxt">课程：</view>
				<view class="searchinput input-txt">
					<picker @change="pickerCourseChange($event)" :value="cindex" :range="cList">
						<view class="uni-input">{{cList[cindex]}}</view>
					</picker>
				</view>
				<view class="lefttxt">月份：</view>
				<view class="input-txt">
					<picker @change="pickerDateChange($event)" :value="dindex" :range="dateList">
						<view class="uni-input">{{dateList[dindex]}}</view>
					</picker>
				</view>
				<view class="btn"><button type="primary" class="btn1" @tap="bindclick">搜索</button></view>
			</view>
			<view class="footer">
				<footerNav :msg="footer"></footerNav>
			</view>
		</view>
	</view>
</template>

<script>
	import service from '@/service.js';
	import mInput from '@/components/m-input.vue'
	import uniSection from '@/components/uni-section/uni-section.vue'
	import headerNav from "@/components/header/company_header.vue"	
	import footerNav from "@/components/footer/footer_nav.vue"
	
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
			headerNav,footerNav,uniSection
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
				child_id:0,//孩子
				cid:0,   //课程
				dateid:0 //年份
			}
		},
		onLoad(options){
			_self = this;
			_self.checkLogin(1);
			_self.headermsg = '上课统计,Statistics';
				
		},
		onReady(){
			_self.show();
		},
		methods:{
			bindclick(){
				if(_self.child_id == 0 || _self.child_id == undefined){
					uni.showToast({
					    icon: 'none',
					    title: '请选择孩子'
					});
					return;
				}
				if(_self.cid == 0){
					uni.showToast({
					    icon: 'none',
					    title: '请选择课程'
					});
					return;
				}
				if(_self.dateid == 0){
					uni.showToast({
					    icon: 'none',
					    title: '请选择年份'
					});
					return;
				}				
				_self.navigateTo('tongjiresult?child_id='+_self.child_id+"&dateid="+_self.dateid+"&cid="+_self.cid);
			},
			show(){
				let ret = _self.getUserInfo();
				const data = {
				    guid: ret.guid,
				    token: ret.token
				};
				_self.getData(data);
			},
			getData(data){
				let data1 = data;
				_self.sendRequest({
					url : _self.AllChildrenUrl,
				    method : _self.Method,
				    data : {
						"guid": data.guid,
						"token":data.token,
						"t":Math.random()
					},
				    hideLoading : true,
				    success: (res) => {
						if(res){
							var data = res.list; 
							if(parseInt(res.status) == 3){
								let uid = 0;
								let list = [];
								let idlist = [];
								list.push("==请选择孩子==");
								idlist.push(0);								
								for (var i = 0; i < data.length; i++) {
									var item = data[i];									
									list.push(item.child_name);
									idlist.push(item.child_id);
								}
								_self.dataList = list;
								_self.dataIDList = idlist;
								
								list = [];
								idlist = [];
								data = res.courselist;
								list.push("==请选择课程==");
								idlist.push(0);	
								for (var i = 0; i < data.length; i++) {
									var item = data[i];									
									list.push(item.c_name);
									idlist.push(item.c_id);
								}
								_self.cList = list;
								_self.cIDList = idlist;
								
								_self.dateList = _self.GetStudyYear();
								_self.dateid = _self.dateList[0];
								
							}					    	
						}	    
				    }
				    
				},"1","");
			},
			
			pickerChange: function(e) {
			    console.log('child picker发送选择改变，携带值为', e.target.value+"===="+_self.dataList[e.target.value] + _self.dataIDList[e.target.value]);
				_self.child_id = _self.dataIDList[e.target.value];
				_self.index = e.target.value;
				
				
			},
			pickerDateChange:function(e){
				console.log('date picker发送选择改变，携带值为', e.target.value+"===="+_self.dateList[e.target.value]);
				_self.dateid = _self.dateList[e.target.value];
				_self.dindex = e.target.value; 
			},
			pickerCourseChange:function(e){
				console.log('course picker发送选择改变，携带值为', e.target.value+"===="+_self.cList[e.target.value] + _self.cIDList[e.target.value]);
				_self.cid = _self.cIDList[e.target.value];
				_self.cindex = e.target.value; 
			}
			
		}
	}
	
</script>

<style>	
	.content{
		background-color: #fff;	
	}
	.section{
		margin-bottom: 50upx;
	}
	.icenter{
		width: 90%;
	}
	.icenter > view{
		float: left;
		margin-bottom: 30upx;
	}
	.icenter .input-txt{		
		width: 70%;
		border:1upx solid #eeeeee;
		line-height: 85upx;
		height: 85upx;
		padding-left: 70upx;
		border-radius: 50upx;
	}
	.lefttxt{
		padding-top: 20upx;
	}
	.icenter > view.searchinput{
		
	}
	.btn{
		width: 100%;		
	}
	.btn1{
		border-radius: 50upx;
	}
	
</style>
