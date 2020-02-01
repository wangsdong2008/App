<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			
			//以下是自动升级代码
			// #ifdef APP-PLUS  
			plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {  
			   uni.request({  
			       url: 'http://www.example.com/static/UNI3FB3BF0.wgt',  
			       data: {  
			           version: widgetInfo.version,
			           name: widgetInfo.name  
			       },  
			       success: (result) => {  
			           var data = result.data;  
			           if (data.update && data.wgtUrl) {  
			               uni.downloadFile({  
			                   url: data.wgtUrl,  
			                   success: (downloadResult) => {  
			                       if (downloadResult.statusCode === 200) {  
			                           plus.runtime.install(downloadResult.tempFilePath, {  
			                               force: false  
			                           }, function() {  
			                               console.log('install success...');  
			                               plus.runtime.restart();  
			                           }, function(e) {  
			                               console.error('install fail...');  
			                           });  
			                       }  
			                   }  
			               });  
			           }  
			       }  
			   });  
			});  
			// #endif  
			
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
</style>
