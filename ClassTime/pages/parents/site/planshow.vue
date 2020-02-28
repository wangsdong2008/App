<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="register_account">上课管理</view>
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
				    选择课程
				</view>		
				<picker @change="CoursePickerChange($event)" :value="course_index" :range="course_dataList">
					<view class="uni-input">{{course_dataList[course_index]}}</view>
				</picker>
			</view>
			<view :class="{
				'register_account_input':true,
				 'weeklist':(plan_id == 0)
				}">
				<view class="uni-list-cell-left">
				    选择周几
				</view>
				<view v-if="plan_id == 0" class="cell-right weeks">
					<checkbox-group @change="checkboxChange">
			    		<label class="uni-list-cell uni-list-cell-pd" v-for="(item,index) in week_dataList" :index="index" :key="item.weekid">
			    			<checkbox :value="item.weekid" /><text>{{item.weektext}}</text>
			    		</label>
			    	</checkbox-group>
			    </view>
				<picker v-if="plan_id > 0" @change="WeekPickerChange($event)" :value="week_index" :range="week_dataList">
					<view class="uni-input">{{week_dataList[week_index]}}</view>
				</picker>
			</view>
			<view class="register_account_input">
			    <view class="uni-list-cell-left">
			        上课时间
			    </view>     
				<picker mode="time" :value="p_time" start="00:01" end="23:59" @change="bindTimeChange">
				    <view class="uni-input">{{p_time}}</view>
				</picker>
			</view>
			<view class="register_account_input">
			    <view class="uni-list-cell-left">
			        每课时间
			    </view>
				<view class="cell-right">
					<m-input class="m-input" type="text" clearable  v-model="p_pertime" placeholder="每节课时间(分)"></m-input>	
				</view>
			</view>
			<view class="register_account_input">
			    <view class="uni-list-cell-left">
			        总节数
			    </view>
				<view class="cell-right">
					<m-input class="m-input" type="text" clearable  v-model="p_num" placeholder="总节数"></m-input>	
				</view>
			</view>
			<view class="register_account_input">
			    <view class="uni-list-cell-left">
			        已上节数
			    </view>  
				<view class="cell-right">
					<m-input class="m-input" type="text" clearable v-model="p_numed" placeholder="已上节数"></m-input>
				</view>
			</view>
			<view class="btn-row">
			    <button type="primary" class="primary btn" @tap="bindmodify">{{btntxt}}</button>
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
		onLoad(options){
			_self = this;
			_self.checkLogin(1);
			_self.plan_id = options['id'];
			if(_self.plan_id == undefined){
				_self.plan_id = 0;
			}
			if(_self.plan_id == 0){
				_self.headermsg = "添加上课安排,Class Plan Add";
			}else{
				_self.headermsg = "上课安排编辑,Class Plan Edit";
			}
		},
		onReady(){
			_self.show();
		},
		data(){
			return{
				headermsg:'',
				btntxt:'',
				is_show:'1',
				
				plan_id:0,
				p_num:'',
				p_numed:'',
				p_pertime:'',
				
				child_id:0,	
				child_index:0,
				child_dataList:[],
				child_dataIDList:[],
				
				course_id:0,
				course_index:0,
				course_dataList:[],
				course_dataIDList:[],
				
				week_id:0,
				week_index:0,
				week_dataList:[],
				week_dataIDList:[],				
				p_time:'12:00',				
				items: [
					{
						value: '1',
						name: '开启'
					},
					{
						value: '0',
						name: '关闭'
					}
				]
			}
		},
		methods:{
			checkboxChange: function (e) {
				//debugger;
				var items = _self.week_dataList;
			    var values = e.detail.value;
				let list = [];
			    for (var i = 0; i <  items.length; i++) {
			        let item = items[i];
			        if(values.includes(item.weekid)){
						list.push(item.weekid);
			            _self.$set(item,'checked',true);
			        }else{
			            _self.$set(item,'checked',false);
			        }
			    }
				_self.week_dataIDList = list;
			},
			bindTimeChange: function(e) {
			    _self.p_time = e.target.value;
			},
			show(){			  
				let ret = _self.getUserInfo();
				if(!ret){
					return false;
				}
				const data = {
				    guid: ret.guid,
				    token: ret.token,
					id:_self.plan_id
				};
				if(_self.plan_id == 0){
					_self.btntxt="添加"; 
					_self.week_dataList = [					
						{"weektext":'一',"weekid":'1'},
						{"weektext":'二',"weekid":'2'},
						{"weektext":'三',"weekid":'3'},
						{"weektext":'四',"weekid":'4'},
						{"weektext":'五',"weekid":'5'},
						{"weektext":'六',"weekid":'6'},
						{"weektext":'日',"weekid":'0'},
					];
				}
				else{
					_self.btntxt = '修改';
					_self.week_dataList = ['周一','周二','周三','周四','周五','周六','周日'];
					_self.week_dataIDList = ['1','2','3','4','5','6','0'];
					
				}
				_self.getData(data);
			},
			getData(data){
				_self.sendRequest({
				       url : _self.ShowChildPlanUrl,
				       method : _self.Method,
				       data : {
						  "guid": data.guid,
						  "token":data.token,
						  "id":data.id,
						  "t":Math.random()
					   },
				       hideLoading : true,
				       success:function (res) {
						if(res){
							   //所有孩子
							   var childlist = res.childlist;
							   var list = [];
							   var idlist = [];
							   list.push("==请选择==");
							   idlist.push(0);
							   for (var i = 0; i < childlist.length; i++) {
									var item = childlist[i];
									list.push(item.child_name);
									idlist.push(item.child_id);
							   }								
							   _self.child_dataList = list;
							   _self.child_dataIDList = idlist;
							   
							   //所有课程
							   //debugger;
							   var courselist = res.courselist;
							   list = [];
							   idlist = [];
							   list.push("==请选择==");
							   idlist.push(0);
							   for (var i = 0; i < courselist.length; i++) {
									var item = courselist[i];
									list.push(item.c_name);
									idlist.push(item.c_id);
							   }								
							   _self.course_dataList = list;
							   _self.course_dataIDList = idlist;
							   
							   
							    
							   if(parseInt(res.status) == 3){
									var planlist = res.planlist; 
									_self.child_id = planlist.child_id;
									var j = _self.child_dataIDList.findIndex(i => i == _self.child_id);
									_self.child_index = j;
									
									_self.course_id = planlist.c_id;
									j = _self.course_dataIDList.findIndex(i => i == _self.course_id);
									_self.course_index = j;
									
									_self.week_id = planlist.p_week;
									j = _self.week_dataIDList.findIndex(i => i == _self.week_id);
									_self.week_index = j;
									
									_self.p_time = planlist.p_time;
									_self.p_id = planlist.p_id;
									_self.p_num = planlist.p_num.toString();
									_self.p_numed = planlist.p_numed.toString();
									_self.p_pertime = planlist.p_pertime.toString();
								}
							}
						
				       }
				   },"1","");
			},
			ChildPickerChange: function(e) {
			    console.log('picker发送选择改变，携带值为', e.target.value+"===="+_self.child_dataList[e.target.value] + _self.child_dataIDList[e.target.value]);
				_self.child_id = _self.child_dataIDList[e.target.value];
				_self.child_index = e.target.value;
			},
			CoursePickerChange:function(e){
				console.log('picker发送选择改变，携带值为', e.target.value+"===="+_self.course_dataList[e.target.value] + _self.course_dataIDList[e.target.value]);
				_self.course_id = _self.course_dataIDList[e.target.value];
				_self.course_index = e.target.value;
			},
			WeekPickerChange:function(e){
				console.log('picker发送选择改变，携带值为', e.target.value+"===="+_self.week_dataList[e.target.value] + _self.week_dataIDList[e.target.value]);
				_self.week_id = _self.week_dataIDList[e.target.value];
				_self.week_index = e.target.value;
			},
			bindmodify(){
				if(_self.child_id == 0){
					uni.showToast({
					    icon: 'none',
					    title: '请选择孩子'
					});
					return;
				}
			    if(_self.course_id == 0){
			    	uni.showToast({
			    	    icon: 'none',
			    	    title: '请选择课程'
			    	});
					return;
			    }
				if(_self.plan_id  == 0){
					if(_self.week_dataIDList.length == 0){
						uni.showToast({
							icon: 'none',
							title: '请选择周几'
						});
						return;
					}
					_self.week_id = _self.week_dataIDList;
				}else{
					if(_self.week_id == -1){
						uni.showToast({
						    icon: 'none',
						    title: '请选择周几'
						});
						return;
					}
				}
				
				let ret = _self.getUserInfo();
				if(!ret){
					return false;
				}
				
				_self.sendRequest({
				    url : _self.ModifyChildPlanUrl,
				    method : _self.Method,
				    data : {
						"guid": ret.guid,
						"token": ret.token,
						"id": _self.plan_id,
						"child_id": _self.child_id,
						"course_id":_self.course_id,
						"week_id":_self.week_id,
						"p_time":_self.p_time,
						"p_num":_self.p_num,
						"p_numed":_self.p_numed,
						"p_pertime":_self.p_pertime,
						"t":Math.random()
					},
				    hideLoading : true,
				    success:function (res) {
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
								if(_self.plan_id == 0){
									str = '添加成功';
									_self.child_id = 0;
									_self.course_id = 0;
									_self.week_id = 0;
									_self.child_index = 0;
									_self.course_index = 0;
									_self.week_index = 0;
									_self.p_time = "12:00";
									_self.p_num = '';
									_self.p_numed = '';				
									
								}else{
									str = '修改成功';
									//_self.show();
								}
								break;
							}												
						}
						/* uni.showToast({
							title: str,
							icon: 'none',
							duration:2000
						}); */
						uni.showModal({
						    title: str,
						    content: '请选择返回的页面',
							cancelText:'留在本页',
							confirmText:'返回前页',
						    success: function (res) {
						        if (res.confirm) {
									_self.navigateTo('plan');
						        } else if (res.cancel) {
						            _self.navigateTo('planshow?id='+_self.plan_id);
						        }
						    }
						});
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