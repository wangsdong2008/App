<template>
	<view>
		<uni-grid :column="3" :show-border="false" @change="even">
		    <uni-grid-item v-for="(item, index) in dataList" :index="index" :key="index">
		       <view class="grid-item-box" >
					<image :src="item.image" class="identify-head" mode="aspectFill" ></image>
		            <text class="gemmologist-name">{{item.text}}</text>
		        </view>
		    </uni-grid-item>
		</uni-grid>
		
	</view>
</template>

<script>
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	export default {
	    components: {			
			uniGrid,uniGridItem
		},
		data(){
			return{
				dataList:[
				    {image:'https://img-cdn-qiniu.dcloud.net.cn/img/shu.png',text:'跳转到u1',url:"../../pages/index/u1"},  
				    {image:'https://img-cdn-qiniu.dcloud.net.cn/img/lindang.png',text:'跳转到u2',url:"../../pages/index/u2"},  
				    {image:'https://img-cdn-qiniu.dcloud.net.cn/img/xuehua.png',text:'跳转到u3',url:"../../pages/index/u3"},  {image:'https://img-cdn-qiniu.dcloud.net.cn/img/shu.png',text:'跳转到u1',url:"../../pages/index/u1"},  
				    {image:'https://img-cdn-qiniu.dcloud.net.cn/img/lindang.png',text:'跳转到u2',url:"../../pages/index/u2"},  
				    {image:'https://img-cdn-qiniu.dcloud.net.cn/img/xuehua.png',text:'跳转到u3',url:"../../pages/index/u3"},  {image:'https://img-cdn-qiniu.dcloud.net.cn/img/shu.png',text:'跳转到u1',url:"../../pages/index/u1"},  
				    {image:'https://img-cdn-qiniu.dcloud.net.cn/img/lindang.png',text:'跳转到u2',url:"../../pages/index/u2"},  
				    {image:'https://img-cdn-qiniu.dcloud.net.cn/img/xuehua.png',text:'跳转到u3',url:"../../pages/index/u3"}, 
				]
			}
		},
		methods:{
			even(e){
				let num = e.detail.index;
				let url = this.dataList[num].url;
				uni.navigateTo({
					url: url,
				});	
			}
		}
	}
		
</script>

<style>
	.gemmologist-name{
		display: block;
		height: 45upx;
		line-height: 45upx;
		font-size: 25upx;
		
	}
	.grid-item-box{
		text-align: center;
		height: 165upx;
		margin-top: 25upx;
	}
	.grid-item-box text{
		height: 45upx;
	}
	.identify-head{
		width: 80upx;
		height: 80upx;
		clear: both;
	}
</style>
