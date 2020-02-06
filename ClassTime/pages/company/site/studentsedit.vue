<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="register_account">学生信息</view>
			<view class="register_account_input">				
				<m-input class="m-input" type="text" clearable focus v-model="uname" placeholder="填写学生姓名"></m-input>
			</view>	
			<view class="register_account_input">
				<m-input class="m-input" type="text" clearable v-model="birthday" placeholder="生日"></m-input>
			</view>	
			<view class="register_account_input form">
				<radio-group @change="sexChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in sex_items" :index="index" :key="item.value">
					<view>
						<radio class="radios" :value="item.value" :checked="parseInt(item.value) == sex" />
					</view>
					<view class="radio_text">{{item.name}}</view>
					</label>
					
				</radio-group>
			</view>
			<view class="register_account_input">
				<m-input class="m-input" type="text" clearable v-model="teacher" placeholder="班主任"></m-input>
			</view>	
			<view class="register_account_input">
				<m-input class="m-input" type="text" clearable v-model="mparent" placeholder="家长姓名"></m-input>
			</view>	
			<view class="register_account_input">
				<m-input class="m-input" type="text" clearable v-model="mtel" placeholder="联系方式"></m-input>
			</view>				
			<view class="register_account_input form">
				<radio-group @change="statusChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index2) in items" :index="index2" :key="item.value">
					<view>
						<radio class="radios" :value="item.value" :checked="parseInt(item.value) == is_show" />
					</view>
					<view class="radio_text">{{item.name}}</view>
					</label>
					
				</radio-group>
			</view>
			<view class="register_account_input class-memo">
				<textarea class="m-textarea" v-model="memo" placeholder="备注信息"></textarea>
			</view>		
			<view class="register_account_input class-memo">
				<textarea class="m-textarea" v-model="fan_jkou" placeholder="忌口"></textarea>
			</view>
			<view class="register_account_input">
				<picker @change="pickerCompanyChange($event)" :value="cindex" :range="cList">
					<view class="uni-input">{{cList[cindex]}}</view>
				</picker>
			</view>			
			<view class="register_account_input">
				<picker @change="SchoolPickerChange($event)" :value="school_index" :range="school_dataList">
					<view class="uni-input">{{school_dataList[school_index]}}</view>
				</picker>
			</view>	
			<view class="register_account_input">
				<picker @change="GradePickerChange($event)" :value="grade_index" :range="grade_dataList">
					<view class="uni-input">{{grade_dataList[grade_index]}}</view>
				</picker>
			</view>	
			<view class="register_account_input">
				<picker @change="ClassPickerChange($event)" :value="class_index" :range="class_dataList">
					<view class="uni-input">{{class_dataList[class_index]}}</view>
				</picker>
			</view>	
		</view>
		<view class="button-sp-area">
			<view>
				<button type="primary" @tap="bindmodify">{{btntxt}}</button>
			</view>
		</view>
	</view>
</template>
<script>
	import service from '../../../service.js';
	import mInput from '../../../components/m-input.vue';
	import headerNav from "@/components/header/company_header.vue"
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
	var _self;
	export default {
	    components: {
			service,
			headerNav,
			mInput,
			uniCalendar 
		},
		data(){
			return{
				uid:0,
				uname:'',
				dataList:[],				
				headermsg:'',
				
				school_id:0,
				school_index:0,
				school_dataList:[],
				school_dataIDList:[],
				
				grade_id:0,
				grade_index:0,
				grade_dataList:[],
				grade_dataIDList:[],
				
				class_id:0,
				class_index:0,
				class_dataList:[],
				class_dataIDList:[],
				
				com_id:0,
				cindex:0,
				cList:[],
				cIDList:[],
				
				btntxt:'',
				
				sex:1,
				sex_items:[
					{
						value: '1',
						name: '男'
					},
					{
						value: '0',
						name: '女'
					}
				],
				teacher:'',
				birthday:'',
				is_show:1,
				items: [
					{
						value: '1',
						name: '启用'
					},
					{
						value: '0',
						name: '关闭'
					}
				],
				memo:'',
				mparent:'',
				mtel:'',
				fan_jkou:''
			}
		},
		onLoad(options){
			_self = this;
			_self.checkLogin();
			_self.uid = options['id'];
			if(_self.uid == undefined){
				_self.uid = 0;
			}
			if(_self.uid == 0){
				_self.headermsg = "添加新学生,Student Add";
				_self.btntxt = "添加";
			}else{
				_self.headermsg = "学生编辑,Student Edit";
				_self.btntxt = "修改";
			}
		},
		onReady(){
			_self.show();
		},
		
		methods:{
			bindmodify(){
				//debugger;
				if(!service.checkNull(_self.uname)){
					uni.showToast({
					    icon: 'none',
					    title: '学生名必须填写'
					});
					return;
				}
				let ret = this.getUserInfo();
				if(!ret){
					return false;
				}	
					this.sendRequest({
				        url : this.UpdateStudentsInfoUrl,
				        method : _self.Method,
				        data : {
							"guid": ret.guid,
							"token": ret.token,							
							"id": _self.uid,
							"uname": _self.uname,
							"sex": _self.sex,
							"birthday": _self.birthday,
							"mparent": _self.mparent,
							"mtel": _self.mtel,
							"teacher": _self.teacher,
							"memo": _self.memo,
							"fan_jkou": _self.fan_jkou,
							"com_id":_self.com_id,
							"school_id": _self.school_id,
							"grade_id": _self.grade_id,
							"class_id": _self.class_id,
							
							"is_show":_self.is_show,
							
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
				       			case 3:{
									if(_self.uid == 0){
										str = '添加成功';
										 _self.uid = 0;
										 _self.uname = '';
										 _self.sex = 1;
										 _self.birthday ="";
										 _self.mparent = "";
										 _self.mtel = "";
										 _self.teacher = "";
										 _self.memo = "";
										 _self.fan_jko = "";
										 _self.school_id = 0;
										 _self.grade_id = 0;
										 _self.class_id = 0;
										 _self.is_show = 1; 
										 _self.com_id = 0;
										
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
				       				_self.navigateTo('students');
				       			} else if (res.cancel) {
				       				_self.navigateTo('studentsedit?id='+_self.id);
				       			}
				       		}
				       	});
				       	}
				       
				    },"1","");
			},
			open(){
			    _self.$refs.calendar.open(); //打开日历
			},
			pickerCompanyChange:function(e){
				console.log('公司picker发送选择改变，携带值为', e.target.value+"===="+_self.cList[e.target.value] + _self.cIDList[e.target.value]);
				_self.com_id = _self.cIDList[e.target.value];
				_self.cindex = e.target.value; 
				
				let ret = _self.getUserInfo();
				this.sendRequest({
				    url : this.GetAllCompanySchoolUrl,
				    method : _self.Method,
				    data : {
						"guid": ret.guid,
						"token":ret.token,
						"com_id":_self.com_id,
						"t":Math.random()
					},
				    hideLoading : true,
				    success: (res) => {	
				    	if(res){
							var data = res.schoollist;
							if(parseInt(res.status) == 3){
								let uid = 0;
								let list = [];
								let idlist = [];
								list.push("==请选择学校==");
								idlist.push(0);
								for (var i = 0; i < data.length; i++) {
									var item = data[i];									
									list.push(item.school_name);
									idlist.push(item.school_id);
									if(i == 0){
										_self.school_id = item.com_id;
									}
								}
								_self.school_dataList = list;
								_self.school_dataIDList = idlist;
								_self.school_index = 0;	
								
								//清空年级
								list = [];
								idlist = [];
								list.push("==请选择年级==");
								idlist.push(0);											
								_self.grade_dataList = list;
								_self.grade_dataIDList = idlist;
								_self.grade_index = 0;
								
								//清空班级
								list = [];
								idlist = [];
								list.push("==请选择班级==");
								idlist.push(0);										
								_self.class_dataList = list;
								_self.class_dataIDList = idlist;
								_self.class_index = 0;
							}							
						}
					}
				});	
			},
			SchoolPickerChange:function(e){
				console.log('学校picker发送选择改变，携带值为', e.target.value+"===="+_self.school_dataList[e.target.value] + _self.school_dataIDList[e.target.value]);
				var school_id = _self.school_dataIDList[e.target.value];
				_self.school_id = school_id;
				_self.school_index = e.target.value;
				
				let ret = _self.getUserInfo();
				this.sendRequest({
				    url : this.GetAllGradeUrl,
				    method : _self.Method,
				    data : {
						"guid": ret.guid,
						"token":ret.token,
						"id":_self.school_id,
						"t":Math.random()
					},
				    hideLoading : true,
				    success: (res) => {	
				    	if(res){
							var gradelist = res.gradelist;
							let list = [];
							let idlist = [];
							list.push("==请选择年级==");
							idlist.push(0);
							for (var i = 0; i < gradelist.length; i++) {
								var item = gradelist[i];
								list.push(item.grade_name);
								idlist.push(item.grade_id);
							}								
							_self.grade_dataList = list;
							_self.grade_dataIDList = idlist;
							_self.grade_index = 0;
							
							//重新选择学校后，清空班级
							list = [];
							idlist = [];
							list.push("==请选择班级==");
							idlist.push(0);
							var classlist = res.classlist;
							for (var i = 0; i < classlist.length; i++) {
								var item = classlist[i];
								list.push(item.class_name);
								idlist.push(item.class_id);
							}								
							_self.class_dataList = list;
							_self.class_dataIDList = idlist;
							_self.class_index = 0;
							
							
						}
					},
				});
			},
			
			GradePickerChange:function(e){
				console.log('年级picker发送选择改变，携带值为', e.target.value+"===="+_self.grade_dataList[e.target.value] + _self.grade_dataIDList[e.target.value]);
				let grade_id = _self.grade_dataIDList[e.target.value];
				_self.grade_id = grade_id;
				_self.grade_index = e.target.value;
				
				/* let ret = _self.getUserInfo();
					this.sendRequest({
					    url : this.GetAllClassUrl,
					    method : _self.Method,
					    data : {
							"guid": ret.guid,
							"token":ret.token,
							"id":_self.school_id,
							"gradeid":grade_id,
							"t":Math.random()
						},
					    hideLoading : true,
					    success: (res) => {	
					    	if(res){
								var classlist = res.classlist;
								let list = [];
								let idlist = [];
								list.push("==请选择年级==");
								idlist.push(0);
								for (var i = 0; i < classlist.length; i++) {
									var item = classlist[i];
									list.push(item.class_name);
									idlist.push(item.class_id);
								}								
								_self.class_dataList = list;
								_self.class_dataIDList = idlist;
							}
						},
					}); */
				
				
				
			},
			ClassPickerChange:function(e){
				console.log('班级picker发送选择改变，携带值为', e.target.value+"===="+_self.class_dataList[e.target.value] + _self.class_dataIDList[e.target.value]);
				_self.class_id = _self.class_dataIDList[e.target.value];
				_self.class_index = e.target.value;
			},
			statusChange: function(evt) {
				var current = evt.detail.value;
				_self.is_show = current;
			},
			getData(data){
				this.sendRequest({
				    url : this.GetStudentsInfoUrl,
				    method : _self.Method,
				    data : {
						"guid": data.guid,
						"token":data.token,
						"id":data.id,
						"t":Math.random()
					},
				    hideLoading : true,
				    success: (res) => {	
				    	    if(res){
								//子公司
								var data = res.subcompanylist;													
								let list = [];
								let idlist = [];
								list.push("==请选择所属机构==");
								idlist.push(0);
								for (var i = 0; i < data.length; i++) {
									var item = data[i];									
									list.push(item.com_name);
									idlist.push(item.com_id);
								}								
								_self.cList = list;
								_self.cIDList = idlist;
								if(_self.uid == 0) _self.cindex = 0;
								
				    	    	var data = res.studentslist; 
								var schoollist = res.schoollist;
								list = [];
								idlist = [];
								list.push("==请选择学校==");
								idlist.push(0);
								for (var i = 0; i < schoollist.length; i++) {
									var item = schoollist[i];
									list.push(item.school_name);
									idlist.push(item.school_id);
								}								
								_self.school_dataList = list;
								_self.school_dataIDList = idlist;
								if(_self.uid == 0)	_self.school_index = 0;
								
								var gradelist = res.gradelist;
								list = [];
								idlist = [];
								list.push("==请选择年级==");
								idlist.push(0);
								for (var i = 0; i < gradelist.length; i++) {
									var item = gradelist[i];
									list.push(item.grade_name);
									idlist.push(item.grade_id);
								}								
								_self.grade_dataList = list;
								_self.grade_dataIDList = idlist;
								if(_self.uid == 0)	_self.grade_index = 0;
								
								var classlist = res.classlist;
								list = [];
								idlist = [];
								list.push("==请选择班级==");
								idlist.push(0);
								for (var i = 0; i < classlist.length; i++) {
									var item = classlist[i];
									list.push(item.class_name);
									idlist.push(item.class_id);
								}								
								_self.class_dataList = list;
								_self.class_dataIDList = idlist;
								if(_self.uid == 0)	_self.class_index = 0;
								
				    			if(parseInt(res.status) == 3){
				    				_self.uname = data.uname;
									_self.sex = data.sex;
									_self.teacher = data.teacher;
									
									
									var birthday1 = data.birthday;
									if(birthday1 == '1970-01-01'){
										birthday1 = '';
									}
									
									_self.birthday = birthday1;
									
									_self.mparent = data.mparent;
									_self.mtel = data.mtel;
									_self.memo = data.memo;
									_self.fan_jkou = data.fan_jkou;
									
									
									_self.school_id = data.school_id;
									let j = _self.school_dataIDList.findIndex(i => i == _self.school_id);
									_self.school_index = j;
									
									_self.grade_id = data.grade_id;
									j = _self.grade_dataIDList.findIndex(i => i == _self.grade_id);
									_self.grade_index = j;
									
									_self.class_id = data.class_id;
									j = _self.class_dataIDList.findIndex(i => i == _self.class_id);
									_self.class_index = j;
									
									_self.com_id = data.com_id;
									j = _self.cIDList.findIndex(i => i == _self.com_id);
									_self.cindex = j;
				    			}						
								
				    	    }
				    	}
				    
				},"1","");				
			},
			sexChange: function(evt) {
				var current = evt.detail.value;
				_self.sex = current;	
			},
			show(){	
				//if(_self.uid == 0 ) return;
				let ret = _self.getUserInfo();
				if(!ret){
					return false;
				}
				const data = {
				    guid: ret.guid,
				    token: ret.token,
					id:_self.uid
				};
				_self.getData(data);
			}
		}
    }
</script>

<style>
	picker{
		height: 60upx;
		width: 100%;
	}
	.button-sp-area{
		position: fixed;
		bottom: 0upx;
		height: 100upx;
		background-color: #fff;
		width: 100%;
	}
	textarea{
		border:1upx solid #eee;
		width: 90%;
		height: 80upx;
		padding: 20upx;
	}
	.form image{
		width:80upx;
		height: 80upx;
	}
	.register_account_input view{
		float: left;
		margin-bottom: 10upx;		
	}	
	.radio_text{
		margin-right: 40upx;
	}
	.content{
		width:90%;
		margin: 0 auto;
		margin-bottom: 120upx;
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
	.class-memo{
		height: auto;
	}
	
</style>
