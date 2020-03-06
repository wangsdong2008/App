<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="register_account">在线报名</view>
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
			        联系人
			    </view>
				<view class="cell-right">
					<m-input class="m-input" type="text" clearable  v-model="true_name" placeholder="联系人"></m-input>	
				</view>
			</view>
			<view class="register_account_input">
			    <view class="uni-list-cell-left">
			        联系方式
			    </view>
				<view class="cell-right">
					<m-input class="m-input" type="text" clearable  v-model="tel" placeholder="联系方式"></m-input>	
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
			_self.headermsg = "在线报名";
			_self.course_id = options['cid'];
			_self.pid = options['pid'];
			_self.comid = options['comid'];
			if(_self.course_id == 0 || _self.course_id == undefined){
				_self.navigateTo("/pages/parents/site/index");
				return;
			}
			
		},
		onReady(){
			_self.show();
		},
		data(){
			return{
				headermsg:'',
				btntxt:'报名',
				is_show:'1',
				
				child_id:0,	
				child_index:0,
				child_dataList:[],
				child_dataIDList:[],
				
				course_id:0, //课程id
				pid:0, //存放uid
				comid:0, //企业id
				
				true_name:'',//联系人
				tel:'',//联系电话					
				
			}
		},
		methods:{			
			show(){			  
				let ret = _self.getUserInfo();
				if(!ret){
					return false;
				}
				const data = {
				    guid: ret.guid,
				    token: ret.token
				};
				_self.tel = ret.mobile;
				_self.true_name = ret.true_name;
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
							   list.push("==请选择孩子==");
							   idlist.push(0);
							   for (var i = 0; i < childlist.length; i++) {
									var item = childlist[i];
									list.push(item.child_name);
									idlist.push(item.child_id);
							   }								
							   _self.child_dataList = list;
							   _self.child_dataIDList = idlist;	
							}
						
				       }
				   },"1","");
			},
			ChildPickerChange: function(e) {
			    console.log('picker发送选择改变，携带值为', e.target.value+"===="+_self.child_dataList[e.target.value] + _self.child_dataIDList[e.target.value]);
				_self.child_id = _self.child_dataIDList[e.target.value];
				_self.child_index = e.target.value;
			},
		
			bindmodify(){
				if(_self.child_id == 0){
					uni.showToast({
					    icon: 'none',
					    title: '请选择孩子'
					});
					return;
				}			    
				
				let ret = _self.getUserInfo();
				if(!ret){
					return false;
				}
				
				_self.sendRequest({
				    url : _self.EnlistBiomingUrl,
				    method : _self.Method,
				    data : {
						"guid": ret.guid,
						"token": ret.token,
						"child_id": _self.child_id,
						
						
						"pid": _self.pid,						
						"course_id":_self.course_id,
						"com_id":_self.comid,
						"true_name":_self.true_name,
						"tel":_self.tel,
						"child_id":_self.child_id,
						
						
						"t":Math.random()
					},
				    hideLoading : false,
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
								str = '已经报名';
								break;
							}
							case 3:{								
								str = '报名成功';
								break;
							}												
						}
						uni.showToast({
							title: str,
							icon: 'none',
							duration:2000
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
		border-radius: 50upx;		
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
		border-bottom: 1upx solid #66ccff;
		padding-bottom: 20upx;
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