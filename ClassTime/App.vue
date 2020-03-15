<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');	
			
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
		
	}
</script>

<style>
	.center100{
		width:100%;			
		margin: 0 auto;
	}
	/*每个页面公共css */
	.footer{
		margin-top: 50upx;
		height: 90upx;
	}
	.main{
		width:100%;		
		margin-top: 60upx;
		background-color:#eeeeee;
	}
	.main>view{
		background-color: #fff;
	}
	.icenter{
		width: 96%;
		margin: 0 auto;
		overflow: hidden;
		z-index: 1000;
	}
	.icenter .title{
		margin-top: 20upx;
	}
	.main_content{
	    width: 100%;
	}
	.clear{
		clear: both;
	}
	.bgcolor{
		background-color: #eeeeee;
	}
	.bg{
		background-color: #fff;
	}
	.fz30{
		font-size: 30upx;
	}
</style>
