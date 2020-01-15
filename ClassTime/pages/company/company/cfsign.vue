<template>
	<view class="main_content">
		<headerNav :msg="headermsg"></headerNav>
		<view class="center100 content">					
				<view class="studentlist">
					<checkbox-group  @change="checkboxChange"> 
					<uni-list v-for="(item,index) in dataList">
						<uni-list-item v-if="parseInt(item.category_num) > 0" class="list-title" :title="item.com_name" :show-arrow="false" :show-badge="true" ></uni-list-item>
						<uni-list-item :show-arrow="false" :show-badge="true">
							<uni-list v-if="parseInt(item2.students_num) > 0" v-for="(item2,index2) in item.categorylist"> 
								<uni-list-item class="list-title2" :show-arrow="false" :show-badge="true" :title="'【'+item2.cat_name+'】'"></uni-list-item>
								<uni-list-item v-for="(item3,index3) in item2.studentslist" :show-arrow="false" :show-badge="true" :scroll-y="true">
									<view>
										<label class="checkbox">
											<checkbox :value="item.com_id.toString()+'-'+item2.cat_id.toString()+'-'+item3.uid.toString()" :checked="ulist.indexOf(item.com_id+'-'+item2.cat_id+'-'+item3.uid)>=0" />
										</label>
										<image class="headimgsize" :src="item3.sex_img"></image>
										{{item3.uname}}
									</view>
								</uni-list-item>
							</uni-list>
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
							<button type="primary" @tap="bindclick(1)"  v-if="parseInt(this.dataList_num ) > 0">吃饭</button>
							<button type="primary" @tap="bindclick(2)" v-if="parseInt(this.dataList_num ) > 0">不吃</button>
							<button type="primary" disabled="true" v-if="parseInt(this.dataList_num) == 0">吃饭</button>
							<button type="primary" disabled="true" v-if="parseInt(this.dataList_num) == 0">不吃</button>
							
							
							
							
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

	export default {
	    components: {uniList,uniListItem,uniGrid,uniGridItem,headerNav},
		data(){
			return{
				dataList:[],	
				dataList_num:0,
				selectid:'',
				isCheckedAll: false,
				ulist:[],
				headermsg:'吃饭签到,Eat sign',
			}
		},
		onLoad:function() {
			this.checkLogin();
			this.show();
		},
		methods: {
			show(){
				let ret = uni.getStorageSync(this.USERS_KEY);				
				if(!ret){
					return false;
				}
				const data = {
				    guid: ret.guid,
				    token: ret.token
				};
				this.getData(data);
			},
			getData(data){
				uni.request({
					url: this.GetCurrentCFStudents,
					header: {
				        "Content-Type": "application/x-www-form-urlencoded"							 
				    },
				    data: {
						"guid": data.guid,
						"token":data.token,
						"t":Math.random()
				    },
				    method: "get",
					success: (res) => {
					    if(res.data){
					    	var data = res.data.list; 
							if(parseInt(res.data.status)==0){
								uni.showToast({
									title: '无数据2',
									icon: 'none',
								});		
							}else{	
								if(data.length > 0){
									let list = [];
									let str = '';
									var num = 0;
									//debugger;
									for (var i = 0; i < data.length; i++) {				
										var item = data[i];
										list.push(item);
										var tstr = item.com_id+"-";
										for(var j = 0;j<item.categorylist.length;j++){
											var mstr = tstr + item.categorylist[j].cat_id+"-";
											for(var k = 0;k<item.categorylist[j].studentslist.length;k++){
												str += mstr + item.categorylist[j].studentslist[k].uid + ",";
												num ++;
											}
										}								
										
									}								
									this.dataList = list;
									this.dataList_num = num;
									if(str != ''){
										str = str.substr(0,str.length-1);
									}
								}
							}					    	
					    }
					}
				})
			},			
			checkedOne (fruitId) {
				//debugger;
				/* let idIndex = this.ulist.indexOf(fruitId)
				if (idIndex >= 0) {
				  // 如果已经包含了该id, 则去除(单选按钮由选中变为非选中状态)
				  this.ulist.splice(idIndex, 1);
				} else {
				  // 选中该checkbox
				  this.ulist.push(fruitId);
				}			 */
			},				
			bindSelectAll:function(){
				//debugger;
				this.isCheckedAll = !this.isCheckedAll
				if (this.isCheckedAll) {
					// 全选时
					this.ulist = [];					
				    this.dataList.forEach(function (item) {						
						var categorylist = item.categorylist;
						for(var j = 0; j < categorylist.length; j++ ){
							var studentslist = categorylist[j].studentslist;
							for(var k = 0; k < studentslist.length; k++){
								var value = item.com_id + '-' + categorylist[j].cat_id + '-' + studentslist[k].uid;
								this.ulist.push(value);
							}
						}
					}, this);				  
				} else {
				  this.ulist = [];
				}
			},
			checkboxChange: function (e) {
				var items = this.dataList;
				var	values = e.detail.value;
				var str = '';
				var num = 0;
				//debugger;
				let companylist = items;
				this.ulist = [];
				for (var i = 0; i < companylist.length; i++) {
					let item = companylist[i];
					let categorylist = item.categorylist;
					for(var j = 0; j < categorylist.length; j++){
						let studentslist = categorylist[j].studentslist;
						for(var k = 0; k < studentslist.length; k++ ){
							var value = item['com_id'].toString()+'-'+item.categorylist[j]['cat_id'].toString()+'-'+studentslist[k]['uid'].toString();
							if(values.includes(value)){
								str = values + ",";	
								this.ulist.push(value);
								num ++;
							}
						}
					}
				}				
				if(str != ''){
					str = str.substr(0,str.length-1);
				}
				if(this.ulist.length == 0){
					this.isCheckedAll = false;
				}else{
					if(num == this.dataList_num){
						this.isCheckedAll = true;
					}else{
						this.isCheckedAll = false;
					}
				}				
				this.selectid = str;
			},			
			bindclick(sid){
				if( this.selectid.toString() == '') {
					uni.showToast({
						title: '请选择学生',
						icon: 'none'
					});
					return false;
				}
				//调用签到函数
				this.setSign(2,sid,this.selectid.toString(),'sksign');
			}
		}
	}
	
</script>


<style>	
	.btnlist{
		border-top:2px solid #eeeeee;
		padding-top: 40upx;
		width: 100%;
	}
	.btnlist button{
		float: left;
		width:30%;
		margin-left: 20upx;
	}
	.btnlist view{
		float: left;
		width: 20%;
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
