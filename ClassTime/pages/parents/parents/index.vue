<template>
	<view class="main">
		<view>
			<view class="icenter">
				<view class="title">今日上课 </view>
				<view class="studentlist">
					<!-- 包含图片 -->					
				</view>
			</view>		
		</view>
		
			
		<view class="footer">
			<footerNav :msg="footer"></footerNav>
		</view>
		
	</view>	
</template>

<script>
	import footerNav from "@/components/footer/footer_nav.vue"
	export default {
	    components: {
			footerNav
		},
		data(){
			return{
				dataList:[],				
				footer: 'family'
			}
		}
	}
</script>

<style>
</style>
