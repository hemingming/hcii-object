/*
 * 用户业务逻辑路由 Ming
 * hc_cookie_uid 登录信息  / hc_cookie_noid 激活信息  / hc_cookie_verify 图片验证  / hc_cookie_sms 短信验证
 */

var request = require('request'),
	captcha = require('../models/captcha.js'),
	nodeip  = require('../models/nodeip.js');

//API调用
var nodeapi = require('../models/nodeapi.js'),
	apiUrl = 'http://huacheng.china187.com/';
	/*
	if(req.xhr){
		console.log('ajax');
	}else{
		console.log('http');
	}
	req.session.flash = { message : 'ok'};
	console.log(req.session.flash, req.session.user);
	*/

module.exports = {
	userRoutes : function(app){
		//验证脚本
		app.post('/scriptevent', this.hcScript);

		//验证码
		app.get('/captcha', captcha.captcha);

	    //登录数据
		app.post('/userlogin', this.userLogin);

	    //验证登录数据
		app.post('/veruserlogin', this.verLogin);

		//认证短信
		app.post('/sentmeagess', this.authSMS);

		//找回密码通用短信
		app.post('/sentsms', this.sentSMS);

		//注册数据
		app.post('/userregister', this.userRegister);

		//认证数据
		app.post('/userauth', this.userToken);

		//找回登录密码
		app.post('/loginpwd', this.loginGetpwd);

		//订单提交
		app.post('/paybill', this.billOrder);

		//订单支付
		app.post('/topay', this.billPay);

		//列表数据
		app.post('/loadproducts', this.Products);

		//转让列表
		app.post('/loadtransfer',  this.Transfer);

		//转让查看
		app.post('/transferid', this.transferId);
		//转让支付
		app.post('/transferpay', this.transferPay);
			
			//usercenter
			app.post('/userinfo', this.userInfo);
			app.post('/setuserinfo', this.saveUser);
			//查看项目
			app.post('/billdetail', this.userBill);

			//收益宝
			app.post('/userturn', this.turnMoney);
			
			//资金记录
			app.post('/loadfund', this.loadFund);

			
			//修改登录密码
			app.post('/modpassword', this.modUserpwd);

			//修改交易密码
			app.post('/modpaypass', this.modPaypwd);

			
			//找回交易密码
			app.post('/findsms', this.findSMS);
			app.post('/getpaypass', this.getPaypwd);

			//智能投资
			app.post('/setintell', this.setIntell);
			app.post('/stepintell', this.modIntell);
			app.post('/delintell', this.delIntell);

			//添加银行卡
			//app.post('/usertobank', this.addBank);
			//app.post('/userbank', this.showBank);
			//app.post('/editbank', this.editBank);

			//卡券
			app.post('/usercard', this.userCard);

			//债权转让
			app.post('/usertransfer', this.userTransfer);	//列表
			app.post('/transfer', this.toTransfer);			//参数
			app.post('/suretransfer', this.sureTransfer);	//转出

			//充值
			//app.post('/usertorecharge', this.payRecharge);
			
			//提现
			app.post('/userwithdraw', this.userWithdraw);


		//退出
		app.get('/out', this.userOut);


	},

	hcScript : function(req, res, next){
		var scriptid = req.body.interfacekey;
		if(scriptid === 'huachengjinrong'){res.json(0)}else{res.json(-999)}
	},

	userLogin : function(req, res, next){
		var account  = req.body.username;
		req.session.user = account;
		var userurl  = apiUrl+'account/login/';
		var userdata = req.body;
		var userid   = null;
		var getuserip, ipAddress, headers = req.headers;
		nodeip.clientIP(ipAddress, headers, function(ipAddress){getuserip = ipAddress;});
		var userip   = getuserip;
		nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('登录:'+body);	//EROR DEBUG
			if(response.statusCode == 200){
				var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
				if(data.statusCode == 1.9){
					var cookie_key = data.data['tempId'];//激活
					res.cookie('hc_cookie_noid', cookie_key, { httpOnly: true, signed: true, maxAge: 60*10000 }).json(data);
				}else if(data.statusCode == 0){
					var cookie_key = data.data;//['userOpenId'];
					res.cookie('hc_cookie_uid', cookie_key, { httpOnly: true, signed: true, maxAge: 60*60000 }).json(data);

				}else{
					res.json(data);
				}
			}else{
				console.log(error,response.statusCode);
				res.redirect(303, '/500');
			}
		});
	},

	verLogin : function(req, res, next){
		var account  = req.body.username;
		var password = req.body.password;
		var vercode  = req.body.vercode;
		var vercookie = req.signedCookies;   //验证码签名COOKIE
		if(vercode ===  vercookie.hc_cookie_verify){
			var getuserip, ipAddress, headers = req.headers;
			nodeip.clientIP(ipAddress, headers, function(ipAddress){getuserip = ipAddress;});
			var userip   = getuserip;
			var userurl  = apiUrl+'account/login/';
			var userdata = {'username' : account, 'password' : password, 'verify' : '8e3acda8ff58bb99c08c0e9c4b5d63ef'};
			var userid   = null;
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('验证登录:'+body);	//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					if(data.statusCode == 1.9){
						var cookie_key = data.data['tempId'];//激活
						res.cookie('hc_cookie_noid', cookie_key, { httpOnly: true, signed: true, maxAge: 60*10000 }).json(data);
					}else if(data.statusCode == 0){
						var cookie_key = data.data;//['userOpenId'];
						res.cookie('hc_cookie_uid', cookie_key, { httpOnly: true, signed: true, maxAge: 60*30000 }).json(data);
					}else{
						res.json(data);
					}
				}else{
					console.log(error,response.statusCode);
					res.redirect(303, '/500');
				}
			});
		}else{
			res.json('验证码错误');
		}
	},

	userRegister : function(req, res, next){
		var account  = req.body.username;
		var password = req.body.password;
		var surepass = req.body.surepass;
		var vercode  = req.body.vercode;
		req.session.user = account;

		var vercookie = req.signedCookies;   //验证码签名COOKIE
		if(vercode ===  vercookie.hc_cookie_verify){
			var getuserip, ipAddress, headers = req.headers;
			nodeip.clientIP(ipAddress, headers, function(ipAddress){getuserip = ipAddress;});
			var userip   = getuserip;
			var userurl  = apiUrl+'account/register/';
			var userdata = {'username' : account, 'password' : password};
			var userid   = null;
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('注册:'+body);	//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					if(data.statusCode == 0){
						var cookie_key = data.data['tempId'];//['userOpenId'];
						res.cookie('hc_cookie_noid', cookie_key, { httpOnly: true, signed: true, maxAge: 60*10000 }).json(data);
					}else{
						res.json(data);
					}
				}else{
					console.log(error,response.statusCode);
				}
			});
		}else{
			res.json('验证码错误');
		}
	},

	userToken : function(req, res, next){
		var authname  = req.body.name;			//姓名
		var authid = req.body.idCard;			//身份证号
		var paypass = req.body.payment;			//交易密码
		var recommend  = req.body.recommend;	//推荐人
		var smscode = req.body.smscode;			//短信
		var tempId = req.body.tempId;
		var session = req.signedCookies;
		if(session.hc_cookie_sms === smscode){
			var getuserip, ipAddress, headers = req.headers;
			nodeip.clientIP(ipAddress, headers, function(ipAddress){getuserip = ipAddress;});
			var userip   = getuserip;
			var userurl  = apiUrl+'form/active/';
			var userdata = {'tempId' : tempId, 'name' : authname, 'idCard' : authid, 'payment' : paypass, 'recommend' : recommend };
			var userid   = null;
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('认证:'+body);	//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					if(data.statusCode == 0){
						var cookie_key = data.data;//['userOpenId'];clearCookie('hc_cookie_noid').
						res.cookie('hc_cookie_uid', cookie_key, { httpOnly: true, signed: true, maxAge: 60*30000 }).json(data);
					}else{
						res.json(data);
						//res.redirect(303, '/login');
					}
				}else{
					console.log(error,response.statusCode);
				}
			});
		}else{
			res.json('短信验证码错误');
		}
	},

	authSMS : function(req, res, next){
		var sms = parseInt(Math.random()*9000+1000);
		res.cookie('hc_cookie_sms', sms, { httpOnly: true, signed: true, maxAge: 60*5000 });//短信签名COOKIE	
		var tempId = req.body.tempId;
			var getuserip, ipAddress, headers = req.headers;
			nodeip.clientIP(ipAddress, headers, function(ipAddress){getuserip = ipAddress;});
			var userip   = getuserip;
			var userurl  = apiUrl+'form/message/';
			var userdata = {'address' : tempId, 'info' : sms, 'type' : 'tempId'};
			var userid   = null;
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('认证短信:'+body);	//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					if(data.statusCode == 0){
						res.json(data);
					}else{
						res.json(data);
					}
				}else{
					console.log(error,response.statusCode);
				}
			});
	},
	
	sentSMS : function(req, res, next){
		var sms = parseInt(Math.random()*9000+1000);
		res.cookie('hc_cookie_sms', sms, { httpOnly: true, signed: true, maxAge: 60*5000 });//短信签名COOKIE	
		var vercode   = req.body.vercode;
		var vercookie = req.signedCookies;   //图片验证码签名COOKIE
		var mobile   = req.body.mobile;
		if(vercode ===  vercookie.hc_cookie_verify){
			var getuserip, ipAddress, headers = req.headers;
			nodeip.clientIP(ipAddress, headers, function(ipAddress){getuserip = ipAddress;});
			var userip   = getuserip;
			var userurl  = apiUrl+'form/message/';
			var userdata = {'address' : mobile, 'info' : sms, 'type' : 'moblie'};
			var userid   = null;
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('短信:'+body);	//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					if(data.statusCode == 0){
						res.json(data);
					}else{
						res.json(data);
					}
				}else{
					console.log(error,response.statusCode);
				}
			});
		}else{
			res.json('验证码错误');
		}
	},
	findSMS : function(req, res, next){
		var sms = parseInt(Math.random()*9000+1000);
		res.cookie('hc_cookie_sms', sms, { httpOnly: true, signed: true, maxAge: 60*5000 });//短信签名COOKIE	
		var mobile   = req.body.mobile;
			var getuserip, ipAddress, headers = req.headers;
			nodeip.clientIP(ipAddress, headers, function(ipAddress){getuserip = ipAddress;});
			var userip   = getuserip;
			var userurl  = apiUrl+'form/message/';
			var userdata = {'address' : mobile, 'info' : sms, 'type' : 'moblie'};
			var userid   = null;
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('短信:'+body);	//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					if(data.statusCode == 0){
						res.json(data);
					}else{
						res.json(data);
					}
				}else{
					console.log(error,response.statusCode);
				}
			});
	},

	loginGetpwd : function(req, res, next){
		var vercode   = req.body.vercode;
		var vercookie = req.signedCookies;   //图片验证码签名COOKIE
		var account   = req.body.username; 
		var password  = req.body.password;
		var surepass  = req.body.surepass;
		var smscode   = req.body.smscode;
		if(password !== surepass){
			res.json('请确认密码是否一致');
			return false;
		}
		if(vercode !==  vercookie.hc_cookie_verify){
			res.json('图片验证码错误');
			return false;
		}else if(smscode !== vercookie.hc_cookie_sms || vercookie.hc_cookie_sms === undefined){
			res.json('短信验证码错误');
			return false;
		}else{
			var getuserip, ipAddress, headers = req.headers;
			nodeip.clientIP(ipAddress, headers, function(ipAddress){getuserip = ipAddress;});
			var userip   = getuserip;
			var userurl  = apiUrl+'form/password_recovery/';
			var userdata = {'username' : account, 'newPassword' : password};
			var userid   = null;
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('找回登录密码:'+body);	//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					if(data.statusCode == 0){
						var cookie_key = data.data;//['userOpenId'];
						res.cookie('hc_cookie_uid', cookie_key, { httpOnly: true, signed: true, maxAge: 60*30000 }).json(data);
						res.redirect(303, '/user');
					}else{
						res.json(data);
					}
				}else{
					console.log(error,response.statusCode);
				}
			});
		}
	},

	userInfo : function(req, res, next){
			var userurl  = apiUrl+'user/welcome/';
			var userip   = null;
			var userdata = null;
			var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
			var username = req.signedCookies.hc_cookie_uid['name'];
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					res.json(data);
				}else{
					console.log(error,response.statusCode);
				}
			});
	},

	turnMoney : function(req, res, next){
			var getuserip, ipAddress, headers = req.headers;
			nodeip.clientIP(ipAddress, headers, function(ipAddress){getuserip = ipAddress;});
			var userip   = getuserip;
			var userurl  = apiUrl+'form/vault/';
			var userdata = req.body;
			var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('收益宝转入转出:'+body);	//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					if(data.statusCode == 0){
						res.json(data);
					}else{
						res.json(data);
					}
				}else{
					console.log(error,response.statusCode);
				}
			});
	},

	loadFund : function(req, res, next){
		var pageSize  = req.body.pageSize;		//条数
		var pageIndex = req.body.pageIndex;		//指针
		var userurl = req.body.url;
			var userdata = null;
			var userip   = null;
			var userurl  = apiUrl+'money/lists/'+userurl+'/'+pageSize+'/'+pageIndex+'/';
			var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('AJAX资金列表:'+body);	//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					res.json(data);
				}else{
					console.log(error,response.statusCode);
				}
			});
	},

	Transfer : function(req, res, next){
		//http://huacheng.china187.com/finance/transfer/lists/条数 = 15/指针 = 0/剩余周期 = 0/转让利率 = 0
		var pageSize  = req.body.pageSize;		//条数
		var pageIndex = req.body.pageIndex;		//指针
		var hcCycle	  = req.body.hcCycle;		//周期
		var hcRates   = req.body.hcRates;		//利率
			var getuserip, ipAddress, headers = req.headers;
			nodeip.clientIP(ipAddress, headers, function(ipAddress){getuserip = ipAddress;});
			var userip   = getuserip;
			var userurl  = apiUrl+'finance/transfer/lists/'+pageSize+'/'+pageIndex+'/'+hcRates+'/'+hcCycle;
			var userdata = null;
			var userid   = null;
			//console.log(userurl);
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('转让列表：'+body);		//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					res.json(data);
				}else{
					console.log(error,response.statusCode);
				}
			});	
	},
	transferId :  function(req, res, next){
		if(req.signedCookies.hc_cookie_uid === undefined || req.signedCookies.hc_cookie_uid === null){
			res.json(-999);
		}else{
			var getuserip, ipAddress, headers = req.headers;
			nodeip.clientIP(ipAddress, headers, function(ipAddress){getuserip = ipAddress;});
			var userip   = getuserip;
			var userurl  = apiUrl+'finance/transfer/order/'+req.body.itemdelid;
			var userdata = null;
			var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('转让详情：'+body);		//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					res.json(data);
				}else{
					console.log(error,response.statusCode);
				}
			});
		}	
	},
	transferPay : function(req, res, next){
		var orderDelId = req.body.orderdelid;
		var payment = req.body.payment;
		if(req.signedCookies.hc_cookie_uid === undefined || req.signedCookies.hc_cookie_uid === null){
			res.json(-999);
		}else{
			
			var userip   = null;
			var userurl  = apiUrl+'form/accept/';
			var userdata = {'orderDelId':orderDelId, 'payment':payment};
			var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('转让购买：'+body);		//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					res.json(data);
				}else{
					console.log(error,response.statusCode);
				}
			});
		}
	},
	userBill : function(req, res, next){
		var bill = req.body.delId;
		var userurl  = apiUrl+'/finance/order/info/'+bill+'/';
		var userdata = null;
		var userip   = null;
		var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
		
		nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){//EROR DEBUG
	        if(response.statusCode == 200){
				var data  = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data  = JSON.parse(data[1]);
				res.json(data);
			}else{
				console.log(error,response.statusCode);
			}
		});
	},

	Products : function(req, res, next){
		var pageSize  = req.body.pageSize;		//条数
		var pageIndex = req.body.pageIndex;		//指针
		var hcType    = req.body.hcType;		//类型
		var hcAmount  = req.body.hcAmount;		//金融
		var hcCycle	  = req.body.hcCycle;		//周期
		var hcRates   = req.body.hcRates;		//利率
			console.log(pageSize, pageIndex, hcType, hcAmount, hcCycle, hcRates);
			var getuserip, ipAddress, headers = req.headers;
			nodeip.clientIP(ipAddress, headers, function(ipAddress){getuserip = ipAddress;});
			var userip   = getuserip;
			var userurl  = apiUrl+'item/lists/'+pageSize+'/'+pageIndex+'/'+hcType+'/0/'+hcCycle+'/'+hcRates+'/'+hcAmount+'/0/';
			var userdata = null;
			var userid   = null;
			console.log(userurl);
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('产品列表：'+body);		//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					res.json(data);
				}else{
					console.log(error,response.statusCode);
				}
			});	
	},
	billOrder : function(req, res, next){
		if(req.signedCookies.hc_cookie_uid === undefined || req.signedCookies.hc_cookie_uid === null){
			res.json(-999);
		}else{
			//var mobile = req.signedCookies.hc_cookie_uid['mobile'];
			var slug = req.body.slug;
			var copies = req.body.copies;
			var code = req.body.code;
			var cardDelId = req.body.cardid;
				var getuserip, ipAddress, headers = req.headers;
				nodeip.clientIP(ipAddress, headers, function(ipAddress){
					getuserip = ipAddress;
				});
				var userip   = getuserip;
				var userurl  = apiUrl+'item/order/';
				var userdata = {'itemDelId' : slug, 'orderCode' : code, 'orderCopies' : copies, 'cardDelId' : cardDelId};
				var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
				nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('订单确认：'+body);		//EROR DEBUG
					if(response.statusCode == 200){
						var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
						res.json(data);
					}else{
						console.log(error,response.statusCode);
					}
				});		
		}
	},
	billPay : function(req, res, next){
		if(req.signedCookies.hc_cookie_uid === undefined || req.signedCookies.hc_cookie_uid === null){
			res.json(-999);
		}else{
				var getuserip, ipAddress, headers = req.headers;
				nodeip.clientIP(ipAddress, headers, function(ipAddress){
					getuserip = ipAddress;
				});
				var userip   = getuserip;
				var userurl  = apiUrl+'form/bill_pay/';
				var userdata = req.body;
				//console.log(userdata);
				var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
				nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('支付订单：'+body);		//EROR DEBUG
					if(response.statusCode == 200){
						var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
						res.json(data);
					}else{
						console.log(error,response.statusCode);
					}
				});		
		}
	},

	userTransfer : function(req, res, next){
		var pageSize  = req.body.pageSize;		//条数
		var pageIndex = req.body.pageIndex;		//指针
		var state = req.body.state;
			var userdata = null;
			var userip   = null;
			var userurl  = apiUrl+'user/finance/'+pageSize+'/'+pageIndex+'/'+state;
			var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('订单列表:'+body);	//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					res.json(data);
				}else{
					console.log(error,response.statusCode);
				}
			});

	},
	toTransfer : function(req, res, next){
			var delid = req.body.delid;

				var getuserip, ipAddress, headers = req.headers;
				nodeip.clientIP(ipAddress, headers, function(ipAddress){
					getuserip = ipAddress;
				});
				var userip   = getuserip;
				var userurl  = apiUrl+'finance/transfer/insert/'+delid;
				var userdata = null;
				var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
				nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('债权转让信息：'+body);		//EROR DEBUG
					if(response.statusCode == 200){
						var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
						res.json(data);
					}else{
						console.log(error,response.statusCode);
					}
				});		
	},
	sureTransfer : function(req, res, next){
				var getuserip, ipAddress, headers = req.headers;
				nodeip.clientIP(ipAddress, headers, function(ipAddress){
					getuserip = ipAddress;
				});
				var userip   = getuserip;
				var userurl  = apiUrl+'form/status/';
				var userdata = req.body;
				var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
				nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('债权转让确认：'+body);		//EROR DEBUG
					if(response.statusCode == 200){
						var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
						res.json(data);
					}else{
						console.log(error,response.statusCode);
					}
				});		
	},


	//安全中心
	modUserpwd : function(req, res, next){
		var oldPassword = req.body.oldpass;
		var newPassword = req.body.newpass;

			var getuserip, ipAddress, headers = req.headers;
			nodeip.clientIP(ipAddress, headers, function(ipAddress){
				getuserip = ipAddress;
			});
			var userip   = getuserip;
			var userurl  = apiUrl+'form/password_update/';
			var userdata = {'oldPassword' : oldPassword, 'newPassword' : newPassword};
			var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('修改登录密码：'+body);		//EROR DEBUG

				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);
					var data = JSON.parse(data[1]);
					console.log(data);
					res.json(data);
					
				}else{
					console.log(error,response.statusCode);
				}

			});


	},
	modPaypwd : function(req, res, next){
		var oldPayment = req.body.oldpass;
		var newPayment = req.body.newpass;
			var getuserip, ipAddress, headers = req.headers;
			nodeip.clientIP(ipAddress, headers, function(ipAddress){
				getuserip = ipAddress;
			});
			var userip   = getuserip;
			var userurl  = apiUrl+'form/payment_update/';
			var userdata = {'oldPayment' : oldPayment, 'newPayment' : newPayment};
			var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('修改交易密码：'+body);		//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);
					var data = JSON.parse(data[1]);
					res.json(data);
					
				}else{
					console.log(error,response.statusCode);
				}
				
			});		

	},
	getPaypwd : function(req, res, next){
		var newPayment = req.body.newPayment;
		var smscode = req.body.smscode;

		if(req.signedCookies.hc_cookie_sms === smscode){
			var getuserip, ipAddress, headers = req.headers;
			nodeip.clientIP(ipAddress, headers, function(ipAddress){
				getuserip = ipAddress;
			});
			var userip   = getuserip;
			var userurl  = apiUrl+'form/payment_recovery/';
			var userdata = {'newPayment' : newPayment};
			var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('找回交易密码：'+body);		//EROR DEBUG

				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);
					var data = JSON.parse(data[1]);
					res.json(data);
				}else{
					console.log(error,response.statusCode);
				}

			});	
		}else{
			res.json('短信验证码错误');
		}


	},

	setIntell : function(req, res, next){
			var userip   = null;
			var userurl  = apiUrl+'form/reserve/insert/';
			var userdata = req.body;
			var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('设置智能投资：'+body);		//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					res.json(data);
				}else{
					console.log(error,response.statusCode);
				}
			});	
	},
	modIntell : function(req, res, next){
			var userip   = null;
			var userurl  = apiUrl+'form/reserve/update/';
			var userdata = req.body;
			var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('设置智能投资：'+body);		//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					res.json(data);
				}else{
					console.log(error,response.statusCode);
				}
			});		
	},
	delIntell : function(req, res, next){
			var userip   = null;
			var userurl  = apiUrl+'form/reserve/delete/';
			var userdata = req.body;
			var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('设置智能投资：'+body);		//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					res.json(data);
				}else{
					console.log(error,response.statusCode);
				}
			});		
	},
	userCard : function(req, res, next){
		var pageSize  = req.body.pageSize;		//条数
		var pageIndex = req.body.pageIndex;		//指针
		var state = req.body.state;
		var userdata = null;
		var userip   = null;
		var userurl  = apiUrl+'user/card/'+pageSize+'/'+pageIndex+'/'+state;
		console.log(userurl);
		var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
		nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('卡券列表:'+body);	//EROR DEBUG
			if(response.statusCode == 200){
				var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
				//var cards = data.data.list;
				res.json(data);
			}else{
				console.log(error,response.statusCode);
			}
		});
	},

	/*
	addBank : function(req, res, next){
		var cardNumber = req.body.cardNumber;
		var province   = req.body.province;
		var city       = req.body.city;
		var code       = req.body.code;
		var subBank    = req.body.subBank;
		var name       = req.body.name;

			var getuserip, ipAddress, headers = req.headers;
			nodeip.clientIP(ipAddress, headers, function(ipAddress){
				getuserip = ipAddress;
			});
			var userip   = getuserip;
			var userurl  = apiUrl+'form/bankcard/insert';
			var userdata = {'number' : cardNumber, 'province' : province, 'city' : city, 'subBank' : subBank, 'code' : code, 'name' : name};
			var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];

			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('添加银行卡：'+body);		//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);
					var data = JSON.parse(data[1]);
					res.json(data);
					
				}else{
					console.log(error,response.statusCode);
				}
			});		

	},

	showBank : function(req, res, next){
			var getuserip, ipAddress, headers = req.headers;
			nodeip.clientIP(ipAddress, headers, function(ipAddress){
				getuserip = ipAddress;
			});
			var userip   = getuserip;
			var userurl  = apiUrl+'user/bank/';
			var userdata = null;
			var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];

			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('银行卡列表：'+body);		//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);
					var data = JSON.parse(data[1]);
					res.json(data);
					
				}else{
					console.log(error,response.statusCode);
				}
			});	
	},
	editBank : function(req, res, next){
		var modeurl    = req.body.modeurl;
		var cardDelId  = req.body.cardDelId;
			var getuserip, ipAddress, headers = req.headers;
			nodeip.clientIP(ipAddress, headers, function(ipAddress){
				getuserip = ipAddress;
			});
			var userip   = getuserip;
			var userurl  = apiUrl+modeurl;
			var userdata = {'delId' : cardDelId};
			var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];

			console.log(userurl);

			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('银行卡默认设置：'+body);		//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);
					var data = JSON.parse(data[1]);
					res.json(data);
					
				}else{
					console.log(error,response.statusCode);
				}
			});	
	},
	*/

	userWithdraw : function(req, res, next){
		//money  金额
		//cardDelId 银行卡加密id 在打开银行卡页面会获取到
		//payment 支付密码
		var money = req.body.money;
			var getuserip, ipAddress, headers = req.headers;
			nodeip.clientIP(ipAddress, headers, function(ipAddress){
				getuserip = ipAddress;
			});
			var userip   = getuserip;
			var userurl  = apiUrl+'form/withdraw/';
			var userdata = req.body;
			var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('提现：'+body);		//EROR DEBUG

				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);
					var data = JSON.parse(data[1]);
					res.json(data);
				}else{
					console.log(error,response.statusCode);
				}

			});		
	},

	saveUser : function(req, res, next){
			var userurl  = apiUrl+'form/user_info/';
			var userdata = req.body;
			var userid   = req.signedCookies.hc_cookie_uid['userOpenId'];
			var userip   = null;
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('帐户设置：'+body);		//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);
					var data = JSON.parse(data[1]);
					res.json(data);
				}else{
					console.log(error,response.statusCode);
				}
			});
	},


	userOut : function(req, res, next){
		req.session.destroy(function(err){
			if(err){
				console.log('session error');
			}else{
				console.log('session over');
			}
		})
		res.clearCookie('hc_cookie_uid');
		res.redirect(303, '/');
	}
}




