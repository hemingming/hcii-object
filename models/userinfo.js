/*
 * API 用户信息
 */
var request = require('request');
var nodeapi = require('./nodeapi.js');
var apiUrl = 'http://huacheng.china187.com/';

	exports.uinfo = function(req, res){
		var session = req.signedCookies;
			var userurl  = apiUrl+'user/welcome/';
			var userdata = null;
			var userid   = session.hc_cookie_uid['userOpenId'];
			var userip   = null;
			var username = session.hc_cookie_uid['name'];
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					var uintegral = data.data.assets.Integral;
					var userlevel = data.data.user.Grade;
					var userpic = data.data.user.PicId;
					//console.log(uintegral, userlevel, userpic);
					res.render('partials/userinfo',{
						userpicture : userpic,
						level : userlevel,
						uintegral : uintegral,
						username : '123'
					});
					
				}else{
					console.log(error,response.statusCode);
				}
			});
			//next();
			
	}
