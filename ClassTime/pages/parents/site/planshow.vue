<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="register_account">上课管理</view>
			<view class="register_account_input">	
				<view class="uni-list-cell-left">
				    选择孩子
				</view>
				<picker @change="ChildPickerChange($event)" :value="child_index" :range="child_dataList">
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
			<view class="register_account_input">
				<view class="uni-list-cell-left">
				    选择周几
				</view>
				<picker @change="WeekPickerChange($event)" :value="week_index" :range="week_dataList">
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
	export default {
	    components: {
			service,
			headerNav,
			mInput
		},
		onLoad(options){
			this.checkLogin();
			this.plan_id = options['id'];
			if(this.plan_id == undefined){
				this.plan_id = 0;
			}
			if(this.plan_id == 0){
				this.headermsg = "添加上课安排,Class Plan Add";
			}else{
				this.headermsg = "上课安排编辑,Class Plan Edit";
			}
		},
		onReady(){
			this.show();
		},
		data(){
			return{
				headermsg:'',
				btntxt:'',
				is_show:'1',
				
				plan_id:0,
				
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
				week_dataList:['==请选择==','星期一','星期二','星期三','星期四','星期五','星期六','星期日'],
				week_dataIDList:['-1','1','2','3','4','5','6','0'],
				
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
			bindTimeChange: function(e) {
			    this.p_time = e.target.value;
			},
			show(){
			//if(this.plan_id == 0 ) return;  //考虑添加功能,允许等于0
				let ret = uni.getStorageSync(this.USERS_KEY);
				if(!ret){
					return false;
				}
				const data = {
				    guid: ret.guid,
				    token: ret.token,
					id:this.plan_id
				};
				if(this.plan_id == 0) this.btntxt="添加"; else this.btntxt = '修改';
				this.getData(data);
			},
			getData(data){
				uni.request({
					url: this.ShowChildPlanUrl,
						header: {
					        "Content-Type": "application/x-www-form-urlencoded"							 
					    },
					    data: {
							"guid": data.guid,
							"token":data.token,
							"id":data.id,
							"t":Math.random()
					    },
					    method: "get",
						success: (res) => {
						   if(res.data){
							   //所有孩子
							   var childlist = res.data.childlist;
							   var list = [];
							   var idlist = [];
							   list.push("==请选择==");
							   idlist.push(0);
							   for (var i = 0; i < childlist.length; i++) {
									var item = childlist[i];
									list.push(item.child_name);
									idlist.push(item.child_id);
							   }								
							   this.child_dataList = list;
							   this.child_dataIDList = idlist;
							   
							   //所有课程
							   //debugger;
							   var courselist = res.data.courselist;
							   list = [];
							   idlist = [];
							   list.push("==请选择==");
							   idlist.push(0);
							   for (var i = 0; i < courselist.length; i++) {
									var item = courselist[i];
									list.push(item.c_name);
									idlist.push(item.c_id);
							   }								
							   this.course_dataList = list;
							   this.course_dataIDList = idlist;
							   
							   
							    								
								if(parseInt(res.data.status)==3){
									
									var planlist = res.data.planlist; 
									this.child_id = planlist.child_id;
									var j = this.child_dataIDList.findIndex(i => i == this.child_id);
									this.child_index = j;
									
									this.course_id = planlist.c_id;
									j = this.course_dataIDList.findIndex(i => i == this.course_id);
									this.course_index = j;
									
									this.week_id = planlist.p_week;
									j = this.week_dataIDList.findIndex(i => i == this.week_id);
									this.week_index = j;
									
									this.p_time = planlist.p_time;
									this.p_id = planlist.p_id;
									
									
									
								}else{
									/* uni.showToast({
										title: '无数据',
										icon: 'none',
									}); */
								}
							}
						}
					})
			},
			ChildPickerChange: function(e) {
			    console.log('picker发送选择改变，携带值为', e.target.value+"===="+this.child_dataList[e.target.value] + this.child_dataIDList[e.target.value]);
				this.child_id = this.child_dataIDList[e.target.value];
				this.child_index = e.target.value;
			},
			CoursePickerChange:function(e){
				console.log('picker发送选择改变，携带值为', e.target.value+"===="+this.course_dataList[e.target.value] + this.course_dataIDList[e.target.value]);
				this.course_id = this.course_dataIDList[e.target.value];
				this.course_index = e.target.value;
			},
			WeekPickerChange:function(e){
				console.log('picker发送选择改变，携带值为', e.target.value+"===="+this.week_dataList[e.target.value] + this.week_dataIDList[e.target.value]);
				this.week_id = this.week_dataIDList[e.target.value];
				this.week_index = e.target.value;
			},
			bindmodify(){
				let that = this;
				if(that.child_id == 0){
					uni.showToast({
					    icon: 'none',
					    title: '请选择孩子'
					});
					return;
				}
			    if(that.course_id == 0){
			    	uni.showToast({
			    	    icon: 'none',
			    	    title: '请选择课程'
			    	});
					return;
			    }
				if(that.week_id == 0){
			    	uni.showToast({
			    	    icon: 'none',
			    	    title: '请选择周几'
			    	});
					return;
			    }
				let ret = uni.getStorageSync(this.USERS_KEY);
				if(!ret){
					return false;
				}
				uni.request({
					url: that.ModifyChildPlanUrl,
					header: {
				        "Content-Type": "application/x-www-form-urlencoded"							 
				    },
				    data: {
						"guid": ret.guid,
						"token": ret.token,
						"id": this.plan_id,
						"child_id": this.child_id,
						"course_id":this.course_id,
						"week_id":this.week_id,
						"p_time":this.p_time,
						"t":Math.random()
				    },
				    method: "get",
					success: (res) => {
						let status = res.data.status;
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
								if(this.plan_id == 0){
									str = '添加成功';
								}else{
									str = '修改成功';
								}
								this.child_id = 0;
								this.course_id = 0;
								this.week_id = 0;
								this.child_index = 0;
								this.course_index = 0;
								this.week_index = 0;
								this.p_time = "12:00";
								break;
							}							
						}
						uni.showToast({
							title: str,
							icon: 'none',
							duration:2000
						});
						
						
					}
			    });	
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
		/* border:1px solid #ff0000; */
	}
	.btn1{
		border:0upx;
		background-color: #ccc;
		
	}
	.btn{
		float: right;
		background-color: #eee;
		color:#225181;
		font-size: 24upx;
		align:center;
		width: 29%;
		height: 76upx;
		line-height: 76upx;
		border-radius: 45upx;
		top:10upx;
		
		
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
	}
	picker view{
		border: 1px solid #66ccff;
		width:60%;
		text-align: center;
	}
	
</style> 