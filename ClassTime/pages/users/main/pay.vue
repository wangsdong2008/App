<template>
	<view class="main_content">
		<view class="h500 content">
			<view class="main-body header">
				<ul>
					<li class="imgs"><image class="headimgsize" :src="childface" mode=""></image></li>
					<li class="header_title">
						<ul class="header_txt">
							<li>{{userinfo.nick_name}}</li>
							<li>{{userinfo.user_identity == 2?'机构':'家长'}}</li>
						</ul>
					</li>
				</ul>
				<view class="clear"></view>
			</view>			
		</view>
		<view class="main-body write lists">
			<ul>
				<li>个人信息</li>
				<li class="li30">
					<view class="uni-list-cell-left">
					    有效期
					</view>
					<view class="cell-right">
						{{userinfo.endtime}}
					</view>
				</li>				
			</ul>
		</view>
		
		<view class="main-body write lists2">
			<ul>
				<li>续费</li>
				<li class="li30 grids">
					<uni-grid :column="4" :show-border="true" @change="even">
					    <uni-grid-item v-for="(item, index) in dataList" :index="index" :key="index">
							<view :class="{
								'grid-item-box':true,
								'active':item.activer
							}">
								<text class="gemmologist-title">{{item.c_month}}个月</text>
								<text class="gemmologist-name">￥{{item.c_price}}</text>
							</view>
					    </uni-grid-item>
					</uni-grid>
				</li>				
			</ul>
		</view>
		
		<view class="main-body write lists2">
			<ul>
				<li>支付方式</li>
				<li class="li40 wx" @tap="bindpay(1)">微信</li>		
				<li class="li40 alipay" @tap="bindpay(2)">支付宝</li>				
			</ul>
		</view>		
	</view>
</template>

<script>
	import mInput from '../../../components/m-input.vue'
	import footerNav from "@/components/footer/footer_nav.vue"
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	
	var _self;
	
	export default {
	    components: {			
			mInput,footerNav,uniGrid,uniGridItem
		},
		onLoad(){
			_self = this;
			_self.checkLogin();
		},
		onReady() {
			_self.show();
		},
		data(){
			return{
				userinfo:[],
				dataList:[],
				nick_name:'',
				starttime:'',
				endtime:'',
				childface:'',
				user_identity:0,
				num:0
			}
		},
		methods:{
			bindpay(id){
				let payid = id;
				let nums = _self.num;
				var url = '';
				switch(payid){
					case 1:{
						url = '../pay/wxpay';
						break;
					}
					case 2:{
						url = '../pay/alipay';
						break;
					}
				}
				//_self.navigateTo(url);
				let ret = this.getUserInfo();
				if(!ret){
					return;
				}
				
				//待完成支付功能
			/* 	let orderInfo = 'app_id=2016091654625569&biz_content=shike&charset=utf-8&method=alipay.trade.app.pay&notify_url=http%3A%2F%2F112.74.68.252%3A9200%2Fcssd%2Fapi%2Falipay_notify&out_trade_no=2019052456194799&product_code=QUICK_MSECURITY_PAY&sign_type=RSA2&subject=LV%E5%8C%85%E5%A5%B3%E6%80%A7%E5%A5%A2%E4%BE%88%E5%8C%85&timestamp=2019-05-24+16%3A32%3A27&total_amount=1770.0&version=1.0&sign=R5dwr0XAX42jocM86fIZFTIX5HzzE4U2xBvhU5qWo8hjAO%2F%2FNH4u3XF%2FeCjxtXOVPRTUgPGMbkPBj1pDA2QMmdZk55nBhjb%2FJ0H9kmBFPBek7AwuANZNbU3Lc0keMGxlxJDAadzgaMckiuNXLSkHDAPeI7glR7Yx86FVyqM88V9bEHjIY7e5kfS7f2phU8VmJrAdda32aW49ETgmBMtxPzo1DmzP8r7ovqFu9IAl7MDXYlsUUR4z9%2B9puEtZUe81QI895HD%2FnKN5JiwKhTAcsOXar752NI1j7rJlp%2BVrqejjuXXfvxFmMkWNUXjXWKPGgbQf7uiRJhgfuJp5mJzsEA%3D%3D'
				uni.requestPayment({
					provider: 'alipay',
					orderInfo: orderInfo, 
					success: function (res) {
						
						console.log('success:' + JSON.stringify(res));
					},
					fail: function (err) {
						console.log('fail:' + JSON.stringify(err));
					}
				})
				 */
				//let service="mobile.securitypay.pay"&partner="2088801273866834"&_input_charset="UTF-8"&out_trade_no="20200217152818"&subject="DCloud项目捐赠"&payment_type="1"&seller_id="payservice@dcloud.io"&total_fee="1"&body="DCloud致力于打造HTML5最好的移动开发工具，包括终端的Runtime、云端的服务和IDE，同时提供各项配套的开发者服务。"&it_b_pay="1d"&notify_url="http%3A%2F%2Fdemo.dcloud.net.cn%2Fpayment%2Falipay%2Fnotify.php"&show_url="http%3A%2F%2Fwww.dcloud.io%2Fhelloh5%2F"&sign="dLGdcWUE6Dn8NmvJUiMxqCSjmoEFNEdZQB%2B0bkGIAWII6ijAmoZWXRtTgcEkCw4e6NtRzuc%2BJxdOwKDmvYh8uC%2FaMN5qhIMRVoLl719tUIV8nDsuuCNYqFmlN8xvDku0BknI7UeR9mO%2BjZe4N1IrCEZGTC1ARYf%2FZ37GHa%2B4Sn0%3D"&sign_type="RSA";
				
			// AlipayClient alipayClient = new DefaultAlipayClient(URL, APP_ID, APP_PRIVATE_KEY, FORMAT, CHARSET, ALIPAY_PUBLIC_KEY, SIGN_TYPE);

				
				
				
				
				
			},
			even(e){
				let num = e.detail.index;
				_self.num = num;
				let list = _self.dataList;
				for(let i = 0;i<list.length; i++){
					list[i].activer = false;
				}
				list[num].activer = true;
				_self.dataList = list;				
			},
			bindsaveuserinfo(){				
				if(_self.nick_name.trim() == '' || _self.nick_name.trim().length == 0){
					uni.showToast({
					    icon: 'none',
					    title: '请填写昵称'
					});
					return;
				}			
				let ret = _self.getUserInfo();
				 _self.sendRequest({
				        url : _self.ModifyUserInfoUrl,
				        method : _self.Method,
				        data : {
							"guid": ret.guid,
							"token": ret.token,	
							"nick_name":_self.nick_name,
							"status":0,
							"t":Math.random()
						},
				        hideLoading : false,
				        success:function (res) {
							let data = res;
							if(parseInt(data.status) == 3){
								_self.userinfo = data.userinfo;
								uni.showToast({
								    icon: 'none',
								    title: '修改成功'
								});
							}
				        }
				    },"1");
			},
			show(){
				let ret = _self.getUserInfo();
				const data = {
				    guid: ret.guid,
				    token: ret.token
				};
				_self.getData(data);
			},
			getData(data){
				let ret = _self.getUserInfo();
				_self.sendRequest({
					url : _self.getUsersInfoUrl,
				    method : _self.Method,
				    data : {"token":ret.token,"guid":ret.guid,"t":Math.random()},
				    hideLoading : true,
				    success:function (res) {
						if(res){
							//debugger;
							let data = res;
							if(data.status == 3){
								let userinfo2 = data.userinfo;
								_self.userinfo = userinfo2;
								_self.nick_name = userinfo2.nick_name;
								_self.childface = _self.PicUrl + 'users' + userinfo2.face;
								
								let costdata = data.costlist;
								let list = [];					
								for (var i = 0; i < costdata.length; i++) {
									var item = costdata[i];
									list.push(item);
									///idlist.push(item.class_id);
								}								
								_self.dataList = list;
								_self.num = 0;
							}
						}
				    }
				},"1");				
			}
			
		}
	}
		
</script>

<style>		
	.lists2 ul li.grids{
		clear: both;
		padding: 0upx;
		/* border: 1px solid #f00; */
	}
	.lists ul li.grids>view{
		float:none;
	}
	
	.header{}
	.header ul,.main-body ul{ margin: 0upx; padding:0upx; list-style-type: none; }
	.header ul li{
		float: left;
	}
	.imgs {
		margin-right: 20upx;
		background-color: #eaeaea;
		width: 130upx;
		height: 130upx;
		text-align: center;
		border-radius: 80upx;
		overflow: hidden;
	}
	.imgs image{
		height: 100upx;
		width: 100upx;
		margin-top: 15upx;
	}
	.main-body{
		width: 95%;
		margin: 0 auto;
		margin-bottom: 20upx;
	}
	.write{
		background-color: #fff;
		margin-bottom: 30upx;
	}
	.header_txt li{
		clear: both;
	}
	
	.header_txt li:first-child{			
		height: 80upx;
		line-height: 80upx;
		font-size: 45upx;
	}
	.header_txt li:last-child{			
		height: 50upx;
		line-height: 50upx;
		font-size: 30upx;
	}
	.gemmologist-name{
		display: block;
		height: 45upx;
		line-height: 45upx;
		font-size: 25upx;		
	}
	
	image.identify-head{
		width: 80upx;
		height: 80upx;
		clear: both;
	}
	.main_content{	}	
	.h500{
		padding-top: 120upx;
	}
	.btn{
		clear: both;
	}
	.lists{
		margin-bottom:120upx;
	}
	.lists2{
		margin-bottom:30upx;
	}
	.lists ul li,.lists2 ul li{
		padding: 25upx 20upx;
	}	
	.lists ul li:first-child,.lists2 ul li:first-child{
		background-color: #66ccff;
		border-top-left-radius:25upx ;
		border-top-right-radius:25upx ;
		color:#fff;
	}
	.lists ul li.li30{
		margin-bottom: 30upx;
	}
	.lists ul li:first-child{		
		border-bottom: 1upx solid #eeeeee;
	}
	.lists ul li>view{
		float: left;
	}
	.uni-list-cell-left{
		margin-right: 40upx;
		width:20%;
	}
	.cell-right{
		float: left;
		width:70%;
		text-align: center;	
	}
	.m-input{
		height: 55upx;
		line-height: 55upx;
	}
	.grid-item-box{
		text-align: center;	
		padding-top: 25upx;
		height: 180upx;
	}
	.active{
		border:1px solid #007AFF;
	}
	
	.grid-item-box text{
		line-height: 60upx;
		
	}
	.gemmologist-title{
		border-bottom: 1px solid #66ccff;
		width: 100%;
		font-size: 35upx;
		
	}
	.gemmologist-name{
		font-weight: bold;
		font-size: 54upx;
	}
	.li40{
		line-height: 45upx;
		padding:0upx;
		
	}
	.lists2 ul li.li40{
		padding-left: 80upx;
	}
	.wx{
		background:url(../../../static/img/weixinpay.png) 10upx 20upx no-repeat;
		-webkit-background-size: 60upx 60upx;
		background-size: 60upx 60upx;
	}
	.alipay{
		background:url(../../../static/img/alipay.png) 10upx 20upx no-repeat;
		-webkit-background-size: 60upx 60upx;
		background-size: 60upx 60upx;
	}
</style>
