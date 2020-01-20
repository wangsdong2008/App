<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">
			<uni-section :title="cat_name" type="line"></uni-section>
			<uni-list v-for="(item,index) in dataList">
				<uni-list-item :title="item.date" :show-badge="true" :badge-text="item.num.toString()" :show-arrow="false"></uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script>
	import service from '@/service.js';
	import mInput from '@/components/m-input.vue'
	import headerNav from "@/components/header/company_header.vue"
	import uniSection from '@/components/uni-section/uni-section.vue'
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	
	export default {
	    components: {
			headerNav,uniSection,uniList,uniListItem
		},
		data(){
			return{
				headermsg:'',
				dataList:[],
				datalist: [],
				id:0,
				cid:0, //课程id
				comid:0, //公司id
				d:'',//月份
				cat_name:'' //课程分类名称
			}
		},
		onLoad(options){
			this.checkLogin();
			if(options == undefined) return false;
			this.id = options['id']; //id=1为上课统计
			this.cid = options['cid'];  //课程id
			this.comid = options['com_id']; //公司
			this.d = options['d']; //日期
			switch(parseInt(this.id)){
				case 1:{
					this.headermsg = '上课统计,Statistics';
					break;
				}
				case 2:{
					this.headermsg = '吃饭统计,Statistics';
					break;
				}
				case 3:{
					this.headermsg = '员工统计,Statistics';
					break;
				}
			}
		},
		onReady(){
			this.show();
		},
		methods:{
			show(){
				let ret = this.getUserInfo();
				const data = {
				    guid: ret.guid,
				    token: ret.token
				};
				this.getData(data);
			},
			getData(data){
				uni.request({
					url: this.GetCompanyStatisticUrl,
					header: {
				        "Content-Type": "application/x-www-form-urlencoded"							 
				    },
				    data: {
						"guid": data.guid,
						"token":data.token,
						"comid":this.comid,
						"cid":this.cid,
						"d":this.d,
						"id":this.id,
						"t":Math.random()
				    },
				    method: "get",
					success: (res) => {
					    if(res.data){					   
							//debugger;
							if(parseInt(res.data.status) == 3){								
								this.cat_name = res.data.categorylist.cat_name;
								var data = res.data;
								if(parseInt(res.data.status) == 3){
									//所有签到记录
									let list = [];
									let signlist = data['signlist'];
									//debugger;
									for (var i = 0; i < signlist.length; i++) {
										var item = signlist[i];									
										list.push(item);
									}									
									this.dataList = list;
								}								
							}else{
								uni.showToast({
									title: '无数据',
									icon: 'none',
								});
							}				    	
					    }
					}
				})
			}	
			
		}
	}
	
</script>

<style>	
	.uni-section{
		background-color: #fff;
	}
	.uni-calendar{
		width:96%;
		margin:0 auto;
	}
	.content{
		background-color: #fff;
	}
	.icenter > view{
		float: left;
	}
	.icenter > view.searchinput{
		background: url(../../../static/img/search.png) no-repeat 5upx 10upx;
		-webkit-background-size: 55upx 55upx;
		background-size: 55upx 55upx;
		width: 65%;
		border:1upx solid #eeeeee;
		line-height: 55upx;
		height: 55upx;
		padding-left: 60upx;
		border-radius: 25upx;
	}
</style>
