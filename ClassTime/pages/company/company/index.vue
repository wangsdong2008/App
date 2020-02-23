<template>
	<view class="main">
		<view>
			<view class="icenter">
				<view class="title">今日上课 </view>
				<view class="studentlist">
					<!-- 包含图片 -->					
					<uni-list v-for="(item,index) in dataList" :index="index" :key="item.com_id">
						<uni-list-item v-if="parseInt(item.category_num) > 0" class="list-title" :title="item.com_name" :show-arrow="false" :show-badge="true" thumb="../../../static/img/company.png" ></uni-list-item>
						<uni-list-item :show-arrow="false" :show-badge="true">
							<uni-list v-if="parseInt(item2.students_num) > 0" v-for="(item2,index2) in item.categorylist" :index="index2" :key="item2.cat_id"> 
								<uni-list-item class="list-title2" :show-arrow="false" :show-badge="true" :title="'【'+item2.cat_name+'】'" thumb="../../../static/img/course.png"></uni-list-item>
								<uni-list-item :show-arrow="false" :show-badge="false" >
									<uni-list>
										<uni-list-item class="studentsclass" v-for="(item3,index3) in item2.studentslist" :title="item3.uname" :note="item3.detail" :show-arrow="false" :show-badge="true" :scroll-y="true" :badge-text="item3.time" :thumb="item3.sex_img" :index="index3" :key="item3.uid">
										</uni-list-item> 
									</uni-list>
								</uni-list-item>
							</uni-list>
						</uni-list-item>
					</uni-list>
				</view>
			</view>		
		</view>
		<view>
			<view class="icenter">
				<view class="title">日常管理</view>
				<view class="piclist">
					<!-- 一般用法 -->
					<uni-grid :column="3" :show-border="false"  :square="false">
						<uni-grid-item>											
							<image src="../../../static/img/usign.png" @tap="bindsksign"></image>
							<text class="text" @tap="bindsksign">上课签到</text>
						</uni-grid-item>				    
						<uni-grid-item>
							<image src="../../../static/img/fsign.png" @tap="bindcfsign"></image>
							<text class="text" @tap="bindcfsign">吃饭签到</text>
						</uni-grid-item>					
						<uni-grid-item>
							<image src="../../../static/img/esign.png" mode="2" @tap="bindygsign"></image>
							<text class="text" @tap="bindygsign">员工签到</text>
						</uni-grid-item>					
					</uni-grid>
				</view>
			</view>
		</view>
		<view>
			<view class="icenter">
				<view class="title">系统管理</view>
				<view class="systempiclist">
					<!-- 一般用法 -->
					<uni-grid :column="4" :show-border="false"  :square="false">
						<uni-grid-item>
							<image src="../../../static/img/stsearch.png" @tap="bindstudentssearch"></image>
						</uni-grid-item>				    
						<uni-grid-item>
							<image src="../../../static/img/tjsearch.png" @tap="bindstatistics"></image>
						</uni-grid-item>					
						<uni-grid-item v-if="is_brithday === 1">
							<image :src="'../../../static/img/brithday'+isBrithday+'.png'" @tap="bindbrithday" ></image>
						</uni-grid-item>
						<uni-grid-item>
							<image src="../../../static/img/system.png" @tap="bindsystem" ></image>
						</uni-grid-item>
					</uni-grid>
				</view>
			</view>
		</view>
		<view class="footer">
			<footerNav :msg="footer"></footerNav>
		</view>
		
	</view>	
</template>

<script>
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
    import footerNav from "@/components/footer/footer_nav.vue"
	var _self;
	
	export default {
	    components: {
			uniList,uniListItem,uniGrid,uniGridItem,footerNav
		},
		data(){
			return{
				dataList:[],
				isBrithday: 0,
				is_brithday:0,
				footer: 'company'
			}
		},
		onLoad:function() {	
			_self = this;
			_self.checkLogin(2);
		},
		onReady(){
			_self.show();
		},
		methods: {
			bindsystem(){
				_self.navigateTo('../site/index');
			},
			bindsksign(){//上课签到
				_self.navigateTo('sksign');
			},
			bindcfsign(){ //吃饭签到
				_self.navigateTo('cfsign');
			},
			bindygsign(){ //员工签到
				_self.navigateTo('ygsign');
			},
			bindstudentssearch(){ //学生查询
				_self.navigateTo('studentssearch');
			},
			bindstatistics(){ //统计
				_self.navigateTo('statistics');
			},
			bindbrithday(){ //生日提醒
				_self.navigateTo('birthday')
			},
			show(){
				let ret = uni.getStorageSync(_self.USERS_KEY);				
				if(!ret){
					return false;
				}
				_self.is_brithday = ret.is_brithday;
				const data = {
				    guid: ret.guid,
				    token: ret.token
				};
				_self.getData(data);
			},
			getData(data){
				let ret = _self.getUserInfo();
				_self.sendRequest({
					url : _self.GetCurrentStudents,
				    method : _self.Method,
				    data : {
						"guid": data.guid,
						"token":data.token,
						"catid":1,
						"t":Math.random()
					},
				    hideLoading : true,
				    success:function (res) {						
						if(res){
							var data = res.list;
							if(parseInt(res.status) == 3){
								if(data.length > 0){
									let list = [];
									for (var i = 0; i < data.length; i++) {
										var item = data[i];
										list.push(item);
									}							
									_self.dataList = list;
								}
								_self.isBrithday = res.isBrithday; 
							}					    	
						}
				    }
				},"1","");
			}
		}
	}
	
</script>

<style>
	.studentsclass{
		padding-left: 20upx;
	}
	.list-title2{
		/* border-bottom:#0FAEFF 1rpx solid; */
	}
    .list-title{
		font-weight: bold;
	}
	.systempiclist image{
		width: 80upx;
		height: 80upx;
		margin: 0 auto;
		margin-top: 40upx;
		margin-bottom: 40upx;
	}
	.piclist image{
		width: 120upx;
		height: 120upx;
		margin: 0 auto;
		margin-top: 40upx;
	}
	.system{
		margin-bottom: 20upx;
	}
	.text{
		width: 100%;
		text-align: center;
		margin-top: 10upx;
		margin-bottom: 10upx;
		font-size: 28upx;
	}
	.piclist{
		margin-top: 20upx;
		margin-bottom: 20upx;
	}
	.studentlist{
		height: 900upx;
		overflow: auto;
		margin-bottom: 20upx;
	}
	.uni-list-item{
		padding: 0 14upx;
	}
</style>
