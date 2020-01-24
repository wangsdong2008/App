import Vue from 'vue'
import App from './App'

import store from './store'

Vue.config.productionTip = false

Vue.prototype.$store = store

//缓存标识
Vue.prototype.USERS_KEY = "userinfo";
Vue.prototype.Temp_KEY = "tempinfo";

Vue.prototype.STUDYTIME = "2019-06-01";

//图片地址
Vue.prototype.WebUrl = "http://192.168.1.103/";
Vue.prototype.PicUrl = Vue.prototype.Url + "uploadfile/" ;

//api接口变量
Vue.prototype.GeneralUrl = Vue.prototype.WebUrl + "api/general/"; //通用地址
Vue.prototype.ParentUrl = Vue.prototype.WebUrl + "api/parents/";   //家长地址
Vue.prototype.CompanyUrl = Vue.prototype.WebUrl + "api/company/"; //公司地址

//通用功能
Vue.prototype.LoginUrl = Vue.prototype.GeneralUrl + "dl" //登录地址
Vue.prototype.CheckTokenUrl = Vue.prototype.GeneralUrl + "checktoken" //检测是否登录，每天第一次打开进行检测
Vue.prototype.RegisterUrl = Vue.prototype.GeneralUrl + "register" //注册新用户
Vue.prototype.getSessionUrl = Vue.prototype.GeneralUrl + "getsessionid" //生成session
Vue.prototype.SendSmsUrl = Vue.prototype.GeneralUrl + "sendsms" //发短信

//家长相关
Vue.prototype.DayClassUrl = Vue.prototype.ParentUrl + "dayclass" //当天课程
Vue.prototype.AllChildrenUrl = Vue.prototype.ParentUrl + "getallchildren" //全部孩子
Vue.prototype.ShowChildrenUrl = Vue.prototype.ParentUrl + "getchildren" //获取单个孩子
Vue.prototype.ModifyChildrenUrl = Vue.prototype.ParentUrl + "modifychildren" //修改单个孩子
Vue.prototype.ModifyChildrenfaceUrl = Vue.prototype.ParentUrl + "modifychildrenface" //修改单个孩子头像
Vue.prototype.DelChildrenUrl = Vue.prototype.ParentUrl + "delchildren" //删除单个孩子
Vue.prototype.AllOrganUrl = Vue.prototype.ParentUrl + "organlist" //所有课程机构
Vue.prototype.OrganUrl = Vue.prototype.ParentUrl + "organshow" //所有课程机构
Vue.prototype.ModifyOrganUrl = Vue.prototype.ParentUrl + "organmodify" //所有课程机构
Vue.prototype.DelOrganUrl = Vue.prototype.ParentUrl + "organdel" //删除课程机构
Vue.prototype.ChildWeekUrl = Vue.prototype.ParentUrl + "childweeklist" //某一孩子一周课程安排
Vue.prototype.ModifyChildPlanUrl = Vue.prototype.ParentUrl + "childplanmodify" //某一孩子修改或者添加计划
Vue.prototype.DelChildPlanUrl = Vue.prototype.ParentUrl + "childplan" //删除某一孩子的计划
Vue.prototype.ShowChildPlanUrl = Vue.prototype.ParentUrl + "childplanshow" //显示某一计划 

//公司相关
//当天要接的孩子
Vue.prototype.GetCurrentStudents = Vue.prototype.CompanyUrl + "getcurrentstudents" //要接送的学生
Vue.prototype.GetCurrentCFStudents = Vue.prototype.CompanyUrl + "getcurrentcfstudents" //吃饭的学生
Vue.prototype.GetCurrentYgStudents = Vue.prototype.CompanyUrl + "getcurrentygchildren" //员工
Vue.prototype.GetAllStudents = Vue.prototype.CompanyUrl + "getallstudents"  //某一用户的所有企业下的学生
Vue.prototype.GetStudentsDetail = Vue.prototype.CompanyUrl + "getstudentsdetail" //学生的详细资料
Vue.prototype.GetStudentsCategory = Vue.prototype.CompanyUrl + "getstudentscategory"//学生所报的课程分类
Vue.prototype.GetStudentssign = Vue.prototype.CompanyUrl + "getstudentssign" //学生签到查询
Vue.prototype.SetsignUrl = Vue.prototype.CompanyUrl + "setsign"
Vue.prototype.GetBirthdaytStudentsUrl = Vue.prototype.CompanyUrl + "getbirthdaystudents"  //获取一周内过生日的学生

Vue.prototype.GetAllSubCompanyUrl = Vue.prototype.CompanyUrl + "getsubcompanylist"  //获取子公司
Vue.prototype.GetCompanyCategory = Vue.prototype.CompanyUrl + "getcompanycategory"  //获取子公司的培训课程
Vue.prototype.GetCompanyStatisticUrl = Vue.prototype.CompanyUrl + "getcompanystatistic"  //获取子公司某一课程的统计结果
Vue.prototype.GetAllSubCompanyCategoryUrl = Vue.prototype.CompanyUrl + "getsubcompanycategorylist"  //获取子公司所有分类
Vue.prototype.GetCategoryInfoUrl = Vue.prototype.CompanyUrl + "getcategoryinfo" //获取分类信息
Vue.prototype.UpdateCategoryInfoUrl = Vue.prototype.CompanyUrl + "updatecategoryinfo" //修改分类信息
Vue.prototype.DelCategoryInfoUrl = Vue.prototype.CompanyUrl + "delcategoryinfo" //删除分类信息

Vue.prototype.GetCompanyInfoUrl = Vue.prototype.CompanyUrl + "getcompanyinfo" //获取公司信息
Vue.prototype.UpdateCompanyInfoUrl = Vue.prototype.CompanyUrl + "updatecompanyinfo" //修改公司信息
Vue.prototype.DelCompanyInfoUrl = Vue.prototype.CompanyUrl + "delcompanyinfo" //删除公司信息

Vue.prototype.GetAllSchoolUrl = Vue.prototype.CompanyUrl + "getallschoollist" //获取所有学校
Vue.prototype.GetSchoolInfoUrl = Vue.prototype.CompanyUrl + "getschoolinfo" //获取学校信息
Vue.prototype.UpdateSchoolInfoUrl = Vue.prototype.CompanyUrl + "updateschoolinfo" //修改学校信息
Vue.prototype.DelSchoolInfoUrl = Vue.prototype.CompanyUrl + "delschoolinfo" //删除学校信息

//常用函数
//获取月份
Vue.prototype.GetStudyMonth = function () {	
	var startdate = new Date(this.STUDYTIME);
	var enddate = new Date();			   	
	var year_s = startdate.getFullYear(); //获取开始日期的年份
	var month_s = startdate.getMonth(); //获取开始日期的月份
	
	var year_e = enddate.getFullYear(); //获取当前日期的年份
	var month_e = enddate.getMonth() ; //获取当前日期的月份
	
	var arr = new Array();
	var y = year_s;
	var m = month_s;
	var len = (year_e - y)*12 - m + month_e;	
	m = m + 1;
	var str;
	for(var i = 0; i < len; i++){
		m = m + 1;
		if(m > 12){
			y = y + 1;
			m = 1;
		}
		str = "00"+m;
		arr[i] = y + "-" + str.substr(str.length-2,str.length);
	}	
	//把数组给反过来
	return arr.reverse();
}

//发送短信
Vue.prototype.sendsms = function (userInfo) {	
	uni.request({
		url:this.SendSmsUrl,
		header: {
	             "Content-Type": "application/x-www-form-urlencoded"							 
	    },
	    data: {
	        "mobile": userInfo.mobile,
			"t":Math.random()
	    },
	    method: "get",
		success: (res) => {
			var data = res.data;
			switch(parseInt(data.status)){
				case 0:{ //
					uni.showToast({
						title: '出错',
						mask: true,
						duration: 1500
					});
					break;
					}
				case 1:{ //
					uni.showToast({
						title: '出错2',
						mask: true,
						duration: 1500
					});
					break;
				}
				case 2:{
					uni.showToast({
						title: '手机号码已被使用，请更换',
						mask: true,
						duration: 1500
					});
					break;
				}
				case 3:{
					uni.showToast({
						title: '发送成功,请在5分钟内输入',
						mask: true,
						duration: 1500
					});
					break;
				}				
				case 4:{
					uni.showToast({
						title: '验证码不正确',
						mask: true,
						duration: 1500
					});
					break;
				}
				default:{
					uni.showToast({
					    title: '注册失败，请检查'
					});
					break;
				}
			}
		}
	});
}

Vue.prototype.getUsers = function () {
    let ret = '';
    ret = uni.getStorageSync(this.USERS_KEY);
    if (!ret) {
        ret = '[]';
    }
    return JSON.parse(ret);
}

//强制返回到前一个页面
Vue.prototype.reLaunchurl = function(url){	
	uni.reLaunch({
		url: url,
	});	
}
//普通跳转到某一页面
Vue.prototype.navigateTo = function(url){	
	uni.navigateTo({
		url: url,
	});	
}

//获取缓存中的用户信息
Vue.prototype.getUserInfo = function(){
	let ret = uni.getStorageSync(this.USERS_KEY);
	if(!ret){
		ret = '[]';
	}	
	return ret;
}

//退出
Vue.prototype.quit = function(){
	try {
		uni.clearStorageSync();  
	} catch (e) {  
	// error  
	}
	//this.logout();
	
	/**
	 * 如果需要强制登录跳转回登录页面
	 */	
	this.reLaunchurl('/pages/users/login/login');
}

//检查用户登录状态
Vue.prototype.checkLogin = function(){
	let that = this;
	let ret = uni.getStorageSync(that.USERS_KEY);
	if(ret == undefined || ret == ""){
		uni.reLaunch({
		    url: '/pages/users/login/login',
		});
	}
	var now = new Date();
	var year = now.getFullYear(); //得到年份
	var month = now.getMonth();//得到月份
	var date = now.getDate();//得到日期
	month = month + 1;
	if (month < 10) month = "0" + month;
	if (date < 10) date = "0" + date;
	var time = "";
	time = year + "-" + month + "-" + date;
	
	var ret_time = ret.time
	if(ret_time != time){ //去服务器上验证一次
		uni.request({
			url: that.CheckTokenUrl,
			header: {
		             "Content-Type": "application/x-www-form-urlencoded"							 
		    },
		    data: {
		        "token": ret.token,
		        "guid": ret.guid,
				"username":ret.username,
				"t":Math.random()
		    },
		    method: "post",
			success: (res) => {
				var data = res.data;
				if(data.status == 1){
					try {
						uni.removeStorageSync(that.USERS_KEY);
					} catch (e) {
						
					}           
					uni.setStorage({
						key:that.USERS_KEY,
						data:{
							id:ret.id,
							mobile:ret.mobile,
							username:ret.username,
							guid:ret.guid,
							token:ret.token,
							time:time,
							identity:ret.user_identity,
							is_brithday:data.is_brithday
						}
					});					
				}else{
					uni.reLaunch({
					    url: '/pages/users/login/login',
					});
				}				
			}
		});
	}	
}
Vue.prototype.addUsers = function(userInfo){
	//debugger;
	//if(userinfo == undefined) return;
	uni.request({
		url:this.RegisterUrl,
		header: {
	             "Content-Type": "application/x-www-form-urlencoded"							 
	    },
	    data: {
	        "mobile": userInfo.mobile,
	        "username": userInfo.username,
			"password":userInfo.password,
			"againpassword":userInfo.againpassword,
			"mail":userInfo.mail,
			"t":Math.random()
	    },
	    method: "get",
		success: (res) => {
			var data = res.data;
			switch(parseInt(data.status)){
				case 0:{
					uni.showToast({
						title: '两次密码不一致，请更换',
						mask: true,
						duration: 1500
					});
					break;
					}
				case 1:{
					uni.showToast({
						title: '用户名已被使用，请更换',
						mask: true,
						duration: 1500
					});
					break;
				}
				case 2:{
					uni.showToast({
						title: '手机号码已被使用，请更换',
						mask: true,
						duration: 1500
					});
					break;
				}
				case 3:{
					uni.showToast({
						title: '注册成功，请登录!',
						mask: true,
						duration: 1500,
						success: function(){  
							setTimeout(function() {
							    uni.reLaunch({  
									url: '../login/login'  
								});
							}, 2000);
						}  
					});
					break;
				}				
				case 4:{
					uni.showToast({
						title: '验证码不正确',
						mask: true,
						duration: 1500
					});
					break;
				}
				default:{
					uni.showToast({
					    title: '注册失败，请检查'
					});
					break;
				}
			}
		}
	});
}

/*
catid:1 课签到 2吃饭签到 3员工签到
status:1签到 2请假 3旷课
ulist:学生id
url:返回的Url地址
*/
Vue.prototype.setSign = function (catid,status,ulist,url,length) {
    let that = this;
	let ret = that.getUserInfo();
	const data = {
	    guid: ret.guid,
	    token: ret.token
	};
		
	uni.request({
		url: this.SetsignUrl,
		header: {
	        "Content-Type": "application/x-www-form-urlencoded"							 
	    },
	    data: {
			"guid": data.guid,
			"token":data.token,
			"status":status,
			"catid":catid,
			"uidlist":ulist,
			"t":Math.random()
	    },
	    method: "get",
		success: (res) => {
			if(res.data){
				let data = res.data.list; 
				switch(parseInt(res.data.status)){
					case 0:{
						uni.showToast({
							title: '操作失败',
							icon: 'none',
						});
					}
					case 2:{
						uni.showToast({
							title: '请选择要操作的学生',
							icon: 'none',
						});
					}
					case 3:{		
						//隔天处理
						//debugger;
						var items = this.ulist;
						var v1,v2,com_id,category_id,uid;
						var num;
						//debugger;
						for(var i = 0;i < items.length;i++){
							v1 = items[i];
							for(var j = 0;j<this.dataList.length;j++){
								com_id = this.dataList[j].com_id;
								let categorylist = this.dataList[j].categorylist;			
								for(var jj = 0; jj < categorylist.length; jj++){
									category_id = categorylist[jj].cat_id;
									let studentslist = categorylist[jj].studentslist;
									num = -1;
									for(var k = 0; k < studentslist.length; k++){
										uid = studentslist[k].uid;
										v2 = com_id + '-' + category_id +'-' + uid;
										num ++;
										if(v1 == v2){
											this.dataList_num -- ;
											this.dataList[j].categorylist[jj].studentslist.splice(num, 1);
										}
									}
								}
							}
						}
						if(num == this.dataList_num && this.dataList_num > 0){
							this.isCheckedAll = true;
						}else{
							this.isCheckedAll = false;
						}
						/* uni.showToast({
							title: '操作成功',
							icon: 'none',
						}); */
						
					}
				}
			}
		}
	});	
}

//获取临时sessionid
Vue.prototype.getcurrentsession = function(){
	//debugger;	
	/* try {
		uni.clearStorageSync();  
	} catch (e) {  
		// error  
	} */
	let that = this;
	let ret = uni.getStorageSync(that.Temp_KEY);
	if(!ret){//如果不能获取的话，获取新的sessionid
		that.getsessionsi();
	}
}

Vue.prototype.getsessionsi = function(){
	uni.request({
		url:this.getSessionUrl,
		header: {
	        "Content-Type": "application/x-www-form-urlencoded"
	    },
	    data: {
			"t":Math.random()
	    },
	    method: "get",
		success: (res) => {	
			var data = res.data;
			if( parseInt(data.status) == 3){
				uni.setStorage({
					key:this.Temp_KEY,
					data:data 
				});
			}
		}
	});	
}

//发送短信
/*
 status:1发送验证码短信，2取回密码短信，3生日祝福短信
*/
Vue.prototype.sendsms = function(datainfo){
	uni.request({
		url:this.SendSmsUrl,
		header: {
	             "Content-Type": "application/x-www-form-urlencoded"							 
	    },
	    data: {
			"token":datainfo.token,
			"mobile":datainfo.mobile,
			"status":datainfo.status,
			"smsid":datainfo.smsid,
			"t":Math.random()
	    },
	    method: "get",
		success: (res) => {
			var data = res.data;
			switch(parseInt(data.status)){
				case 1:{
					uni.showToast({
						title: '此号码已经存在，不需要重新注册',
						mask: true,
						duration: 1500
					});
					break;
					break;
				}
				case 2:{
					uni.showToast({
						title: '短信已获取，请在5分钟后再次点击获取',
						mask: true,
						duration: 1500
					});
					break;
				}
				case 3:{
					uni.showToast({
						title: '短信发送成功，请在5分钟内填写',
						mask: true,
						icon:"none",
						duration: 1500
					});
					break;
				}				
				default:{
					uni.showToast({
						title: '发送失败',
						mask: true,
						duration: 1500
					}); 
					break;
				}
				
			}
		}
	});	
}

Vue.prototype.navTo = function (item,index) {
	let _this = this;
	if (item.nav !== _this.currentPage) {
	    var isUrl = `/pages/${item.url}`;
	    const that = this;
		uni.navigateTo({
		    url: isUrl
		});
	} else {
	        /* this.$parent.toTop() */
	}
}

Vue.prototype.ScanAudio = function(mp3_name){
	var music = null;
	music = uni.createInnerAudioContext(); //创建播放器对象
	music.src= "../../../static/music/"+mp3_name+".mp3"; //选择播放的音频
	music.play(); //执行播放
}

App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
app.$mount()
