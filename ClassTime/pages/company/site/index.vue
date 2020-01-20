<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<uni-section title="公司相关设置" type="line"></uni-section>
			<uni-list>
				<uni-list-item title="公司设置" thumb="../../../static/img/company.png" @tap="bindCompany" />
				<uni-list-item title="课程分类"   thumb="../../../static/img/category.png" @tap="bindCategory" />
				<uni-list-item title="学校管理" thumb="../../../static/img/school.png" @tap="bindShcool" />
				<uni-list-item title="年级管理" thumb="../../../static/img/grade.png" />
				<uni-list-item title="班级管理" thumb="../../../static/img/classs.png" />
				<uni-list-item title="学生管理" thumb="../../../static/img/students.png" />
				<uni-list-item title="上课安排" thumb="../../../static/img/plan.png" />
			</uni-list>
			<uni-list>
				<uni-list-item title="员工管理" thumb="../../../static/img/staff.png" />						<uni-list-item title="权限管理" thumb="../../../static/img/power.png" />
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
				headermsg:'公司设置,Company Siteup',
				footer: 'companysite'
			}
		},
		methods:{
			bindCompany:function(){
				this.navigateTo('company');
			},
			bindShcool:function(){
				this.navigateTo('school');
			},
			bindCategory:function(){
				this.navigateTo('category');
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
