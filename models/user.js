var request = require('request'),
	version = require('./version.js'),
	nodeip = require('./nodeip.js');

//API调用
var nodeapi = require('./nodeapi.js');
var apiUrl = 'http://huacheng.china187.com/';


//登录
exports.login = function(req, res){
	res.render('login');
};


//注册
exports.register = function(req, res){
	res.render('register');
};

//认证
exports.authen = function(req, res){
	var session = req.signedCookies;
	if(session.hc_cookie_noid === undefined){
		res.redirect(303, '/register');
	}else{
		var tempId   = session.hc_cookie_noid;
		var sms = parseInt(Math.random()*9000+1000);
		console.log('短信:'+sms);
		res.cookie('hc_cookie_sms', sms, { httpOnly: true, signed: true, maxAge: 60*5000 });//短信签名COOKIE
		var getuserip, ipAddress, headers = req.headers;
		nodeip.clientIP(ipAddress, headers, function(ipAddress){getuserip = ipAddress;});
		var userurl  = apiUrl+'form/message/';
		var userdata = {'address' : tempId, 'info' : sms, 'type' : 'tempId'};	//指定 tempId 发送短信
		var userid   = null;
		var userip   = getuserip;
		

		nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('认证短信：'+body);		//EROR DEBUG
				if(response.statusCode == 200){
					return;
				}else{
					console.log(error, response.statusCode);	
				}
		});
		var friend = session.hc_cookie_friend;
		if(friend !== undefined){
			res.render('authen', {
				friend : friend,
				recode : 'hidden',
				userId : tempId
			});
		}else{
			res.render('authen', {
				recode : 'text',
				userId : tempId
			});	
		}
	}
};

//找回登录密码
exports.getpassword = function(req, res){
	res.render('getpassword');
};

//用户中心首页
exports.usercenter = function(req, res){
		var session = req.signedCookies;
		if(session.hc_cookie_uid === undefined || session.hc_cookie_uid['userOpenId'] === null){
			res.redirect(303, '/authen');
		}else{
			var getuserip, ipAddress, headers = req.headers;
			nodeip.clientIP(ipAddress, headers, function(ipAddress){getuserip = ipAddress;});
			var userurl  = apiUrl+'user/welcome/';
			var userdata = null;
			var userid   = session.hc_cookie_uid['userOpenId'];
			var userip   = getuserip;
			var username = session.hc_cookie_uid['name'];
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('用户中心:'+body);	//EROR DEBUG

				if(response.statusCode == 200){
	        	var error = body.indexOf('<return_data>');if(error < 0 ){res.redirect(303, '/500');}

					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					
					var uintegral = data.data.assets.Integral;
					var userlevel = data.data.user.Grade;
					var userpic = data.data.user.PicId;

					var umoney = data.data.assets.Fund;
					//console.log(data.data.assets.Fund+data.data.assets.AreAmount+data.data.assets.AreInterest);
					var ucount = Number(data.data.assets.Fund)+Number(data.data.assets.AreAmount)+Number(data.data.assets.Vault);

					var uvault = data.data.assets.Vault;
					var lvault = data.data.assets.Profit;
					var nowday = data.data.assets.OrVault;
					
					var ac1 = data.data.assets.AreAmount;
					var ac2 = data.data.assets.AreInterest;
					var ac3 = data.data.assets.Interest;
					if(ac2 === undefined){ac2 = 0;}
					if(ac3 === undefined){ac3 = 0;}
					var area = Number(ac1)+Number(ac2)+Number(ac3);
					var pro = data.data.sum;
					//console.log(ac1, ac2, ac3, area);
					if(ac1 == '0.00'){
						var pera = 0;
						var perb = 0;
						var perc = 0;
					}else{
							var pera = Math.ceil(Number(ac1)/area.toFixed(2)*100);
							var perb = Math.ceil(Number(ac2)/area.toFixed(2)*100);
							var perc = Math.ceil(Number(ac3)/area.toFixed(2)*100);
					}
					res.render('user/user',{
						user : 'on',
						uvault : uvault,
						umoney : umoney,
						lvault : lvault,
						nowday : nowday,
						userpicture : userpic,
						level : userlevel,
						uintegral : uintegral,
						ucount : ucount.toFixed(2),
						inte : ac2,
						pro : pro,
						pera : pera,
						perb : perb,
						perc : perc,
						username : username
					});
					//console.log(ac1, ac2, ac3, area);

				}else{
					console.log(error,response.statusCode);
				}
			});

		}
};

//资金管理
exports.fund = function(req, res){
		var userurl  = apiUrl+'user/welcome/';
		var userdata = null;
		var userip   = null;
		var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
		var username = req.signedCookies.hc_cookie_uid['name'];
		nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){
			if(response.statusCode == 200){
				var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
				var uintegral = data.data.assets.Integral;
				var userlevel = data.data.user.Grade;
				var userpic = data.data.user.PicId;
				res.render('user/fund',{
					fund  : 'on',
					userpicture : userpic,
					level : userlevel,
					uintegral : uintegral,
					username : username
				});
			}else{
				console.log(error,response.statusCode);
			}
		});
					
};


//充值
exports.recharge = function(req, res){
	var username = req.signedCookies.hc_cookie_uid['name'];
	var mobile = req.signedCookies.hc_cookie_uid['mobile'];
	var phone = req.signedCookies.hc_cookie_uid['mobileCode'];
			var userip   = null;
			var userurl  = apiUrl+'user/bank/';
			var userdata = null;
			var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){	
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);
					var data = JSON.parse(data[1]);
					var cards = data.data.list;
					res.render('user/recharge', {
						fund  : 'on',
						username : username,
						mobile : mobile,
						phone : phone,
						cards : cards

					});
					
				}else{
					console.log(error,response.statusCode);
				}
			});
};
exports.payment = function(req, res){
	var username = req.signedCookies.hc_cookie_uid['name'];
		/*
	    'money',充值金额
	    'number',银行卡号
	    'province',省(数字如：3)
	    'city',市（字符串如：南京市）
	    'subBank',支行
	    'code',银行编码上面数组里
		*/
		var money = req.body.amount;
		var number = req.body.number;
		//var bankcode = req.body.bankcode;
		//var province = req.body.province;
		//var city = req.body.city;
		//var subbank = req.body.subbank;

			var userdata = {'money' : money, 'number' : number};
			console.log(userdata);
			var getuserip, ipAddress, headers = req.headers;
			nodeip.clientIP(ipAddress, headers, function(ipAddress){getuserip = ipAddress;});
			var userip   = getuserip;
			var userurl  = apiUrl+'money/pay/';
			var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('充值:'+body);	//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					var lianlian = data.data.html;
					res.render('user/payment', {
						paymentbody : lianlian,
						username : username
					});
				}else{
					console.log(error,response.statusCode);
				}
			});
			
};
exports.userpayment = function(req, res){
	var username = req.signedCookies.hc_cookie_uid['name'];
		/*
		第二次
		*/
		var money = req.body.amount;
		var cardDelId = req.body.cardid;
		var code = req.body.code;
			if(code === '' || code === null || code === undefined){
				var userdata = {'money' : money, 'cardDelId' : cardDelId};
			}else{
				var userdata = {'money' : money, 'code' : code};
			}
			console.log(userdata);
			var getuserip, ipAddress, headers = req.headers;
			nodeip.clientIP(ipAddress, headers, function(ipAddress){getuserip = ipAddress;});
			var userip   = getuserip;
			var userurl  = apiUrl+'money/pay/';
			var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('充值:'+body);	//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					var lianlian = data.data.html;
					res.render('user/payment', {
						paymentbody : lianlian,
						username : username
					});
				}else{
					console.log(error,response.statusCode);
				}
			});
			
};

//提现
exports.withdraw = function(req, res){
	var username = req.signedCookies.hc_cookie_uid['name'];
	var mobile = req.signedCookies.hc_cookie_uid['mobile'];
	var phone = req.signedCookies.hc_cookie_uid['mobileCode'];
			var userip   = null;
			var userurl  = apiUrl+'user/bank/';
			var userdata = null;
			var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('银行卡列表：'+body);		//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);
					var data = JSON.parse(data[1]);
					var cards = data.data.list;
					console.log(cards);
					res.render('user/withdraw', {
						fund  : 'on',
						username : username,
						mobile : mobile,
						phone : phone,
						cards : cards

					});
					
				}else{
					console.log(error,response.statusCode);
				}
			});
};

//银行卡管理
exports.bank = function(req, res){
	var username = req.signedCookies.hc_cookie_uid['name'];

	res.render('user/bank', {
		fund  : 'on',
		username : username

	});
};

//投资管理
exports.invest = function(req, res){
			var username = req.signedCookies.hc_cookie_uid['name'];
			var userdata = null;
			var getuserip, ipAddress, headers = req.headers;
			nodeip.clientIP(ipAddress, headers, function(ipAddress){getuserip = ipAddress;});
			var userip   = getuserip;
			var userurl  = apiUrl+'user/finance/';
			var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){//console.log('订单列表:'+body);	//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					var pages = data.data.rows;	//pageNumber
						res.render('user/invest', {
							pagecount : pages,
							invest   : 'on',
							username : username
						});
				}else{
					console.log(error,response.statusCode);
				}
			});
};

//帐户安全
exports.safety = function(req, res){
	var mobile = req.signedCookies.hc_cookie_uid['mobileCode'];					
	var username = req.signedCookies.hc_cookie_uid['name'];
	var mobilecode = req.signedCookies.hc_cookie_uid['mobile'];
	res.render('user/safety', {
		mobile   : mobile,
		mobilecode : mobilecode,
		safety   : 'on',
		username : username
	});
};

//智能投资
exports.intell = function(req, res){
	var username = req.signedCookies.hc_cookie_uid['name'];
		var userdata = null;
		var userip   = null;
		var userurl  = apiUrl+'user/reserve/';
		var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
		nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('智能投资列表:'+body);	//EROR DEBUG
			if(response.statusCode == 200){
				var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
				var intell = data.data.list;
				res.render('user/intell', {
					lists : intell,
					intell   : 'on',
					username : username
				});
			}else{
				console.log(error,response.statusCode);
			}
		});

};

//我的卡券
exports.card = function(req, res){
	var username = req.signedCookies.hc_cookie_uid['name'];
		var userdata = null;
		var userip   = null;
		var userurl  = apiUrl+'user/card/';
		var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
		nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){//console.log('卡券列表:'+body);	//EROR DEBUG
			if(response.statusCode == 200){
				var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
				var cards = data.data.list;
				res.render('user/card', {
					cards : cards,
					card   : 'on',
					username : username

				});
			}else{
				console.log(error,response.statusCode);
			}
		});

};

//消息中心
exports.message = function(req, res){
	var username = req.signedCookies.hc_cookie_uid['name'];
		var userdata = null;
		var userip   = null;
		var userurl  = apiUrl+'user/message/';
		var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
		nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('消息列表:'+body);	//EROR DEBUG
			if(response.statusCode == 200){
				var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
				var messages = data.data.list;
				res.render('user/message', {
					messages : messages,
					message   : 'on',
					username : username
				});
			}else{
				console.log(error,response.statusCode);
			}
		});

};

//邀请好友
exports.friend = function(req, res){
	var username = req.signedCookies.hc_cookie_uid['name'];
		var userdata = null;
		var userip   = null;
		var userurl  = apiUrl+'user/activities/';
		var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
		nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('邀请好友:'+body);	//EROR DEBUG
			if(response.statusCode == 200){
				var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
				var code = data.data.user;
				console.log(data);
				res.render('user/friend', {
					friends : code,
					number : data.data.rows,
					friend   : 'on',
					username : username
				});
			}else{
				console.log(error,response.statusCode);
			}
		});

};

//积分换购
exports.integral = function(req, res){
	var username = req.signedCookies.hc_cookie_uid['name'];
		var userdata = null;
		var userip   = null;
		var userurl  = apiUrl+'user/integral/';
		var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
		nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('积分换购:'+body);	//EROR DEBUG
			if(response.statusCode == 200){
				var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);

			}else{
				console.log(error,response.statusCode);
			}
		});
		res.render('user/integral', {
			integral   : 'on',
			username : username
		});
};

//帐户设置
exports.information = function(req, res){
	var mobile = req.signedCookies.hc_cookie_uid['mobileCode'];	
	var username = req.signedCookies.hc_cookie_uid['name'];
		var userdata = null;
		var userip   = null;
		var userurl  = apiUrl+'user/user_info/';
		var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
		nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('积分换购:'+body);	//EROR DEBUG
			if(response.statusCode == 200){
				var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
				var info = data.data.info;
				res.render('user/information', {
					information   : 'on',
					username : username,
					mobile : mobile,
					info : info
				});
			}else{
				console.log(error,response.statusCode);
			}
		});


};




