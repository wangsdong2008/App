<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="register_account">公司信息</view>
			<view class="register_account_input">
				<view class="uni-list-cell-left">
				    名称
				</view> 
				<view>
				<m-input class="m-input" type="text" clearable focus v-model="com_name" placeholder="填写公司名"></m-input>
				</view>
			</view>	
			<view class="register_account_input">
				<view class="uni-list-cell-left">
				    电话
				</view> 
				<view>
				<m-input class="m-input" type="text" clearable v-model="com_tel" placeholder="填写公司电话"></m-input>
				</view>
			</view>
			<view class="register_account_input">
				<view class="uni-list-cell-left">
				    地址
				</view> 
				<view>
					<m-input class="m-input" type="text" clearable v-model="com_address" placeholder="填写公司地址"></m-input>
				</view>
			</view>
			<view class="register_account_input">
				<view class="uni-list-cell-left">
				    顺序
				</view> 
				<view>
					<m-input class="m-input" type="text" clearable v-model="com_order" placeholder="填写顺序"></m-input>
				</view>
			</view>
			<view class="register_account_input">
			    <view class="uni-list-cell-left">
			        使用位置
			    </view>     
				<radio-group @change="radioChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in items" :key="item.value">
					<view>
						<radio class="radios" :value="item.value" :checked="parseInt(item.value) === gps_status" />
					</view>
					<view class="radio_text">{{item.name}}</view>
					</label>
				</radio-group>	
			</view>		
			
			<view class="register_account_input">
			    <view class="uni-list-cell-left">
			        开启托班
			    </view>     
				<radio-group @change="wtradioChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item2, index2) in wt_items" :index="index2" :key="item2.value">
					<view>
						<radio class="radios" :value="item2.value" :checked="parseInt(item2.value) == _self.wt_status" />
					</view>
					<view class="radio_text">{{item2.name}}</view>
					</label>
				</radio-group>	
			</view>	
			<view class="btn-row">
			    <button type="primary" class="primary" @tap="bindmodify">修改</button>
			</view>			
			
				
			</view>
		</view>
	</view>
</template>
<script>
	import service from '../../../service.js';
	import mInput from '@/components/m-input.vue';
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
			_self.com_id = options['id'];
			if(_self.com_id == undefined){
				_self.com_id = 0;
			}
			if(_self.com_id == 0){
				_self.headermsg = "添加新公司,Company Add";
			}else{
				_self.headermsg = "公司编辑,Company Edit";
			}
		},
		onReady(){
			_self.show();
		},
		data(){
			return{
				com_id:0,
				com_name:'',
				com_order:'',
				com_address:'',
				com_tel:'',
				dataList:[],				
				headermsg:'',
				gps_status:0,
				gps_x:0,
				gps_y:0,
				items: [
					{
						value: '1',
						name: '启用'
					},
					{
						value: '0',
						name: '不启用'
					}
				],
				wt_status:0,
				wt_items: [
					{
						value: '1',
						name: '开启'
					},
					{
						value: '0',
						name: '禁用'
					}
				]
			}
		},
		methods:{
			wtradioChange: function(evt) {
				var current = evt.detail.value;
				_self.wt_status = current;
			},
			radioChange: function(evt) {
				var current = evt.detail.value;
				_self.gps_status = current;
				if(current == 1){
					uni.getLocation({
					  // 默认为 wgs84 返回 gps 坐标，
					  // gcj02 返回国测局坐标，可用于 uni.openLocation 的坐标
					  type: 'wgs84',
					  geocode: true,
					  success: (data) => {					    
						_self.gps_x = data.latitude;
						_self.gps_y = data.longitude;
					  },
					  fail: (err) => {
					    console.log(err)
					    // _self.$api.msg('获取定位失败');
					  }
					});
				}
			},
			bindmodify(){
				let that = _self;
				//debugger;
				if(!service.checkName(that.com_name)){
					uni.showToast({
					    icon: 'none',
					    title: '公司名称必须是中文'
					});
					return;
				}
				if(!service.checkNum(that.gps_status)){
					uni.showToast({
					    icon: 'none',
					    title: '请选择是否使用定位'
					});
					return;
				}
				let ret = this.getUserInfo();
				if(!ret){
					return false;
				}
				this.sendRequest({
				        url : this.UpdateCompanyInfoUrl,
				        method : _self.Method,
				        data : {
							"guid": ret.guid,
							"token": ret.token,
							"id": _self.com_id,
							"name": _self.com_name,
							"address": _self.com_address,
							"sorder":_self.com_order,
							"tel":_self.com_tel,
							"gps_status":_self.gps_status,
							"gps_x":_self.gps_x,
							"gps_y":_self.gps_y,
							"wt_status":_self.wt_status,
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
				        				str = '公司名已经存在';
				        				break;
				        			}
				        			case 3:{
				        				str = '修改成功';
				        				
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
				        					_self.navigateTo('company');
				        		        } else if (res.cancel) {
				        		            _self.navigateTo('companyedit?id='+_self.com_id);
				        		        }
				        		    }
				        		});
				        		
				        	}
				        
				    },"1","");	
						
			},
			show(){	
				if(_self.com_id == 0 ) return;
				let ret = uni.getStorageSync(_self.USERS_KEY);
				if(!ret){
					return false;
				}
				const data = {
				    guid: ret.guid,
				    token: ret.token,
					id:_self.com_id
				};
				_self.getData(data);
			},
			getData(data){
					this.sendRequest({
				        url : this.GetCompanyInfoUrl,
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
				        	    	var data = res.companylist; 
				        			if(parseInt(res.status) == 3){
				        				_self.com_name = data.com_name;
				        				_self.com_address = data.com_address;
				        				_self.com_tel = data.com_tel;
				        				_self.com_order = data.com_order.toString();
				        				_self.gps_status = data.gps_status;
				        				_self.gps_x = data.latitude;
				        				_self.gps_y = data.longitude;
										_self.wt_status = data.wt_status;
				        			}
				        	    }
				        	}
				        
				    },"1","");	
				
			}
		}
    }
</script>

<style>
	.m-input{
		border: 0upx;
		font-size: 28upx;	
		width: 70%;
		border: 1upx solid #66ccff;
	}
	.uni-list-cell-left{
		margin-right: 40upx;
		float: left;
	}
	.radio_text{
		margin-right: 40upx;
	}
	.uni-list-cell-pd view{
		width: auto;
		float: left;
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