<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="register_account">学校信息</view>
			<view class="register_account_input">				
				<m-input class="m-input" type="text" clearable focus v-model="school_name" placeholder="填写学校名"></m-input>
			</view>	
			<view class="register_account_input">
				<m-input class="m-input" type="text" clearable v-model="school_address" placeholder="填写学校地址"></m-input>
			</view>
				<view class="register_account_input">
					<m-input class="m-input" type="text" clearable v-model="school_order" placeholder="填写顺序"></m-input>
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
			this.school_id = options['id'];
			if(this.school_id == undefined){
				this.school_id = 0;
			}
			if(this.school_id == 0){
				this.headermsg = "添加新学校,School Add";
			}else{
				this.headermsg = "学校编辑,School Edit";
			}
		},
		onReady(){
			this.show();
		},
		data(){
			return{
				school_id:0,
				school_name:'',
				school_order:'1',
				school_address:'',
				dataList:[],				
				headermsg:''
			}
		},
		methods:{
			bindmodify(){
				let that = this;
				//debugger;
				if(!service.checkName(that.school_name)){
					uni.showToast({
					    icon: 'none',
					    title: '学校名称必须是中文'
					});
					return;
				}
				let ret = uni.getStorageSync(this.USERS_KEY);
				if(!ret){
					return false;
				}
				uni.request({
					url: that.UpdateSchoolInfoUrl,
					header: {
				        "Content-Type": "application/x-www-form-urlencoded"							 
				    },
				    data: {
						"guid": ret.guid,
						"token": ret.token,
						"id": this.school_id,
						"name": this.school_name,
						"address": this.school_address,
						"sorder":this.school_order,
						"t":Math.random()
				    },
				    method: "get",
					success: (res) => {
						let status = res.data.status;
						let str = '';
						switch(status){
							case 0:{
								str = '数据填写错误';
								break;
							}
							case 2:{
								str = '学校名已经存在';
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
							this.navigateTo('school');
						}
					}
			    });				
			},
			show(){	
				if(this.school_id == 0 ) return;
				let ret = uni.getStorageSync(this.USERS_KEY);
				if(!ret){
					return false;
				}
				const data = {
				    guid: ret.guid,
				    token: ret.token,
					id:this.school_id
				};
				this.getData(data);
			},
			getData(data){
				uni.request({
					url: this.GetSchoolInfoUrl,
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
						    	var data = res.data.schoollist; 
								if(parseInt(res.data.status) == 3){
									this.school_name = data.school_name;
									this.school_address = data.school_address;
									this.school_order = data.school_order.toString();
								}
								else{
									uni.showToast({
										title: '无数据为空',
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