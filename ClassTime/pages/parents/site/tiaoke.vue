<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="register_account">调课管理</view>
			<view class="register_account_input">
				<view class="uni-list-cell-left">
				    选择孩子
				</view>
				<picker focus @change="ChildPickerChange($event)" :value="child_index" :range="child_dataList">
					<view class="uni-input">{{child_dataList[child_index]}}</view>
				</picker>
			</view>
			<view class="register_account_input">
				<view class="uni-list-cell-left">
				    选择日期
				</view>		
				<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
                    <view class="uni-input">{{date}}</view>
                </picker>
			</view>
			
			<view class="register_account_input">	
				<view class="uni-list-cell-left">
				    选择课程
				</view>		
				<picker @change="CoursePickerChange($event)" :value="course_index" :range="course_dataList">
					<view class="uni-input">{{course_dataList[course_index]}}</view>
				</picker>
			</view>
			
			<view class="register_account_input">
				<view class="uni-list-cell-left">
				    调到
				</view>		
				<picker mode="date" :value="date1" :start="startDate" :end="endDate" @change="bindDate1Change">
                    <view class="uni-input">{{date1}}</view>
                </picker>
			</view>
			
			<view class="register_account_input">
				<view class="uni-list-cell-left">
				    选择时间
				</view>		
				<picker mode="time" :value="time" start="09:01" end="21:01" @change="bindTimeChange">
                    <view class="uni-input">{{time}}</view>
                </picker>
			</view>
			<view class="btn-row">
			    <button type="primary" class="primary" @tap="bindmodify">{{btntxt}}</button>
			</view>
			</view>
		</view>
	</view>
</template>
<script>
	import service from '../../../service.js';
	import mInput from '../../../components/m-input.vue';
	import headerNav from "@/components/header/company_header.vue"
	var _self;
	export default {
	    components: {
			service,
			headerNav,
			mInput
		},
		computed: {
			startDate() {
				return _self.getDate('start');
			},
			endDate() {
				return _self.getDate('end');
			}
		},
		onLoad(){
			_self = this;
			_self.checkLogin(1);
			_self.headermsg = "调课";
		},
		onReady(){
			_self.show();
		},
		data(){
			return{
				child_id:0,
				child_index:0,
				child_dataList:[],
				child_dataIDList:[],
				
				date:'==请选择日期==',
				date1:'==请选择日期==',
				time:'==请选择时间==',
				dateid:'',
				dateid1:'',
				
				course_id:0,
				course_index:0,
				course_dataList:[],
				course_dataIDList:[],
				
				btntxt:"调课"
			}
		},
		methods:{
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			bindDateChange: function(e) {
				_self.date = e.target.value
				_self.dateid = e.target.value;
				_self.getchildcourselist();
			},
			bindDate1Change: function(e) {
				_self.date1 = e.target.value
				_self.dateid1 = e.target.value;
			},
			getchildcourselist:function(){ //根据child_id和日期，获取当天的课程，用来调课			
				if(_self.child_id > 0 && _self.dateid != ''){
					let ret = _self.getUserInfo();
					if(!ret){
						return false;
					}else{
						_self.sendRequest({
							url : _self.GetDayChildCourseUrl,
							method : _self.Method,
							data : {
								"token":ret.token,
								"guid":ret.guid,
								"dateid":_self.dateid,
								"id":_self.child_id,
								"t":Math.random()
							},
							hideLoading : true,
							success:function (res) { //获取某个孩子这一天的课程
								//debugger;
								//console.log("获取数据:" + JSON.stringify(res));
								/* let data1 = res.data;
								_self.fillData(data1); */		
								var courselist = res.courselist;
								let list = [];
								let idlist = [];
								list.push("==请选择课程==");
								idlist.push(0);
								for (var i = 0; i < courselist.length; i++) {
									var item = courselist[i];
									list.push(item.c_name+"("+item.p_time+")");
									idlist.push(item.c_id);
								}								
								_self.course_dataList = list;
								_self.course_dataIDList = idlist;
								
								
							}
						},"1","");
					}
					
				}
			},
			bindTimeChange: function(e) {
				_self.time = e.target.value;
			},
			ChildPickerChange: function(e) {
			    console.log('picker发送选择改变，携带值为', e.target.value+"===="+_self.child_dataList[e.target.value] + _self.child_dataIDList[e.target.value]);
				_self.child_id = _self.child_dataIDList[e.target.value];
				_self.child_index = e.target.value;
				_self.getchildcourselist();
			},
			CoursePickerChange:function(e){
				console.log('picker发送选择改变，携带值为', e.target.value+"===="+_self.course_dataList[e.target.value] + _self.course_dataIDList[e.target.value]);
				_self.course_id = _self.course_dataIDList[e.target.value];
				_self.course_index = e.target.value;
			},
			bindmodify(){
				if(_self.child_id == 0 || _self.child_id == undefined){
					uni.showToast({
					    icon: 'none',
					    title: '请选择孩子'
					});
					return;
				}
				if(_self.dateid == '' || _self.dateid == undefined){
					uni.showToast({
					    icon: 'none',
					    title: '请选择调课日期'
					});
					return;
				}
				if(_self.course_id == 0 || _self.course_id == undefined){
					uni.showToast({
						icon: 'none',
						title: '请选择课程'
					});
					return;					
				}
				if(_self.dateid1 == '' || _self.dateid1 == undefined){
					uni.showToast({
					    icon: 'none',
					    title: '请选择调到日期'
					});
					return;
				}
				if(_self.time == '' || _self.time == undefined){
					uni.showToast({
					    icon: 'none',
					    title: '请选择调上课时间'
					});
					return;
				}
				
				let ret = _self.getUserInfo();
				if(!ret){
					return false;
				}
				
				_self.sendRequest({
				       url : _self.updateChildCourseTiaokeSignUrl,
				       method : _self.Method,
				       data : {
							"guid": ret.guid,
							"token": ret.token,
							"id": _self.child_id,
							"dateid":_self.dateid,
							"cid":_self.course_id,
							"dateid1":_self.dateid1,
							"time":_self.time,
							"t":Math.random()
					   },
				       hideLoading : false,
				       success:function (res) {
						//debugger;
						let status = res.status;
						status = parseInt(status);
						let str = '';
						switch(status){
							case 0:{
								str = '数据填写错误';
								break;
							}
							case 2:{
								str = '课程已经存在';
								break;
							}
							case 3:{
								str = '调课成功';
								break;
							}							
						}
						
						uni.showModal({
						    title: str,
						    content: '请选择返回的页面',
							confirmText:'返回前页',
						    success: function (res) {
						        if (res.confirm) {
									_self.navigateTo('index');
						        } 
						    }
						});
				       }
				   },"1","");			
			},
			show(){
				//if(_self.child_id == 0 ) return;  //考虑添加功能,允许等于0
				let ret = _self.getUserInfo();
				if(!ret){
					return false;
				}
				const data = {
				    guid: ret.guid,
				    token: ret.token,
					id:_self.child_id
				};
				_self.getData(data);
				
			},
			getData(data){
				this.sendRequest({
				       url : this.AllChildrenUrl,
				       method : _self.Method,
				       data : {
						"guid": data.guid,
						"token":data.token,
						"t":Math.random()
					   },
				       hideLoading : true,
				       success:function (res) {
						if(res){
							//所有孩子
							var childlist = res.list;
							var list = [];
							var idlist = [];
							list.push("==请选择孩子==");
							idlist.push(0);
							for (var i = 0; i < childlist.length; i++) {
								var item = childlist[i];
								list.push(item.child_name);
								idlist.push(item.child_id);
							}								
							_self.child_dataList = list;
							_self.child_dataIDList = idlist;
										
							var list = [];
							var idlist = [];
							list.push("==请选择课程==");
							idlist.push(0);												
							_self.course_dataList = list;
							_self.course_dataIDList = idlist;				
							
						}
				    }
			    },"1","");
			}
		}
    }
</script>

<style>	
	.register_account_input view{
		float: left;
		margin-bottom: 10upx;
	}	
	.content{
		width:96%;
		margin: 0 auto;
	}
	
	.clear{
		clear: both;
	}
	
	.btn-row{
		margin-top: 40upx;	
		padding: 0upx;
	}
	
	uni-button{
		border-radius: 25upx;		
	}
	uni-button:after{
		border: 0px;		
	}
	.remeber{
		font-size: 28upx;
		margin-top: 10upx;		
	}
	.remeber checkbox{
		
	}
	.content{
		background-color: #fff;		
		padding-top: 10upx;
	}
	.register_account_input{
		padding-top: 20upx;
		padding-bottom: 10px;
		border-bottom: 1px solid #eeeeee;
		line-height: 60upx;
		height: 60upx;
	}
	.register_account{
		font-size: 42upx;
		font-family: '黑体';
		margin-top: 30upx;
		margin-bottom: 20upx;
	}
	.m-input{
		border: 0upx;
		font-size: 28upx;
	}
	.register-input{		
		width:90%;
		line-height: 60upx;
		height: 110upx;
		padding-left: 90upx;
	}
	.register-input-username{
		background:url(../../../static/img/user.png) no-repeat;
		-webkit-background-size:30upx 42upx ;
		background-size:30upx 42upx ;
	}
	.register-input-mobile{
		background:url(../../../static/img/mobile.png) no-repeat;
	}
	.register-input-mail{
		background:url(../../../static/img/mail.png) no-repeat;	
		width:53%;
		float: left;
	}
	
	.register-input-password{
		background:url(../../../static/img/password.png) no-repeat;		
	}
	.login_content{
	        width: 100%;
	    }
	.title{
		background:url('../../../static/img/login_title.png') #ffffff center 0 no-repeat;
	    background-size:100% 100%;
	    padding-bottom:20%
	}
	.login_center{
		width:85%;			
		margin: 0 auto;
		padding-bottom: 60upx;
	}
	.login_title_txt{
	    color:#fff;
	    font-family:'微软雅黑';
	    font-size:60upx;
	    padding-top:150upx;
	}
	.login_title_txt span{
	    font-size: 48upx;
	}
	.uni-list-cell-left{
		margin-right: 40upx;
		width:25%;
		font-size: 35upx;
	}
	picker view{
		border: 1px solid #66ccff;
		width:60%;
		text-align: center;
	}
	.cell-right{
		float: left;
		border: 1px solid #66ccff;
		width:60%;
		text-align: center;		
	}
	.btn-row{
		margin-bottom: 60upx;
	}
	.weeks{
		font-size: 30upx;
		text-align: left;
		height: 120upx;
		border:0upx;
	}	
	.weeklist{
		height: 110upx;
	}
	.weeks label{
		margin-right: 15upx;
	}
</style> 