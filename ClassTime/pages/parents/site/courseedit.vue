<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="register_account">课程管理</view>
			<view class="register_account_input">				
				<m-input class="m-input" type="text" clearable focus v-model="c_name" placeholder="填写课程名"></m-input>
			</view>
			<view class="register_account_input">				
				<m-input class="m-input" type="text" clearable focus v-model="organname" placeholder="填写机构名"></m-input>
			</view>
			<view class="register_account_input">				
				<m-input class="m-input" type="text" clearable focus v-model="c_address" placeholder="机构地点"></m-input>
			</view>
			<view class="register_account_input">
				<m-input class="m-input" type="text" clearable v-model="c_order" placeholder="填写顺序"></m-input>
			</view>
			<view class="register_account_input form">
				<radio-group @change="radioChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in items" :key="item.value">
					<view>
						<radio class="radios" :value="item.value" :checked="parseInt(item.value) === is_show" />
					</view>
					<view class="radio_text">{{item.name}}</view>
					</label>
					
				</radio-group>	
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
			_self.c_id = options['id'];
			if(_self.c_id == undefined){
				_self.c_id = 0;
			}
			if(_self.c_id == 0){
				_self.headermsg = "添加课程,Course Add";
			}else{
				_self.headermsg = "课程编辑,Course Edit";
			}
		},
		onReady(){
			_self.show();
		},
		data(){
			return{
				c_id:0,
				c_order:'',		
				headermsg:'',
				c_name:'',
				organname:'',
				c_address:'',
				btntxt:'',
				is_show:1,
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
			radioChange: function(evt) {
				var current = evt.detail.value;
				_self.is_show = current;	
			},
			bindmodify(){				
				if(!service.checkNull(_self.c_name)){
					uni.showToast({
					    icon: 'none',
					    title: '课程名称不能为空'
					});
					return;
				}
				/* if(!service.checkNull(_self.organname)){
					uni.showToast({
					    icon: 'none',
					    title: '机构名不能为空'
					});
					return;
				} */
				if(_self.c_order == "" || _self.c_order == undefined){
					_self.c_order = 1;
				}else{
					if(!service.checkNum(_self.c_order)){
						uni.showToast({
							icon: 'none',
							title: '顺序请填写数字'
						});
						return;
					}
				}
				let ret = _self.getUserInfo();
				if(!ret){
					return false;
				}
				_self.sendRequest({
				       url : _self.ModifyOrganUrl,
				       method : "post",
				       data : {
							"guid": ret.guid,
							"token": ret.token,
							"id": _self.c_id,
							"c_name": _self.c_name,
							"organname":_self.organname,
							"c_address": _self.c_address,
							"c_order":_self.c_order,
							"is_show":_self.is_show,
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
									if(_self.c_id > 0){
										str = '修改成功';
									}else{
										_self.c_id = 0;	
										_self.c_order = '';	
										_self.headermsg = '';	
										_self.c_name = '';	
										_self.organname = '';	
										_self.c_address = '';	
										_self.btntxt = '';
										_self.is_show = 1;
										str = '添加成功';
									}
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
			},
			show(){
				//if(_self.c_id == 0 ) return;  //考虑添加功能,允许等于0
				let ret = _self.getUserInfo();
				if(!ret){
					return false;
				}
				const data = {
				    guid: ret.guid,
				    token: ret.token,
					id:_self.c_id
				};
				if(_self.c_id == 0) _self.btntxt="添加"; else _self.btntxt = '修改';
				_self.getData(data);
			},
			getData(data){
				this.sendRequest({
				       url : this.OrganUrl,
				       method : "post",
				       data : {
							"guid": data.guid,
							"token":data.token,
							"id":data.id,
							"t":Math.random()
						},
				       hideLoading : true,
				       success:function (res) {
							if(res){
								var data = res.list;
								if(parseInt(res.status) == 3){
									_self.c_name = data.c_name;
									_self.organname = data.organname;
									_self.c_address = data.c_address;
									_self.is_show = data.is_show;
									_self.c_order = data.c_order.toString();
								}
							}
				       }
				   },"1","");
			}
		}
    }
</script>

<style>
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