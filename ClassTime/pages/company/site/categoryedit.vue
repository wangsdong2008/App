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
	export default {
	    components: {
			service,
			headerNav,
			mInput
		},
		onLoad(options){
			this.checkLogin();
			this.cat_id = options['id'];
			if(this.cat_id == undefined){
				this.cat_id = 0;
			}
			if(this.cat_id == 0){
				this.headermsg = "添加新分类,Category Add";
			}else{
				this.headermsg = "分类编辑,Category Edit";
			}
		},
		onReady(){
			this.show();
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
				console.log('picker发送选择改变，携带值为', e.target.value+"===="+this.cList[e.target.value] + this.cIDList[e.target.value]);
				this.com_id = this.cIDList[e.target.value];
				this.cindex = e.target.value; 
			},
			bindmodify(){
				let that = this;
				//debugger;
				if(!service.checkNull(that.cat_name)){
					uni.showToast({
					    icon: 'none',
					    title: '分类名称不能为空'
					});
					return;
				}
				if(that.com_id == 0){
					uni.showToast({
					    icon: 'none',
					    title: '请选择公司'
					});
					return;
				}
				if(!service.checkNum(that.cat_order)){
					uni.showToast({
					    icon: 'none',
					    title: '请填写顺序'
					});
					return;
				}
				let ret = uni.getStorageSync(this.USERS_KEY);
				if(!ret){
					return false;
				}
				uni.request({
					url: that.UpdateCategoryInfoUrl,
					header: {
				        "Content-Type": "application/x-www-form-urlencoded"							 
				    },
				    data: {
						"guid": ret.guid,
						"token": ret.token,
						"id": this.cat_id,
						"name": this.cat_name,
						"content": this.cat_content,
						"sorder":this.cat_order,
						"comid":this.com_id,
						"t":Math.random()
				    },
				    method: "get",
					success: (res) => {
						//debugger;
						let status = res.data.status;
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
								if(that.cat_id > 0){
									str = '修改成功';
									that.cat_id = 0;
									that.cat_name = '';
									that.cat_order = '';	
									that.cat_content = '';
									that.cindex = 0;
									that.com_id = 0;
									that.cList = array();
									that.cIDList = array();
									this.show();
								}
								else{
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
						/* if(status == 3){
							this.navigateTo('category');
						}*/
					}
			    });	
			
			},
			show(){
				//if(this.cat_id == 0 ) return;  //考虑添加功能,允许等于0
				let ret = uni.getStorageSync(this.USERS_KEY);
				if(!ret){
					return false;
				}
				const data = {
				    guid: ret.guid,
				    token: ret.token,
					id:this.cat_id
				};
				if(this.cat_id == 0) this.btntxt="添加"; else this.btntxt = '修改';
				this.getData(data);
			},
			getData(data){
				uni.request({
					url: this.GetCategoryInfoUrl,
						header: {
					        "Content-Type": "application/x-www-form-urlencoded"							 
					    },
					    data: {
							"guid": data.guid,
							"token":data.token,
							"id":data.id,
							"comid":data.comid,
							"t":Math.random()
					    },
					    method: "get",
						success: (res) => {
						    if(res.data){
								//debugger;
								
						    	var data = res.data.subcompanylist; 
								if(parseInt(res.data.status) == 3){									
									let list = [];
									let idlist = [];
									list.push("==请选择==");
									idlist.push(0);
									for (var i = 0; i < data.length; i++) {
										var item = data[i];									
										list.push(item.com_name);
										idlist.push(item.com_id);
									}								
									this.cList = list;
									this.cIDList = idlist;
									
									if(this.cat_id > 0){
										data = res.data.categorylist;									
										this.cat_name = data.cat_name;									
										this.cat_order = data.cat_order.toString();
										this.cat_content = data.cat_content;
										this.com_id = data.com_id;
										if(this.cIDList != undefined){
											this.cindex = this.cIDList.findIndex(i => i == data.com_id);
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
					})
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