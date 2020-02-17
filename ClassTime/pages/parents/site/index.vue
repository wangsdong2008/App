<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<uni-section title="系统设置" type="line"></uni-section>
			<uni-list>				
				<uni-list-item title="课程设置"   thumb="../../../static/img/couse.png" @tap="bindCourse" />
				<uni-list-item title="孩子管理" thumb="../../../static/img/userHL.png" @tap="bindChild" />
				<uni-list-item title="上课计划" thumb="../../../static/img/plan.png" @tap="bindPlan" />
				<uni-list-item title="查找机构" thumb="../../../static/img/company.png" @tap="bindcompany" />
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
	import uniSection from '@/components/uni-section/uni-section.vue'
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import headerNav from "@/components/header/company_header.vue"
	import footerNav from "@/components/footer/footer_nav.vue"
	
	export default {
	    components: {
			uniSection,
			uniList,
			uniListItem,
			headerNav,
			footerNav
		},
		data(){
			return{
				dataList:[],				
				headermsg:'系统设置,System Siteup',
				footer: 'familysite'
			}
		},
		onLoad:function() {
			this.checkLogin();
		},
		methods:{
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
