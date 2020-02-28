<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<uni-section title="系统设置" type="line"></uni-section>
			<uni-list>				
				<uni-list-item title="课程设置"   thumb="../../../static/img/couse.png" @tap="bindCourse" />
				<uni-list-item title="孩子管理" thumb="../../../static/img/userHL.png" @tap="bindChild" />
				<uni-list-item title="上课计划" thumb="../../../static/img/plan.png" @tap="bindPlan" />
				<uni-list-item title="调课和请假" thumb="../../../static/img/tiaoke.png" @tap="bindTiaoke" />
			</uni-list>
			<uni-list>
				<uni-list-item title="帮助文档"   thumb="../../../static/img/help.png" @tap="bindhelp" />
			</uni-list>
		</view>
		<view class="footer">
			<footerNav :msg="footer"></footerNav>
		</view>
	</view>
</template>

<script>
	import service from '@/service.js';
	import uniSection from '@/components/uni-section/uni-section.vue'
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import headerNav from "@/components/header/company_header.vue"
	import footerNav from "@/components/footer/footer_nav.vue"
	
	var _self;
	
	export default {
	    components: {
			uniSection,
			uniList,
			uniListItem,
			headerNav,
			footerNav,
			service			
		},
		data(){
			return{
				dataList:[],				
				headermsg:'系统设置,System Siteup',
				footer: 'familysite',
				course_name:'',
				longitude:0,
				latitude:0,
			}
		},
		onLoad:function() {
			_self = this;
			this.checkLogin(1);
		},
		methods:{
			onNavigationBarButtonTap(e) {
				_self.bindsearch();
			},		
			onNavigationBarSearchInputChanged (e) {
			    //console.log("你在搜索框中输入了信息"+e.text);
				_self.course_name = e.text;
			},
			bindTiaoke(){
				_self.navigateTo('tiaoke');
			},
			bindsearch(){
				if(_self.longitude == 0){  //没有经纬度的时候，获取经纬度
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
				}
				if(!service.checkNull(this.course_name)){
					uni.showToast({
					    icon: 'none',
					    title: '课程不能为空'
					});
					return;
				}
				this.navigateTo('/pages/index/index/searchresult?keyword='+this.course_name+"&longitude="+this.longitude+"&latitude="+this.latitude);
			},
			bindCourse:function(){
				this.navigateTo('course');
			},
			bindChild:function(){
				this.navigateTo('child');
			},
			bindPlan:function(){
				this.navigateTo('plan');
			},
			bindcompany:function(){
				this.navigateTo('/pages/index/index/search');
			},
			bindhelp:function(){
				this.navigateTo('help');
			}
		}
	}
</script>

<style>
	.content{
		background-color: #f8f8f8;
	}
	.uni-list{
		margin-top: 40upx;
		background-color: #fff;
	}
</style>
