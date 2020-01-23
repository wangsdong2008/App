<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="register_account">孩子管理</view>
			<view class="register_account_input">				
				<m-input class="m-input" type="text" clearable focus v-model="child_name" placeholder="填写孩子名"></m-input>
			</view>
			<view class="register_account_input">				
				<radio-group @change="sexChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in sex_items" :key="item.value">
					<view>
						<radio class="radios" :value="item.value" :checked="parseInt(item.value) === sex" />
					</view>
					<view class="radio_text">{{item.name}}</view>
					</label>
					
				</radio-group>
			</view>
			<view class="register_account_input">
				<m-input class="m-input" type="text" clearable v-model="child_order" placeholder="填写顺序"></m-input>
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
	export default {
	    components: {
			service,
			headerNav,
			mInput
		},
		onLoad(options){
			this.checkLogin();
			this.child_id = options['id'];
			if(this.child_id == undefined){
				this.child_id = 0;
			}
			if(this.child_id == 0){
				this.headermsg = "添加孩子,Children Add";
			}else{
				this.headermsg = "孩子编辑,Children Edit";
			}
		},
		onReady(){
			this.show();
		},
		data(){
			return{
				child_id:0,
				child_order:'1',		
				headermsg:'',
				child_name:'',
				btntxt:'',
				sex:'1',
				is_show:'1',
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
			sexChange: function(evt) {
				var current = evt.detail.value;
				this.sex = current;	
			},
			radioChange: function(evt) {
				var current = evt.detail.value;
				this.is_show = current;	
			},
			bindmodify(){
				//debugger;
				let that = this;
				if(!service.checkNull(that.child_name)){
					uni.showToast({
					    icon: 'none',
					    title: '孩子名不能为空'
					});
					return;
				}				
				let ret = uni.getStorageSync(this.USERS_KEY);
				if(!ret){
					return false;
				}
				uni.request({
					url: that.ModifyChildrenUrl,
					header: {
				        "Content-Type": "application/x-www-form-urlencoded"							 
				    },
				    data: {
						"guid": ret.guid,
						"token": ret.token,
						"id": this.child_id,
						"childname": this.child_name,
						"childorder":this.child_order,
						"is_show":this.is_show,
						"sex":this.sex,
						"t":Math.random()
				    },
				    method: "get",
					success: (res) => {
						//debugger;
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
								str = '修改成功';
								break;
							}							
						}
						
						uni.showToast({
							title: str,
							icon: 'none',
							duration:2000
						});	
						if(status == 3){
							this.navigateTo('child');
						}
					}
			    });	
			
			},
			show(){
				//if(this.child_id == 0 ) return;  //考虑添加功能,允许等于0
				let ret = uni.getStorageSync(this.USERS_KEY);
				if(!ret){
					return false;
				}
				const data = {
				    guid: ret.guid,
				    token: ret.token,
					id:this.child_id
				};
				if(this.child_id == 0) this.btntxt="添加"; else this.btntxt = '修改';
				if(this.child_id > 0){
					this.getData(data);
				}
			},
			getData(data){
				uni.request({
					url: this.ShowChildrenUrl,
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
							   	//debugger;
								var data = res.data.list; 
								if(parseInt(res.data.status)==3){
									this.child_name = data.child_name;
									this.is_show = data.is_show;
									this.child_order = data.child_order.toString();
									this.sex = data.sex;
								}else{
									uni.showToast({
										title: '无数据',
										icon: 'none',
									});
								}
							}
						}
					})
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