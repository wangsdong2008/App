<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="title waring">				
				<view class="title2">
					<image src="../../../static/img/clock.png" mode=""></image>
					<view>今日上课</view>
				</view>
				<view class="date">{{currenttime}}</view>
				<view class="clear"></view>
			</view>
			<view class="studentlist">
					<view>
						<!-- 一般用法 -->
						<uni-collapse>					
						    <uni-collapse-item v-for="(item,index) in dataList" v-if="item.num > 0" :title="item.child_name" :index="index" :key="item.child_id" :open="true" :show-arrow="false" :thumb="'../../../static/img/'+(item.sex == '1'?'p_boy.png':'p_gril.png')" :showAnimation="true" class="classlist"  >
								<uni-list>
									<uni-list-item v-for="(item2,index2) in item.courselist" :index="index2" :key="item2.cat_id" :show-arrow="false" :title="'【' + item2.c_name + '】--'+item2.organname+'--'+item2.c_address" :show-badge="true" :badge-text="item2.p_time" :show-extra-icon="item2.class_status" :extra-icon="extra1">
									</uni-list-item>
									
								</uni-list>	
						    </uni-collapse-item>
						</uni-collapse>
					</view>
				</view>
		</view>
		<view class="footer">
			<footerNav :msg="footer"></footerNav>
		</view>
	</view>	
</template>

<script>
	import headerNav from "@/components/header/company_header.vue"
	import footerNav from "@/components/footer/footer_nav.vue"
	import uniSection from '@/components/uni-section/uni-section.vue'
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'	
	var _self;
	
	export default {
	    components: {
			uniSection,
			uniList,
			uniListItem,
			uniCollapse,
			uniCollapseItem,
			footerNav,
			headerNav
		},
		data(){
			return{
				dataList:[],	
				headermsg:'今日提醒,Remind today',
				footer: 'family',
				currenttime:'',
				extra1:{
					color: '#F00',size: '15',type: 'spinner'
				}
			}
		},
		onLoad(){
			_self = this;
			_self.checkLogin(1);
			
		},
		onReady() {
			var date = new Date();
			var str = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate()+ " " + "星期" + "日一二三四五六".charAt(new Date().getDay());
			_self.currenttime = str;
			_self.getData();
		},
		created() {
		    //_self.currentTime();    
	    },		
		methods: {
			 // 销毁定时器
			beforeDestroy: function() {
			    if (_self.getDate) {
			        console.log("销毁定时器")
			        clearInterval(_self.getDate); // 在Vue实例销毁前，清除时间定时器
			    }
			},
			currentTime(){
			    setInterval(_self.getTime,60000);
			},
			getTime:function(){
				  _self.getData();
			},
			getData() {
				let ret = uni.getStorageSync(_self.USERS_KEY);
				if(parseInt(ret.pay_status) == 0){ //过期会员去续费
					uni.showModal({
					    title: "提醒",
					    content: '会员已过期，请续费',
						cancelText:'留在本页',
						confirmText:'去续费',
					    success: function (res) {
					        if (res.confirm) {
								_self.navigateTo('../../users/main/pay');
					        }
					    }
					});
				}else{
					_self.sendRequest({
						url : _self.DayClassUrl,
					    method : _self.Method,
					    data : {
							"token": ret.token,
							"guid": ret.guid,
							"t":Math.random()
						},
					    hideLoading : true,
					    success:function (res) {
							var data = res.list;
							switch(parseInt(res.status)){
								case 1:{
									/* uni.showToast({
										title: '无数据',
										icon: 'none',
									});		
									break; */
								}
								case 3:{
									let list = [];
									for (var i = 0; i < data.length; i++) {
										var item = data[i];
										list.push(item);
									}								
									_self.dataList = list;
									break;
								}
							}
					    }
					},"1","");
				}			
			}
		}
	}
</script>

<style>	
	.title2{
		
	}
	.title2 image{
		width: 50upx;
		height: 50upx;
		float: left;
	}
	.title2 view{
		width: auto;
		float: left;
	}
	.waring{
		position: relative;
		margin-bottom: 20upx;
	}
	.date{
		position: absolute;
		top:0upx;
		right:10upx;
		font-size: 25upx;
		height: 60upx;
		line-height: 60upx;
	}
	.classlist{
		/* background-color: #66ccff; */
		margin-bottom: 40upx;
		border-radius: 25upx;
		
		padding: 10upx 0px;
	}
	.classlist>.uni-list{
		width:90%;
		margin: 0 auto;
		border: 2px solid #f00;
	}
	.classlist>.uni-list .uni-list-item{
		border: none;
	}
	.studentlist{
		margin-top: 20upx;
		border-radius: 50upx;
	}
	.content{
		width:96%;
		margin: 0 auto;
		margin-top: 40upx;
	}	
	.statuslist{
		position:absolute;
		right: 30upx;
		font-size: 30upx;
		margin-top: 10upx;
	}
	.statuslist span{
		margin-right: 10upx;
	}
	.uni-list{
		width:98%;
		margin: 0 auto;
		margin-bottom: 15upx;
		border-radius: 15upx;
	}
	
	
</style>