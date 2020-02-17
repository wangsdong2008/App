<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<view class="title">
				<image src="../../../static/img/help.png" mode=""></image>帮助
			</view>
			<uni-collapse accordion="true">
			    <uni-collapse-item v-for="(item,index) in dataList" :title="item.help_name" :open="item.open" :index="index" :key="item.help_id" :thumb="'../../../static/img/step.png'" class="colbg">
					<view class="newcontent">描述信息描述信息描述信息描述信息描述信息描述信息描述信息描述信息描述信息描述信息描述信息描述信息</view>
					
			    </uni-collapse-item>
			</uni-collapse>
			
		</view>
		<view class="footer">
			<footerNav :msg="footer"></footerNav>
		</view>
	</view>
</template>

<script>
	import headerNav from "@/components/header/company_header.vue"
	import footerNav from "@/components/footer/footer_nav.vue"
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	export default {
		components: {
			uniCollapse,
			uniCollapseItem,
			headerNav,
			footerNav
		},
		data(){
			return{
				dataList:[
					{"help_id":1, "help_name":"第一步", "open":true},
					{"help_id":2, "help_name":"第二步", "open":false},
				],
				headermsg:'帮助,Help',
				footer: 'help'
			}
		},
		onLoad:function() {
			this.checkLogin();
		},
		methods:{
		},
	}
</script>

<style>
	.newcontent{
		width: auto;	
		margin: 20upx auto;
		font-size: 30upx;
		background-color: #fff;
		line-height: 50upx;
		padding: 20upx 30upx;
	}
	
	.content{
		width:96%;
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
