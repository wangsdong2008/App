// 管理账号信息
const USERS_KEY = 'USERS_KEY';
const STATE_KEY = 'STATE_KEY';

/* const getUserKey = function(){
	return USERS_KEY;
} */

const GetRequestParameters = function(locationsearch){
	let url = locationsearch;
	let theRequest = new Object();
	if (url.indexOf('?') != -1) {
		let str = url.substr(1);
		let strs = str.split('&');
		for (let i = 0; i < strs.length; i++) {
			theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];
		}
	}
	return theRequest;
}

//校验邮箱格式
const checkEmail = function(email){
    return RegExp(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/).test(email);
}
//校验手机格式
const checkMobile = function(mobile){
    return RegExp(/^1[34578]\d{9}$/).test(mobile);
}

export default { 
	GetRequestParameters,
	checkMobile,
	checkEmail
}
