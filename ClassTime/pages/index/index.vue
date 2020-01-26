<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="main_content content">
			<view class="main_center">
				<uni-list>
					<uni-list-item :title="'登录'"  :thumb="'../../../../../static/img/login.png'" :show-arrow="true" @tap="bindLogin"></uni-list-item>
					<uni-list-item :title="'注册'"  :thumb="'../../../../../static/img/register.png'" :show-arrow="true" @tap="bindRegister"></uni-list-item>
					<uni-list-item :title="'搜索'"  :thumb="'../../../../../static/img/search2.png'" :show-arrow="true" @tap="bindSearch"></uni-list-item>
				</uni-list>
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
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	
	export default {
	    components: {
			headerNav,
			footerNav,
			uniList,
			uniListItem
		},
		data(){
			return{
				headermsg:'上课时间,Class Time',
				footer: 'index'
			}
		},
		methods:{
			bindLogin(){
				this.navigateTo('../users/login/login');
			},
			bindRegister(){
				this.navigateTo('../users/reg/reg');
			},
			bindSearch(){
				this.navigateTo('../index/index/search');
			}
		}
	}
	
</script>
<style>	
	.uni-list-item{
		width:100%;
		padding:0upx;
	}
	.content{
		background-color: #fff;		
		padding-top: 10upx;
	}
	.main_center{
		width:95%;			
		margin: 0 auto;
	}
</style>