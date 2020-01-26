<template>
	<view class="header-title">
	    <view class="login_center login_title_txt">{{name}}<br /><span>{{en_name}}</span></view>
	</view>	
</template>

<script>
	export default {
		props:{
			msg: String
		},
		data() {
			return {
				msgarr:'',
				name:'',
				en_name:''
			}
		},
		created:function(){
			this.msgarr = this.msg;
			uni.hideTabBar({});	
			this.init();
			//console.log(this.msg);
		},	
		methods:{
			init(){
				let arr = this.msgarr.split(",");
				this.name = arr[0];
				this.en_name = arr[1];
			}
		}
	}
</script>

<style>
	.header-title{
		background:url('../../static/img/login_title.png') #ffffff center 0 no-repeat;
	    background-size:100% 100%;
	    padding-bottom:20%
	}
	.login_center{
		width:85%;			
		margin: 0 auto;
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
