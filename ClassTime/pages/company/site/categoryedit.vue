<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="register_account">分类信息</view>
			<view class="register_account_input">				
				<m-input class="m-input" type="text" clearable focus v-model="cat_name" placeholder="填写分类名"></m-input>
			</view>
			<view class="register_account_input">
				<picker @change="pickerCompanyChange($event)" :value="cindex" :range="cList">
					<view class="uni-input">{{cList[cindex]}}</view>
				</picker>
			</view>
			<view class="textareainput">
				<textarea class="textarea" v-model="cat_content" placeholder="请填写课程介绍" auto-height="true" ></textarea>
			</view>
			<view class="register_account_input">
				<m-input class="m-input" type="text" clearable v-model="cat_order" placeholder="填写顺序"></m-input>
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
			_self.cat_id = options['id'];
			if(_self.cat_id == undefined){
				_self.cat_id = 0;
			}
			if(_self.cat_id == 0){
				_self.headermsg = "添加新分类,Category Add";
			}else{
				_self.headermsg = "分类编辑,Category Edit";
			}
		},
		onReady(){
			_self.show();
		},
		data(){
			return{
				cat_id:0,
				cat_name:'',
				cat_order:'',	
				cat_content:'',
				dataList:[],
				headermsg:'',
				cindex:0,
				com_id:0,
				cList:[],
				cIDList:[],
				btntxt:''
			}
		},
		methods:{
			pickerCompanyChange:function(e){
				console.log('picker发送选择改变，携带值为', e.target.value+"===="+_self.cList[e.target.value] + _self.cIDList[e.target.value]);
				_self.com_id = _self.cIDList[e.target.value];
				_self.cindex = e.target.value; 
			},
			bindmodify(){
				if(!service.checkNull(_self.cat_name)){
					uni.showToast({
					    icon: 'none',
					    title: '分类名称不能为空'
					});
					return;
				}
				if(_self.com_id == 0){
					uni.showToast({
					    icon: 'none',
					    title: '请选择公司'
					});
					return;
				}
				if(!service.checkNum(_self.cat_order)){
					uni.showToast({
					    icon: 'none',
					    title: '请填写顺序'
					});
					return;
				}
				let ret = this.getUserInfo();
				if(!ret){
					return false;
				}
				this.sendRequest({
				        url : this.UpdateCategoryInfoUrl,
				        method : "post",
				        data : {
							"guid": ret.guid,
							"token": ret.token,
							"id": _self.cat_id,
							"name": _self.cat_name,
							"content": _self.cat_content,
							"sorder":_self.cat_order,
							"comid":_self.com_id,
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
				        				str = '分类名已经存在';
				        				break;
				        			}
				        			case 3:{
				        				if(_self.cat_id == 0){
				        					str = '添加成功';
				        					_self.cat_id = 0;
				        					_self.cat_name = '';
				        					_self.cat_order = '';	
				        					_self.cat_content = '';
				        					_self.cindex = 0;
				        					_self.com_id = 0;
				        					_self.cList = array();
				        					_self.cIDList = array();
				        				}
				        				else{
				        					
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
											_self.navigateTo('category');
										} else if (res.cancel) {
											_self.navigateTo('categoryedit?id='+_self.cat_id);
										}
									}
								});
				        	}
				        
				    },"1","");		
			},
			show(){
				//if(_self.cat_id == 0 ) return;  //考虑添加功能,允许等于0
				let ret = this.getUserInfo();
				if(!ret){
					return false;
				}
				const data = {
				    guid: ret.guid,
				    token: ret.token,
					id:_self.cat_id
				};
				if(_self.cat_id == 0) _self.btntxt="添加"; else _self.btntxt = '修改';
				_self.getData(data);
			},
			getData(data){			
					this.sendRequest({
				        url : this.GetCategoryInfoUrl,
				        method : "post",
				        data : {
							"guid": data.guid,
							"token":data.token,
							"id":data.id,
							"comid":data.comid,
							"t":Math.random()
						},
				        hideLoading : true,
				        success: (res) => {
				        	    if(res){
				        			//debugger;
				        			
				        	    	var data = res.subcompanylist; 
				        			if(parseInt(res.status) == 3){									
				        				let list = [];
				        				let idlist = [];
				        				list.push("==请选择==");
				        				idlist.push(0);
				        				for (var i = 0; i < data.length; i++) {
				        					var item = data[i];									
				        					list.push(item.com_name);
				        					idlist.push(item.com_id);
				        				}								
				        				_self.cList = list;
				        				_self.cIDList = idlist;
				        				
				        				if(_self.cat_id > 0){
				        					data = res.categorylist;									
				        					_self.cat_name = data.cat_name;									
				        					_self.cat_order = data.cat_order.toString();
				        					_self.cat_content = data.cat_content;
				        					_self.com_id = data.com_id;
				        					if(_self.cIDList != undefined){
				        						_self.cindex = _self.cIDList.findIndex(i => i == data.com_id);
				        					}
				        				}
				        			}
				        			else{
				        				uni.showToast({
				        					title: '无数据为空',
				        					icon: 'none',
				        				});		
				        				
				        			}
				        	    }
				        	}
				        
				    },"1","");	
			}
		}
    }
</script>

<style>
	.textareainput{
		padding: 20upx 0upx;
		border-bottom: 1px solid #eeeeee;
		line-height: 28px;
	}
	.textarea{
	  border: 1rpx solid #eeeeee;
	  min-height: 220upx;
	  padding:10upx
	}
	.content{
		width:96%;
		margin: 0 auto;
	}
	
	.clear{
		clear: both;
	}
	
	.btn-row{
		margin: 40upx 0upx;	
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