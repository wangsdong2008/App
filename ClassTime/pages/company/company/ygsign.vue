<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">					
				<view class="studentlist">
					<checkbox-group  @change="checkboxChange"> 
					<uni-list v-for="(item,index) in dataList" :index="index" :key="item.com_id">
						<uni-list-item class="list-title" :title="item.com_name" :show-arrow="false" :show-badge="true" thumb="../../../static/img/school.png" ></uni-list-item>
						
						<uni-list-item v-for="(item3,index3) in item.memberlist" :index="index3" :key="item3.id" :show-arrow="false" :show-badge="true" :scroll-y="true">
							<view class="contentslist">
								<label class="checkbox">
									<checkbox :value="item3.id.toString()" :checked="ulist.indexOf(item3.id)>=0" />
								</label>
								{{item3.true_name}}
							</view>
						</uni-list-item>
						
						
						</uni-list-item>
					</uni-list>
					</checkbox-group>
					
					 
					  
					  <view class="btnlist">
						<checkbox-group @change="bindSelectAll">
							<view>
								<label class="checkbox">
									<checkbox value="1" :checked="isCheckedAll" />全选
								</label>
							</view>							
							<button type="primary" @tap="bindclick(1)" >签到</button>
							<button type="primary" @tap="bindclick(2)">请假</button>
							
							
							
							
						</checkbox-group> 
					  </view>
					  
				</view>
			
		</view>
	</view>
</template>

<script>
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	import headerNav from "@/components/header/company_header.vue"
	var _self;
	export default {
	    components: {uniList,uniListItem,uniGrid,uniGridItem,headerNav},
		data(){
			return{
				dataList:[],	
				dataList_num:0,
				selectid:'',
				isCheckedAll: false,
				ulist:[],
				headermsg:'员工签到,Member sign',
			}
		},
		onLoad:function() {
			_self = this;
			_self.checkLogin(2);
			_self.show();
		},
		methods: {
			show(){
				let ret = _self.getUserInfo();				
				if(!ret){
					return false;
				}
				const data = {
				    guid: ret.guid,
				    token: ret.token
				};
				_self.getData(data);
			},
			getData(data){
				_self.sendRequest({
				    url : _self.GetCurrentMemberlistUrl,
				    method : _self.Method,
				    data : {
						"guid": data.guid,
						"token":data.token,
						"catid":3,
						"t":Math.random()
					},
				    hideLoading : true,
				    success:function (res) {
						if(res){
					    	var data = res.subcompanylist; 
							if(parseInt(res.status) == 3){
								if(data.length > 0){
									let num = 0;
									let list = [];
									for (var i = 0; i < data.length; i++) {				
										var item = data[i];
										list.push(item);
										num ++;
									}								
									_self.dataList = list;
									_self.dataList_num = num;
								}
							}			    	
					    }
					
				    }
				},"1","");
				
			},			
						
			bindSelectAll:function(){
				//debugger;
				_self.isCheckedAll = !_self.isCheckedAll
				if (_self.isCheckedAll) {
					let str = [];
					// 全选时
					_self.ulist = [];					
				    _self.dataList.forEach(function (item) {						
						var memberlist = item.memberlist;
						for(var j = 0; j < memberlist.length; j++ ){
							var value = memberlist[j].id;
							_self.ulist.push(value);
							let v = item.com_id+"-0-"+value;
							str.push(v);
						}
					}, _self);
					_self.selectid = str.join(",");
				} else {					
					_self.ulist = [];
					_self.selectid = "";
				}
			},
			checkboxChange: function (e) {
				var items = _self.dataList;
				var	values = e.detail.value;
				var str = [];
				var num = 0;
				//debugger;
				let companylist = items;
				_self.ulist = [];
				
				for (var i = 0; i < companylist.length; i++) {
					let item = companylist[i];
					let memberlist = item.memberlist;
					for(var j = 0; j < memberlist.length; j++){
						let studentslist = memberlist[j];
						var value = studentslist['id'].toString();
						if(values.includes(value)){
							_self.ulist.push(value);												
							str.push(companylist[i].com_id+"-0-"+value);
							num ++;
						}
					}
				}
				if(_self.ulist.length == 0){
					_self.isCheckedAll = false;
				}else{
					if(num == _self.dataList_num){
						_self.isCheckedAll = true;
					}else{
						_self.isCheckedAll = false;
					}
				}
				_self.selectid = str.join(",");
			},			
			bindclick(sid){				
				if( _self.selectid.toString() == '') {
					uni.showToast({
						title: '请选择员工',
						icon: 'none'
					});
					return false;
				}
				//调用签到函数
				_self.setSign(3,sid,_self.selectid.toString(),'ygsign');
			}
		}
	}
	
</script>


<style>	
	.contentslist{
		width: 90%;
		margin: 0 auto;
	}
	.btnlist{
		border-top:2px solid #eeeeee;
		padding-top: 40upx;
		width: 100%;
		height:140upx;
	}
	.btnlist button{
		float: left;
		width:30%;
		margin-left: 20upx;
	}
	.btnlist view{
		float: left;
		width: 20%;
		margin-left: 20upx;
	}
	.item-active{
		background-color: #66ccff;
	}
	.uni-list-item{
		padding:5upx 20upx;
		margin-bottom: 10upx;
	}
	.uni-list-item .t1{
		background-color: #66ccff;
	}
	.uni-list-item view{
	}	
	.uni-list-item view.checkbox{	
		margin-right: 20upx;
	}
	.uni-list-item view image{
		width: 50upx;
		height: 50upx;
		top:10upx;
		margin-right: 20upx;
	}
	
	.main{
		width:100%;		
		margin-top: 0upx;
		background-color:#eeeeee;
	}
	.main>view{
		background-color: #fff;
		margin-bottom: 10upx;
	}
	.icenter{
		width: 96%;
		margin: 0 auto;
		overflow: hidden;
		z-index: 1000;
		padding-bottom: 50upx;/* 
		border:1px solid #f00; */
	}
	.icenter .title{
		margin-top: 20upx;
	}
</style>
