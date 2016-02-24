/*
 * API 数据交互
 */
var request = require('request');
var nodeidAPI  = '154118188e6ef2d1a59160be5c7c0294';
var nodestrAPI = '477cd490b295d05a36397a6320cd0883';
var md5 = null;

var userapi = function(userurl, userdata, userid, userip, callback) {

	var options = {
		url : userurl,
		method : 'POST',
		form : {
				appId : nodeidAPI,
				appSecret : nodestrAPI,
				userOpenId : userid,
				userIp : userip,
				data : userdata,
				md5 : null}
	}

	request.post(options, function(error, response, body){
		
		callback(error, response, body);
	});
};

module.exports.userapi = userapi;
