<template>
	<view class="main_content">
		<view class="h500 content">
		</view>
		<view class="center-body write main-body">
			我的消息
		</view>
		
	
		
		
		<view class="footer">
			<footerNav :msg="footer"></footerNav>
		</view>
	</view>
</template>

<script>
	import service from '../../../service.js';
	import footerNav from "@/components/footer/footer_nav.vue"
	
	var _self;
	
	export default {
	    components: {			
			footerNav
		},
		onNavigationBarButtonTap(e) {
			_self.bindsearch();
		},		
		onNavigationBarSearchInputChanged (e) {
		    //console.log("你在搜索框中输入了信息"+e.text);
			_self.course_name = e.text;
		},
		onLoad(options){
			_self = this;
			this.checkLogin(0);
		},
		onReady() {
			this.show();
		},
		data(){
			return{	
				message_time:'',
				footer:"",
				course_name:'',
				longitude:0,
				latitude:0
			}
		},
		methods:{
			show(){
				let ret = this.getUserInfo();
				const data = {
				    guid: ret.guid,
				    token: ret.token,
					id:_self.message_id
				};
				//获取经纬度
				uni.getLocation({
				  // 默认为 wgs84 返回 gps 坐标，
				  // gcj02 返回国测局坐标，可用于 uni.openLocation 的坐标
				  type: 'wgs84',
				  geocode: true,
				  success: (data) => {
				    this.longitude = data.longitude;
					this.latitude = data.latitude;
				  },
				  fail: (err) => {
				    console.log(err)
				    // this.$api.msg('获取定位失败');
				  }
				});
			},
			bindsearch(){
				if(!service.checkNull(this.course_name)){
					uni.showToast({
					    icon: 'none',
					    title: '课程不能为空'
					});
					return;
				}
				this.navigateTo('/pages/index/index/searchresult?keyword='+this.course_name+"&longitude="+this.longitude+"&latitude="+this.latitude);
			}		
		}
	}
		
</script>

<style>	
	.times{
		padding: 20upx 0upx;
		font-size: 25upx;
		text-align: left;
	}
	.ll{
		width: 90%;
		margin: 0 auto;
	}
	.title{
		padding-bottom: 20upx;
		border-bottom:1px solid #66ccff;
		font-size: 35upx;
	}
	.content{
		padding-top: 40upx;
		font-size: 30upx;
		line-height: 50upx;
	}
	.uni-pagination{
		width: 100%;
		margin: 0 auto;
	}
	.example-body {
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 0;
		font-size: 14rpx;
		background-color: #ffffff;
		margin-bottom: 120upx;
	}	
	.lists{
		/* height: 350upx; */
		padding:40upx 0upx;
	}
	.gemmologist-name{
		display: block;
		/* border:1px solid #FF0; */
		height: 45upx;
		line-height: 45upx;
		font-size: 25upx;
		
	}
	.grid-item-box{
		/* border: 1px solid #f00; */
		text-align: center;
		height: 165upx;
		margin-top: 25upx;
	}
	.grid-item-box text{
		height: 45upx;
	}
	image.identify-head{
		width: 80upx;
		height: 80upx;
		clear: both;
		/* border:1px solid #f00; */
	}
	.main_content{
		background-color: #eaeaea;
	}
	.header_title{
		/* border:#f00 solid 1upx; */
	}
	.header_txt li{
		clear: both;
		color:#fff;		
	}
	.header_txt li image{
		width: 42upx;
		height: 42upx;
		margin-right: 5upx;
	}
	.header_txt li:first-child{		
		vertical-align: top;
		height: 78upx;
		line-height: 78upx;
		font-size: 45upx;
	}
	.header_txt li:last-child{
		height: 42upx;
		line-height: 42upx;
		font-size: 30upx;
	}
	.imgs {
		height:120upx;
		margin-right: 20upx;
		background-color: #fff;
		border-radius: 80upx;
		width: 130upx;
		height: 130upx;
		text-align: center;
		overflow: hidden;
	}
	.imgs image{
		height: 120upx;
		width: 120upx;
	}
	.h500{
		height: 280upx;
		background-color: #66ccff;
		padding-top: 120upx;
	}
			
	.main-body{
		width: 95%;
		margin: 0 auto;
		overflow: hidden;
	}
	.write{
		background-color: #fff;
		border-radius: 25upx;
		margin-bottom: 20upx;
	}
	.center-body{
		height:120upx;	
		line-height: 120upx;
		margin-top: 20upx;
		font-size: 35upx;		
		padding-left: 80upx;
		overflow: hidden;
		background:url(../../../static/img/message.png) 30upx 40upx no-repeat;
		background-size: 42upx 42upx;
		border-radius: 0upx;
		background-color: #fff;
	}
	
	
	.uni-page-head {
		height:initial;
	}
	
</style>
