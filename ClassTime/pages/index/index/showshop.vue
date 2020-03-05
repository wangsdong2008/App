<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="main_content content">			
			<uni-section title="详情" type="line"></uni-section>
			<view class="searchlist">
				<view class="course_title">{{cat_name}}</view>
				<view class="icenter" v-html="cat_content">	</view>
				<view class="icenter course_jg" @tap="bindcompany">{{company}}</view>
				<view class="btn-row icenter">
				    <button type="primary" class="primary" @tap="bindmodify">{{btntxt}}</button>
				</view>
			</view>
		</view>		
	</view>
</template>
<script>
	import service from '../../../service.js';
	import mInput from '../../../components/m-input.vue';
	import headerNav from "@/components/header/company_header.vue"
	import uniSection from '@/components/uni-section/uni-section.vue'
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	var _self;
	
	export default {
	    components: {
			headerNav,			
			uniList,
			uniListItem,
			uniSection,
			mInput
		},
		onLoad(options) {
			_self = this;
			_self.checkLogin(0);
			_self.pid = options['pid'];
			_self.cid = options['cid'];
			_self.comid = options['comid'];
		},
		onReady(){
			_self.show();
		},
		data(){
			return{
				headermsg:'机构详情',
				pid:0,
				cid:0,
				comid:0,
				cat_content:'',
				cat_name:'',
				dataList:[],
				btntxt:'报名',
				company:''
			}
		},
		methods:{
			show(){
				let ret = _self.getUserInfo();
				if(!ret){
					return false;
				}
				const data = {
				    guid: ret.guid,
				    token: ret.token,
					uid:_self.pid,
					cid:_self.cid,
					comid:_self.comid
				};				
				_self.getData(data);
			},
			bindcompany(){
				_self.navigateTo('showshop?pid='+_self.uid+"&comid="+_self.comid);
			},
			getData(data){
				_self.sendRequest({
				        url : _self.showCourseUrl,
				        method : _self.Method,
				        data : {
							"token": data.token,
							"guid": data.guid,
							"uid":data.uid,
							"cid":data.cid,
							"comid":data.comid,
							"t":Math.random()
						},
				        hideLoading : true,
				       success: (res) => {
				       		var data = res.courselist;
				       		switch(parseInt(res.status)){
				       			case 1:{
				       				uni.showToast({
				       					title: '无数据',
				       					icon: 'none',
				       				});		
				       				break;
				       			}
				       			case 3:{
				       				_self.cat_name  = data.cat_name;
									_self.cat_content  = data.cat_content;
									_self.company = res.companylist.com_name;
				       				break;
				       			}
				       		}
				       		
				       	}
				    },"1","");
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
	.icenter{
		width: 90%;
		margin: 0 auto;
		margin-top: 10upx;
		font-size: 30upx;
		line-height: 65upx;
	}
	.course_title{
		width: 80%;
		margin: 0 auto;
		border-bottom: 1upx solid #0A8AFF;
		font-size: 45upx;
		font-weight: bold;
		line-height:60upx;
		padding-bottom:20upx;
		margin-top: 40upx;
		padding-left: 80upx;
		background:url(../../../static/img/course.png) no-repeat 10upx 5upx;
		background-size: 60upx 60upx;
	}
	
	.course_jg{
		width: 80%;
		margin: 0 auto;
		border-top: 1upx solid #eee;
		padding-left: 80upx;
		background:url(../../../static/img/company.png) no-repeat 10upx 5upx;
		background-size: 60upx 60upx;
		text-decoration: underline;
		cursor: pointer;
	}
	
	.m-input{
		height: 80upx;
		line-height: 80upx;
		margin-left: 60upx;
		float: left;
	}
	
	.btn{
		width:30%;
		margin-left: 20upx;
		float: left;
	}	
	
	
</style>