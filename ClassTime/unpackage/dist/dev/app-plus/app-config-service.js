
var isReady=false;var onReadyCallbacks=[];
var __uniConfig = {"pages":["pages/users/login/login","pages/company/company/sksign","pages/users/reg/reg","pages/parents/parents/index","pages/company/company/index","pages/company/company/studentssearch","pages/company/company/studentsshow","pages/company/company/statistics","pages/company/company/statisticsstudents","pages/company/company/statisticscompany","pages/company/company/statisticsresult","pages/company/company/statisticcompanysresult","pages/company/company/cfsign","pages/company/company/ygsign","pages/company/company/birthday","pages/index/index"],"window":{"navigationBarTextStyle":"black","navigationBarTitleText":"uni-app","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8"},"splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"ClassTime","compilerVersion":"2.5.1","entryPagePath":"pages/users/login/login","networkTimeout":{"request":6000,"connectSocket":6000,"uploadFile":6000,"downloadFile":6000}};
var __uniRoutes = [{"path":"/pages/users/login/login","meta":{"isQuit":true},"window":{"navigationBarTitleText":"登录"}},{"path":"/pages/company/company/sksign","meta":{},"window":{"navigationBarTitleText":"上课签到"}},{"path":"/pages/users/reg/reg","meta":{},"window":{"navigationBarTitleText":"注册新用户"}},{"path":"/pages/parents/parents/index","meta":{},"window":{"navigationBarTitleText":"家长页面"}},{"path":"/pages/company/company/index","meta":{},"window":{"navigationBarTitleText":"机构页面"}},{"path":"/pages/company/company/studentssearch","meta":{},"window":{"navigationBarTitleText":"学生查询"}},{"path":"/pages/company/company/studentsshow","meta":{},"window":{"navigationBarTitleText":"学生详情"}},{"path":"/pages/company/company/statistics","meta":{},"window":{"navigationBarTitleText":"统计"}},{"path":"/pages/company/company/statisticsstudents","meta":{},"window":{"navigationBarTitleText":"学生选择"}},{"path":"/pages/company/company/statisticscompany","meta":{},"window":{"navigationBarTitleText":"公司统计"}},{"path":"/pages/company/company/statisticsresult","meta":{},"window":{"navigationBarTitleText":"统计结果"}},{"path":"/pages/company/company/statisticcompanysresult","meta":{},"window":{"navigationBarTitleText":"公司统计结果"}},{"path":"/pages/company/company/cfsign","meta":{},"window":{"navigationBarTitleText":"吃饭签到"}},{"path":"/pages/company/company/ygsign","meta":{},"window":{"navigationBarTitleText":"员工签到"}},{"path":"/pages/company/company/birthday","meta":{},"window":{"navigationBarTitleText":"生日提醒"}},{"path":"/pages/index/index","meta":{},"window":{"navigationBarTitleText":"首页","titleNView":false}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes}}}});
