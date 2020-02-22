<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="register_account">年级信息</view>
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
				<m-input class="m-input" type="text" clearable focus v-model="grade_name" placeholder="填写年级名"></m-input>
			</view>				
			
			<view class="register_account_input">
				<m-input class="m-input" type="text" clearable v-model="grade_order" placeholder="填写顺序"></m-input>
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
			_self.checkLogin(2);
			_self.grade_id = options['id'];
			if(_self.grade_id == undefined){
				_self.grade_id = 0;
			}
			if(_self.grade_id == 0){
				_self.btntxt = '添加'
				_self.headermsg = "添加新年级,grade Add";
			}else{
				_self.btntxt="修改";
				_self.headermsg = "年级编辑,grade Edit";
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
				
				school_id:0,
				school_index:0,
				school_dataList:[],
				school_dataIDList:[],
				
				headermsg:'',
				btntxt:''
			}
		},
		methods:{
			SchoolPickerChange:function(e){
				console.log('学校picker发送选择改变，携带值为', e.target.value+"===="+_self.school_dataList[e.target.value] + _self.school_dataIDList[e.target.value]);
				var school_id = _self.school_dataIDList[e.target.value];
				_self.school_id = school_id;
				_self.school_index = e.target.value;
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
					    title: '年级名称必须是填写'
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
							"school_id":_self.school_id,
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
				       				str = '年级名已经存在';
				       				break;
				       			}
				       			case 3:{
									if(_self.grade_id == 0){
										_self.grade_id = 0;
										_self.com_id = 0;
										 _self.grade_name = '';
										_self.grade_order = '';
										_self.school_id = '';
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
				_self.getData(data);
			},
			getData(data){			
				this.sendRequest({
				    url : this.GetGradeInfoUrl,
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
								if(_self.grade_id == 0) _self.cindex = 0;
								
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
								
								
								var data = res.gradelist; 
				    			if(parseInt(res.status) == 3){
				    				_self.grade_name = data.grade_name;
				    				_self.grade_order = data.grade_order.toString();									
									
									_self.com_id = data.com_id;
									let j = _self.cIDList.findIndex(i => i == _self.com_id);
									_self.cindex = j;
									
									_self.school_id = data.school_id;
									j = _self.school_dataIDList.findIndex(i => i == _self.school_id);
									_self.school_index = j;
									
				    			}
								
				    	    }
				    	}
				    
				},"1","");				
			}
		}
    }
</script>

<style>
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
	
	
</style>