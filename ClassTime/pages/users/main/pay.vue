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
			<radio-group @change="payChange">	
			<ul>
				<li>支付方式</li>
				<li class="li40">
					<label class="uni-list-cell uni-list-cell-pd" >
					<view>						
						<radio class="radios" value="1" checked />
					</view>
					<view class="radio_text"><image src="../../../static/img/weixin.png" mode=""></image>微信</view>
					</label>
					<view class="clear"></view>
				</li>
				<li class="li40">
					<label class="uni-list-cell uni-list-cell-pd" >
					<view>						
						<radio class="radios" value="2" />
					</view>
					<view class="radio_text"><image src="../../../static/img/alipay.png" mode=""></image>支付宝</view>
					</label>
					<view class="clear"></view>
				</li>
				
				<!-- <li class="li40 wx" @tap="bindpay(1)">微信</li>
				<li class="li40 alipay" @tap="bindpay(2)">支付宝</li>	 -->
			</ul>
			</radio-group>	
		</view>
		
		<view class="main-body write lists2">
			<view class="btn-row">
			    <button type="primary" class="primary" @tap="bindpay">去支付</button>
			</view>	
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
				num:0,
				payitems: [
					{
						imgurl:'../../../static/img/weixin.png',
						value: '1',
						name: '微信'
					},
					{
						imgurl:'../../../static/img/alipay.png',
						value: '2',
						name: '支付宝'
					}
				],
				payid:1
			}
		},
		methods:{
			payChange: function(evt) {
				_self.payid = evt.detail.value;
			},
			bindpay(){
				let payid = parseInt(_self.payid);
				let nums = parseInt(_self.num);
				
				let ret = _self.getUserInfo();
				if(!ret){
					return;
				}
				
				uni.req	
				var url = '';
				switch(payid){
					case 1:{ //微信支付
						//url = '../pay/wxpay';
						
					/* appid: 应用ID,
							noncestr: 随机字符串,
							package: 'Sign=WXPay', // 固定值，以微信支付文档为主
							partnerid: 商户号,
							prepayid: 预支付交易会话ID,
							timestamp: 时间戳,
							sign: 签名 ,// 根据签名算法生成签名 */
						//
						let obj = {							
							appid: 'wx0411fa6a39d61297',
							noncestr: '5JigiIJicbq8hQI2',
							package: 'Sign=WXPay',
							partnerid: '1230636401',
							prepayid: 'wx21204902147233e222e12d451613768000',
							timestamp: 1582257316,
							sign: '0E5C9B9B1C8D7497A234CCC3C721AB1F'
						};
						// 第一种写法，传对象
						//let orderInfo = obj;
						// 第二种写法，传对象字符串
						let orderInfo = JSON.stringify(obj);
						
						uni.requestPayment({
							provider: 'wxpay',
							orderInfo: orderInfo, // 订单数据							
							success: function (res) {
								// 支付成功的回调中 创建绘本馆成功
								uni.showToast({
									title: '微信支付成功',
									icon: 'success',
									duration: 1500
								});
							},
							fail: function (err) {
								// 支付失败的回调中 用户未付款
								uni.showToast({
									title: '支付取消',
									duration: 1500,
									image: '/static/png/error_icon.png'
								});
							}
						});
						// 
						break;
					}
					case 2:{//支付宝支付						
						let orderInfo = 'app_id=2016101800715949&biz_content=shike&charset=utf-8&method=alipay.trade.app.pay&notify_url=http://www.a.com/index/notify/notifyy&out_trade_no=202002201028596283874524&product_code=QUICK_MSECURITY_PAY&sign_type=RSA2&subject=mysql&timestamp=2020-02-20+10:28:59&total_amount=123.0&version=1.0&sign=';
						uni.requestPayment({
							provider: 'alipay',
							orderInfo: orderInfo, // 订单数据
							success: function (res) {
								if (res.resultCode == 6001) {
									uni.showToast({
										title: '支付取消',
										icon: 'none',
										duration: 1500
									});
								} else {
									uni.showToast({
										title: '支付宝支付成功',
										icon: 'success',
										duration: 1500
									});
								}
							},
							fail: function (err) {
								// 支付失败的回调中 用户未付款
								uni.showToast({
									title: '支付取消',
									duration: 1500,
									icon: 'none'
								});
							}
						});	
						break;
					}
				}				
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
	.radio_text{
		margin-left: 30upx;
		margin-right: 40upx;
	}
	.uni-list-cell-pd view{
		width: auto;
		float: left;
		font-size: 35upx;
	}
	.uni-list-cell-pd view image{
		width: 80upx;
		height: 80upx;
		vertical-align: middle;
		margin-right: 30upx;
	}
	.uni-list-cell-pd view radio{
		margin-top: 15upx;
	}
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
		margin-bottom:60upx;
	}
	.lists2{
		margin-bottom:40upx;
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
		
		border:1upx solid #66ccff;
		border-top: 0upx;
		
	}
	.lists2 ul li.li40{
		padding-left: 40upx;
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
