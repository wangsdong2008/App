<template>
	<view class="main_content">
		<view class="content">
			<view class="center title">
				<view>学时</view>
				<view class="pinyin">xueshi</view>
			</view>
			<view class="center mainpic">
				<image src="../../../static/img/indeximg.png" mode=""></image>
			</view>
			<view class="center detail">
				轻松掌握<br />孩子每天的学习课程和时间
			</view>
			<view class="center btn" @tap="bindLogin" >
				进入
			</view>
		</view>
	</view>
</template>

<script>
	export default {
	    components: {			
			
		},
		data(){
			return{
				
			}
		},
		methods:{
			bindLogin(){
				let url = "users/login/login";
				let Storage = this.getUserInfo();
				if(Storage != "[]"){
					switch(parseInt(Storage.identity))
					{
						case 1:{
							url = 'parents/parents/index';
							break;
						}
						case 2:{
							url = 'company/company/index';
							break;
						}
						case 3:{
							url = 'teacher/teacher/index';
							break;
						}
					}
				}			
				url = '../../' + url;
				this.navigateTo(url);
			}
		}
	}
</script>

<style>
	.btn{
		border: 1upx #007AFF solid;
		height: 85upx;
		line-height: 85upx;
		width: 490upx;
		margin: 0 auto;
		background-color:#007AFF;
		color:#fff;
		border-radius: 50upx;
	}
	.detail{
		margin-top: 50upx;
		color: #66CCFF;
		margin-bottom: 80upx;
		line-height: 55upx;
	}
	.mainpic{
		margin-top: 70upx;
	}
	.mainpic image{
		width: 556upx;
		height: 466upx;
	}
	.center{
		text-align: center;
		font-family: Verdana, Geneva,Tahoma, sans-serif;
	}
	.title{
		font-size: 120upx;
		color:#058dd9;
		/* width: 240upx;
		border:1upx solid #ccc; */
		margin: 0 auto;
		padding:0 30upx;
		margin-top: 120upx;
	}
	.pinyin{
		font-size: 60upx;
		color:#e08d23;
	}
	.content{
		width:95%;			
		margin: 0 auto;
		/* border:1upx solid #f00;	 */	
	}
	.main_content{
		padding-top: 40upx;
	}
</style>
