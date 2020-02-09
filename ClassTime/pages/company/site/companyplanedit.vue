<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="register_account">计划信息</view>
			<view class="register_account_input">
				<picker @change="pickerCompanyChange($event)" :value="cindex" :range="cList">
					<view class="uni-input">{{cList[cindex]}}</view>
				</picker>
			</view>
			<view class="register_account_input">
				<picker @change="categoryPickerChange($event)" :value="category_index" :range="category_dataList">
					<view class="uni-input">{{category_dataList[category_index]}}</view>
				</picker>
			</view>
			
			<view :class="{
				'register_account_input':true,
				 'checkboxlist':(_self.com_id > 0)
				}">
				<view v-if="_self.com_id == 0">==请选择学生==</view>
				<view v-if="_self.com_id > 0">
					<checkbox-group @change="checkboxChange">
						<label class="uni-list-cell uni-list-cell-pd" v-for="(item,index) in students_dataList" :index="index" :key="item.uid">
							<checkbox class="checkbox" :value="item.uid" /><text>{{item.uname}}</text>
						</label>
					</checkbox-group>
				</view>
			</view>
			
			<view class="register_account_input">
				<view class="uni-list-cell-left">
				    上课时间
				</view>		
			</view>
			
			<view  class="register_account_input week-list" v-for="(witem,windex) in week_dataList" :index="windex" :key="witem.week_id">
				<view class="left_txt">周{{witem.weektext}}</view>
				<view class="week-list-time">
					<view class="left_txt">上课时间:</view>
					<view class="cell-right">
						<picker mode="time" :value="'utime'+witem.weekid" start="00:01" end="23:59" @change="bindTimeChange">
							<view class="uni-input">{{'utime'+witem.weekid}}</view>
						</picker>
					</view>					
				</view>
				<view class="week-list-time address">
					<view class="left_txt">地址：</view>
					<view class="cell-right">
						<m-input class="m-input t2" type="text" clearable  v-model="uaddress1" placeholder=""></m-input>
					</view>					
				</view>
				<view class="week-list-time">
					<view class="left_txt">送机构时间:</view>
					<view class="cell-right">
						<picker mode="time" :value="'givetime'+witem.weekid" start="00:01" end="23:59" @change="bindTimeChange">
							<view class="uni-input">{{'givetime'+witem.weekid}}</view>
						</picker>
					</view>					
				</view>
				<view class="week-list-time address">
					<view class="left_txt">送地址：</view>
					<view class="cell-right">
						<m-input class="m-input t2" type="text" clearable  v-model="giveaddress1" placeholder=""></m-input>
					</view>					
				</view>
				<view class="week-list-time">
					<view class="left_txt">接回时间:</view>
					<view class="cell-right">
						<picker mode="time" :value="backtime1" start="00:01" end="23:59" @change="bindTimeChange">
							<view class="uni-input">{{backtime1}}</view>
						</picker>
					</view>					
				</view>
				<view class="clear"></view>
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
		onLoad(options){
			_self = this;
			_self.checkLogin();
			_self.uid = options['id'];
			if(_self.uid == undefined){
				_self.uid = 0;
			}
			if(_self.uid == 0){
				_self.btntxt = '添加'
				_self.headermsg = "添加新计划,grade Add";
			}else{
				_self.btntxt="修改";
				_self.headermsg = "计划编辑,grade Edit";
			}
		},
		onReady(){
			_self.show();
		},
		data(){
			return{
				grade_id:0,
				grade_name:'',
				grade_order:'',
				grade_address:'',
				dataList:[],	
							
				com_id:0,
				cindex:0,
				cList:[],
				cIDList:[],
				cStatuslist:[],
				
				category_id:0,
				category_index:0,
				category_dataList:[],
				category_dataIDList:[],
				
				//学生列表
				uid:0,
				students_dataList:[],
								
				
				week_id:0,
				week_index:0,
				week_dataList:[],
				week_dataIDList:[],	
				
				utime1:'15:00',
				uaddress1:'接的地址',
				givetime1:'',
				giveaddress1:'送的地址',
				backtime1:'',
				
				headermsg:'',
				btntxt:''
			}
		},
		methods:{
			checkboxChange: function (e) {
				/*debugger;
				var items = _self.students_dataList;
			    var values = e.detail.value;
				let list = [];
			    for (var i = 0; i <  items.length; i++) {
			        let item = items[i];
			        if(values.includes(item.uid)){
						list.push(item.uid);
			            this.$set(item,'checked',true);
			        }else{
			            this.$set(item,'checked',false);
			        }
			    }
				_self.students_dataList = list; */
			},
			categoryPickerChange:function(e){
				console.log('学校picker发送选择改变，携带值为', e.target.value+"===="+_self.category_dataList[e.target.value] + _self.category_dataIDList[e.target.value]);
				var category_id = _self.category_dataIDList[e.target.value];
				_self.category_id = category_id;
				_self.category_index = e.target.value;
			},
			pickerCompanyChange:function(e){
				console.log('公司picker发送选择改变，携带值为', e.target.value+"===="+_self.cList[e.target.value] + _self.cIDList[e.target.value]);
				_self.com_id = _self.cIDList[e.target.value];
				_self.status = _self.cStatuslist[e.target.value];
				_self.cindex = e.target.value; 
				
				//获取下属分类
				let ret = _self.getUserInfo();
				this.sendRequest({
				    url : this.GetAllSubCompanyCategoryByComidUrl,
				    method : _self.Method,
				    data : {
						"guid": ret.guid,
						"token":ret.token,
						"com_id":_self.com_id,
						"status":_self.status,
						"t":Math.random()
					},
				    hideLoading : true,
				    success: (res) => {	
				    	if(res){
							if(parseInt(res.status) == 3){
								var data = res.categorylist;
								let uid = 0;
								let list = [];
								let idlist = [];
								list.push("==请选择课程==");
								idlist.push(0);
								for (var i = 0; i < data.length; i++) {
									var item = data[i];									
									list.push(item.cat_name);
									idlist.push(item.cat_id);
								}
								_self.category_dataList = list;
								_self.category_dataIDList = idlist;
								_self.category_index = 0;
								
								//所有学生
								data = res.studentslist;
								list = [];
								for (var i = 0; i < data.length; i++) {
									var item = data[i];									
									list.push(item);
								}
								_self.students_dataList = list;
								
							}							
						}
					}
				});				
				
			},
			bindmodify(){
				let that = _self;
				//debugger;
				if(!service.checkNull(that.grade_name)){
					uni.showToast({
					    icon: 'none',
					    title: '计划名称必须是填写'
					});
					return;
				}
				let ret = _self.getUserInfo();
				if(!ret){
					return false;
				}				
					_self.sendRequest({
				        url : _self.UpdateGradeInfoUrl,
				        method : _self.Method,
				        data : {
							"guid": ret.guid,
							"token": ret.token,
							"grade_id": _self.grade_id,
							"com_id":_self.com_id,
							"grade_name": _self.grade_name,
							"grade_order":_self.grade_order,
							"category_id":_self.category_id,
							"t":Math.random()
						},
				        hideLoading : false,
				       success: (res) => {
				       		let status = res.status;
				       		let str = '';
				       		switch(status){
				       			case 0:{
				       				str = '数据填写错误';
				       				break;
				       			}
				       			case 2:{
				       				str = '计划名已经存在';
				       				break;
				       			}
				       			case 3:{
									if(_self.grade_id == 0){
										_self.grade_id = 0;
										_self.com_id = 0;
										 _self.grade_name = '';
										_self.grade_order = '';
										_self.category_id = '';
										str = '添加成功';
										
									}else{
										str = '修改成功';
									}
				       				
				       				break;
				       			}							
				       		}
				       		
				       	uni.showModal({
				       		title: str,
				       		content: '请选择返回的页面',
				       		cancelText:'留在本页',
				       		confirmText:'返回前页',
				       		success: function (res) {
				       			if (res.confirm) {
				       				_self.navigateTo('grade');
				       			} else if (res.cancel) {
				       				_self.navigateTo('gradeedit?id='+_self.grade_id);
				       			}
				       		}
				       	});
				       	}
				       
				    },"1","");
			},
			show(){	
				let ret = uni.getStorageSync(_self.USERS_KEY);
				if(!ret){
					return false;
				}
				const data = {
				    guid: ret.guid,
				    token: ret.token,
					id:_self.grade_id
				};		
						
				if(_self.uid == 0){
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
					_self.week_dataList = ['周一','周二','周三','周四','周五','周六','周日'];
					_self.week_dataIDList = ['1','2','3','4','5','6','0'];
					
				}
				
				_self.getData(data);
			},
			getData(data){			
				this.sendRequest({
				    url : this.GetCompanyplanInfoUrl,
				    method : _self.Method,
				    data : {
						"guid": data.guid,
						"token":data.token,
						"id":data.id,
						"t":Math.random()
					},
				    hideLoading : true,
				    success: (res) => {
							//子公司
							var data = res.subcompanylist;
							let list = [];
							let idlist = [];
							let statuslist = [];
							list.push("==请选择所属机构==");
							idlist.push(0);
							statuslist.push(0)
							for (var i = 0; i < data.length; i++) {
								var item = data[i];									
								list.push(item.com_name);
								idlist.push(item.com_id);
								statuslist.push(item.wt_status);
							}								
							_self.cList = list;
							_self.cIDList = idlist;
							_self.cStatuslist = statuslist;
							if(_self.uid == 0) _self.cindex = 0;	
							
							
							list = [];
							idlist = [];
							list.push("==请选择课程==");
							idlist.push(0);
							_self.category_dataList = list;
							_self.category_dataIDList = idlist;
							if(_self.uid == 0)	_self.category_index = 0; 
						
				    	    if(res){
								
								
								/* var categorylist = res.categorylist;
								list = [];
								idlist = [];
								list.push("==请选择分类==");
								idlist.push(0);
								for (var i = 0; i < categorylist.length; i++) {
									var item = categorylist[i];
									list.push(item.category_name);
									idlist.push(item.category_id);
								}								
								_self.category_dataList = list;
								_self.category_dataIDList = idlist;
								if(_self.uid == 0)	_self.category_index = 0; */
								
								//debugger;
								
								var data = res.gradelist; 
				    			if(parseInt(res.status) == 3){
				    				/* _self.grade_name = data.grade_name;
				    				_self.grade_order = data.grade_order.toString();	 							
									
									_self.com_id = data.com_id;
									let j = _self.cIDList.findIndex(i => i == _self.com_id);
									_self.cindex = j;									
									
									_self.category_id = data.category_id;
									j = _self.category_dataIDList.findIndex(i => i == _self.category_id);
									_self.category_index = j;*/	
									
									
									
				    			}
								
				    	    }
				    	}
				    
				},"1","");				
			}
		}
    }
</script>

<style>	
	.week-list{
		padding-left: 40upx;
		border:1px solid #ccc;
		border-radius: 25upx;
		margin-bottom: 40upx;
	}	
	.week-list picker{
		width: 400upx;
		height: 60upx;
		line-height: 60upx;
		text-align: left;
		padding-left: 20upx;
		border:1px solid #eee;
	}
	.week-list .week-list-time{
		padding-left: 20upx;
	}
	.week-list .week-list-time.address{
		clear: both;
	}
	.week-list .week-list-time view{
		float: left;
		margin-right: 20upx;
		margin-bottom: 20upx;
	}
	.week-list .left_txt{
		width:30%;
	}	
	.cell-right{
		width:60%;
		padding-right: 10upx;
	}	
	.week-list-time .cell-right .m-input{
		border: 0upx;
		border: 1px solid #eee;
		line-height: 70upx;
		height: 70upx;
		font-size: 28upx;
	}
	.week-list view{
		/* float: left;	 */	
	}
	.checkboxlist{
		font-size: 30upx;
		text-align: left;
		height: 400upx;
		overflow-y: auto;
		padding: 20upx;
	}
	.checkboxlist label{
		margin-right: 15upx;
		width:180upx;
		margin-bottom: 20upx;
		height: 40upx;
		line-height: 40upx;
		display: block;
	} 
	picker{
		font-size: 30upx;
	}
	view.txt{
		font-size: 30upx;
	}
	.weeklist label{
		margin-right: 10upx;
		width:120upx;
		margin-bottom: 20upx;
		height: 40upx;
		line-height: 40upx;
		font-size: 30upx;
	} 	
	.checkboxlist .checkbox{
		height: 40upx;
		line-height: 40upx;
	}
	.weeklist{
		height: 110upx;
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
	
	
</style>