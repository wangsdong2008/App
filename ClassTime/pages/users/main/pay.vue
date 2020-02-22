<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="title">
				<image src="../../../static/img/xf.png" mode=""></image>会员续费
			</view>	
			<view class="main-body write lists">
				<ul>
					<li>有效期至：{{userinfo.endtime}}</li>
				</ul>
			</view>
			
			<view class="main-body write lists">
				<ul>
					<li class="utitle">续费</li>
					<li class="li30 grids">
						<ul>
							<li :class="{
									'grid-item-box':true,
									'active':item.activer
								}" v-for="(item, index) in dataList" :index="index" :key="index" @click="even(index)">￥{{item.c_price}}/{{item.c_month}}月</li>
						</ul>
						<view class="clear"></view>
					</li>				
				</ul>
				<view class="clear"></view>
			</view>			
			
			<view class="main-body write lists">
				<radio-group @change="payChange">
					<ul>
						<li class="utitle">支付方式</li>
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
					</ul>
				</radio-group>	
				<view class="clear"></view>
			</view>	
						
			<view class="main-body write lists">
				<ul>
					<li class="btn"><button type="primary" class="primary" @tap="bindpay">去支付</button></li>
				</ul>
			</view>			
			
			
		</view>
	</view>
</template>

<script>
	import mInput from '../../../components/m-input.vue'
	import headerNav from "@/components/header/users_header.vue"
	import footerNav from "@/components/footer/footer_nav.vue"
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	
	var _self;
	
	export default {
	    components: {			
			mInput,headerNav,footerNav,uniGrid,uniGridItem
		},
		onLoad(){
			_self = this;
			_self.checkLogin(0);
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
				payid:1,
				headermsg:'会员中心,Member Center',
				footer:'',
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
			even(index){
				_self.num = index;
				let list = _self.dataList;
				for(let i = 0;i<list.length; i++){
					list[i].activer = false;
				}
				list[index].activer = true;
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
	*{
		margin: 0;
		padding: 0;
	}
	.lists > ul > li.btn{
		padding-bottom: 80upx;
	}
	.lists > ul > li > .primary{
		border-radius: 50upx;
	}
	.main_content{}
	.lists{
		/* border:1upx solid #eaeaea; */
		width:100%;
		margin: 0 auto;
		margin-top: 20upx;
	}
	.lists > ul,.lists > radio-group> ul{ list-style-type: none; width: 92%; margin: 0 auto; margin-top: 40upx;}
	.lists > ul > li,.lists > radio-group > ul > li{ font-size: 30upx; line-height: 45upx; height: 45upx; padding: 10upx 0upx; color:#333;}
	
	.lists > ul > li.utitle,.lists > radio-group> ul > li.utitle{
		font-size: 35upx;
		color: green;
		border-bottom: 1upx solid #eee;
		margin-bottom: 20upx;
		overflow: hidden;
		
	}
	.lists > ul > li > ul{
		list-style-type: none;
	} 
	.lists > ul > li > ul > li.active{
		background-color:#007AFF;
		color:#fff;
		border: 0upx;
	}
	.lists > ul > li > ul > li{
		width: 22%;
		border: 1upx solid #eee;
		float: left;
		margin-right: 12upx;
		padding: 5upx 2upx;
		text-align: center;
		font-size: 25upx;
		height: 60upx;
		line-height: 60upx;
		color:#666;
	}
	
	.lists > ul > li.grids{	
		padding-bottom: 30upx;
	}	
	
	.lists > uni-radio-group > ul > li.li40{
		height: 55upx;
		line-height: 55upx;	
		border:1upx solid #eee;		
		padding: 20upx;
		border-radius: 50upx;
		margin-bottom: 30upx;
		
	}
	
	.radio_text{
		margin-left: 10upx;
		margin-right: 40upx;
	}
	.uni-list-cell-pd view{
		width: auto;
		float: left;
		font-size: 35upx;
	}
	.uni-list-cell-pd view image{
		width: 60upx;
		height: 60upx;
		vertical-align: middle;
		margin-right: 30upx;
	}
	.uni-list-cell-pd view radio{
		margin-top: 0upx;
		margin-left: 20upx;
	}
	
	.content{
		width:98%;
		margin: 0 auto;
	}
	.content .title{
		border-bottom: 1px solid #66ccff;
		height: 45upx;
		line-height: 45upx;
		margin: 30upx 0upx;
		padding-bottom: 30upx;
	}
	.content .title image{
		width: 50upx;
		height: 50upx;
		margin-right: 20upx;
	}
</style>
