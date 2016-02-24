var request = require('request'),
	//responseTime = require('response-time'),
	version = require('./version.js'),
	usermodel = require('./usermodel.js'),
	nodeip = require('./nodeip.js');

//API调用
var nodeapi = require('./nodeapi.js');
var apiUrl = 'http://huacheng.china187.com/';

exports.home = function(req, res){

		var getuserip, ipAddress, headers = req.headers;
		nodeip.clientIP(ipAddress, headers, function(ipAddress){
			getuserip = ipAddress;
		});
		
		var userurl  = apiUrl+'home/';
		var userdata = null;
		var userid   = null;
		var userip   = getuserip;

		var paramurl = req.url.split('?friend=')[1];
		if(paramurl !== undefined){
			res.cookie('hc_cookie_friend', paramurl, { httpOnly: true, signed: true, maxAge: 60*1000*4320 });
		}
		
		nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('首页数据：'+body);		//EROR DEBUG
	        if(response.statusCode == 200){
				var error = body.indexOf('<return_data>');if(error < 0 ){res.redirect(303, '/500');}
				var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
				

				//var data = JSON.parse(body);
				//console.log(data);

				//新手
				var novices = data.data.novice.list;

				//明星产品
				var stars = data.data.stars.list;

				//银票
				var bills = data.data.bill.list;

				//商票
				//var tickets = data.data.list.ticket;

				//保险
				//var insurances = data.data.list.insurance;

				//保理
				//var factorings = data.data.list.factoring;

				//新闻
				var news = data.data.news.list;

				//公告
				var notice = data.data.notice.list;

				//支票
				var check = data.data.check.list;

				var session = req.signedCookies;
				if(session.hc_cookie_uid === undefined){
					res.render('home', {
						novice : novices,
						star   : stars,
						bill   : bills,
						//ticket : tickets,
						//insurance : insurances,
						//factoring : factorings,
						news : news,
						check : check,
						notice : notice,
						//username : username,
						node : version.version
					});

				}else{
					var userid = session.hc_cookie_uid['userOpenId'];
					var username = session.hc_cookie_uid['name'];
					var mobile = session.hc_cookie_uid['mobile'];
						res.render('home', {
							novice : novices,
							star   : stars,
							bill   : bills,
							//ticket : tickets,
							//insurance : insurances,
							//factoring : factorings,
							username : username,
							news : news,
							check : check,
							notice : notice,
							node : version.version
						});
				}
				
	            
	        }else{
	        	res.redirect(303, '/500');
	            console.log(response.statusCode);
	        }

		})
};

exports.products = function(req, res){
		var getuserip, ipAddress, headers = req.headers;
		nodeip.clientIP(ipAddress, headers, function(ipAddress){getuserip = ipAddress;});
		var userurl  = apiUrl+'item/lists/';
		var userdata = null;
		var userid   = null;
		var userip   = getuserip;
		nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){
	        if(response.statusCode == 200){
				var data  = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data  = JSON.parse(data[1]);
				if(data.statusCode == -2.6){
					var pages = 1;	//page
				}else{
					var session = req.signedCookies;
					if(session.hc_cookie_uid === undefined){
						res.render('products', { 
							products : 'on',
							node     : version.version
						});
					}else{
						var userid = session.hc_cookie_uid['userOpenId'];
						var username = session.hc_cookie_uid['name'];
						var mobile = session.hc_cookie_uid['mobile'];
							res.render('products', { 
								products : 'on',
								pagecount  : pages,
								username : username,
								node : version.version
							});
					}
				}

	        }else{
	        	res.status(500).render('500');
	            console.log(response.statusCode);
	        }
		});
};

exports.detail = function(req, res){
	var paramurl = req.url.split('&')[1];
		if(paramurl===undefined || paramurl===''|| paramurl===null){
			res.redirect(303, '/login');
		}
		var getuserip, ipAddress, headers = req.headers;
		nodeip.clientIP(ipAddress, headers, function(ipAddress){getuserip = ipAddress;});
		var userurl  = apiUrl+'/item/view/'+paramurl+'/';
		var userdata = null;
		if(req.signedCookies.hc_cookie_uid === undefined){
			var userid = null;
		}else{
			var userid = req.signedCookies.hc_cookie_uid['userOpenId'];
		}
		var userip   = getuserip;
		nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('产品详细：'+body);		//EROR DEBUG
	        if(response.statusCode == 200){
				var data  = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data  = JSON.parse(data[1]);
				var record = data.data.order;
				var billinfo = data.data.view;
				var Buy = data.data.view.Buy;
				var State = data.data.view.State;
				var Type = data.data.Type;
				var pic = data.data.view.Pic;
				var OrderCode = data.data.view.OrderCode;

				var card = data.data.card;
				if(Buy == null){
					var Buy = 1;
				}else{
					var Buy = data.data.view.Buy;
				}

				
				if(req.signedCookies.hc_cookie_uid === undefined){
					res.render('detail', {
						billinfo  : billinfo,
						record : record,
						picture : billinfo.Img,
						billID : paramurl,
						Buy : Buy,
						State : State,
						Type : Type,
						Pic : pic,
						OrderCode : OrderCode,
						products : 'on',

						node : version.version
					});

				}else{
					var userid = req.signedCookies.hc_cookie_uid['userOpenId'];
					var username = req.signedCookies.hc_cookie_uid['name'];
					var mobile = req.signedCookies.hc_cookie_uid['mobile'];
						res.render('detail', { 
							billinfo  : billinfo,
							record : record,
							picture : billinfo.Img,
							billID : paramurl,
							Buy : Buy,
							State : State,
							Type : Type,
							Pic : pic,
							OrderCode: OrderCode,
							username : username,
							card : card,
							node : version.version
							
						});
				}
	        }else{
	        	res.status(500).render('500');
	            console.log(response.statusCode);
	        }
		});
};

exports.assignment = function(req, res){
	//http://huacheng.china187.com/finance/transfer/lists/条数 = 15/指针 = 0/剩余周期 = 0/转让利率 = 0
		if(req.signedCookies.hc_cookie_uid === undefined){
			var username = null;
		}else{
			var username = req.signedCookies.hc_cookie_uid['name'];
		}			
			var userdata = null;
			var getuserip, ipAddress, headers = req.headers;
			nodeip.clientIP(ipAddress, headers, function(ipAddress){getuserip = ipAddress;});
			var userip   = getuserip;
			var userurl  = apiUrl+'finance/transfer/lists/';
			var userid   = null;
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
						if(data.statusCode == -2.6){
							var pages = 1;	//page
						}else{
							var pages = data.data.rows;	//pageNumber
						}
						res.render('assignment', {
							assignment : 'on',
							username : username,
							pagecount  : pages,
							node : version.version 
						});
				}else{
					console.log(error,response.statusCode);
				}
			});

};

exports.about = function(req, res){
	if(req.signedCookies.hc_cookie_uid === undefined){var username = null;}else{var username = req.signedCookies.hc_cookie_uid['name'];}
	res.render('about', {
		username : username,
		node : version.version 
	});
}

exports.help = function(req, res){
	var crypto = require('crypto');
	var content = '1234';
	var md5 = crypto.createHash('md5');
	md5.update(content);
	var d = md5.digest('hex');

	var shasum = crypto.createHash('sha1');
	shasum.update(content);
	var s = shasum.digest('hex');	

	console.log(d,s);

	if(req.signedCookies.hc_cookie_uid === undefined){var username = null;}else{var username = req.signedCookies.hc_cookie_uid['name'];}
	res.render('help',{
		help : 'on',
		username : username,
		node : version.version
	});
}

exports.problem = function(req, res){
	if(req.signedCookies.hc_cookie_uid === undefined){var username = null;}else{var username = req.signedCookies.hc_cookie_uid['name'];}
	res.render('question',{
		help : 'on',
		username : username,
		node : version.version
	});
}


exports.safety = function(req, res){
	if(req.signedCookies.hc_cookie_uid === undefined){var username = null;}else{var username = req.signedCookies.hc_cookie_uid['name'];}
	res.render('safety', {
		username : username,
		node : version.version 
	});
}

exports.howbuy = function(req, res){
	if(req.signedCookies.hc_cookie_uid === undefined){var username = null;}else{var username = req.signedCookies.hc_cookie_uid['name'];}
	res.render('profiting',{
		help : 'on',
		username : username,
		node : version.version
	});
}

exports.partners = function(req, res){
	if(req.signedCookies.hc_cookie_uid === undefined){var username = null;}else{var username = req.signedCookies.hc_cookie_uid['name'];}
	res.render('partners', {
		username : username,
		node : version.version 
	});
}

exports.job = function(req, res){
	if(req.signedCookies.hc_cookie_uid === undefined){var username = null;}else{var username = req.signedCookies.hc_cookie_uid['name'];}
			var userdata = null;
			var userip   = null;
			var userurl  = apiUrl+'news/lists/0/0/71/';
			var userid   = null;
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('新闻列表：'+body);		//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					var pages = data.data.rows;	//pageNumber
					res.render('job', {
						username : username,
						news : data.data.list,
						node : version.version 
					});
				}else{
					console.log(error,response.statusCode);
				}
			});
}

exports.notice = function(req, res){
	if(req.signedCookies.hc_cookie_uid === undefined){var username = null;}else{var username = req.signedCookies.hc_cookie_uid['name'];}
			var userdata = null;
			var userip   = null;
			var userurl  = apiUrl+'news/lists/0/0/72/';
			var userid   = null;
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('新闻列表：'+body);		//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					var pages = data.data.rows;	//pageNumber
					res.render('notice', {
						username : username,
						news : data.data.list,
						node : version.version 
					});
				}else{
					console.log(error,response.statusCode);
				}
			});
}

exports.news = function(req, res){
	if(req.signedCookies.hc_cookie_uid === undefined){var username = null;}else{var username = req.signedCookies.hc_cookie_uid['name'];}
			var userdata = null;
			var userip   = null;
			var userurl  = apiUrl+'news/lists/0/0/74/';
			var userid   = null;
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('新闻列表：'+body);		//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					var pages = data.data.rows;	//pageNumber
						res.render('news', {
							username : username,
							news : data.data.list,
							node : version.version 
						});
				}else{
					console.log(error,response.statusCode);
				}
			});
}

exports.reports = function(req, res){
	if(req.signedCookies.hc_cookie_uid === undefined){var username = null;}else{var username = req.signedCookies.hc_cookie_uid['name'];}
			var userdata = null;
			var userip   = null;
			var userurl  = apiUrl+'news/lists/0/0/70/';
			var userid   = null;
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('新闻列表：'+body);		//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					var pages = data.data.rows;	//pageNumber
					res.render('reports', {
						username : username,
						news : data.data.list,
						node : version.version 
					});
				}else{
					console.log(error,response.statusCode);
				}
			});


}

exports.collection = function(req, res){
	if(req.signedCookies.hc_cookie_uid === undefined){var username = null;}else{var username = req.signedCookies.hc_cookie_uid['name'];}
			var userdata = null;
			var userip   = null;
			var userurl  = apiUrl+'news/lists/0/0/73/';
			var userid   = null;
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('新闻列表：'+body);		//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					var pages = data.data.rows;	//pageNumber
					res.render('collection', {
						username : username,
						news : data.data.list,
						node : version.version 
					});
				}else{
					console.log(error,response.statusCode);
				}
			});

}

exports.repayment = function(req, res){
	if(req.signedCookies.hc_cookie_uid === undefined){var username = null;}else{var username = req.signedCookies.hc_cookie_uid['name'];}
			var userdata = null;
			var userip   = null;
			var userurl  = apiUrl+'news/lists/0/0/75/';
			var userid   = null;
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('新闻列表：'+body);		//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					var pages = data.data.rows;	//pageNumber
					res.render('repayment', {
						username : username,
						news : data.data.list,
						node : version.version 
					});
				}else{
					console.log(error,response.statusCode);
				}
			});
}

exports.contactus = function(req, res){
	if(req.signedCookies.hc_cookie_uid === undefined){var username = null;}else{var username = req.signedCookies.hc_cookie_uid['name'];}
	res.render('contactus',{
		service : 'on',
		username : username,
		node : version.version
	});
}

exports.details = function(req, res){
	if(req.signedCookies.hc_cookie_uid === undefined){var username = null;}else{var username = req.signedCookies.hc_cookie_uid['name'];}
			
			var id = req.url.split('&')[1];
			var userdata = null;
			var userip   = null;
			var userurl  = apiUrl+'news/view/'+id;
			var userid   = null;
			nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('详细内容：'+body);		//EROR DEBUG
				if(response.statusCode == 200){
					var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
					var pages = data.data.rows;	//pageNumber
					res.render('details',{
						content : data.data.Content,
						title : data.data.Name,
						time : data.data.UpTime,

						username : username,
						node : version.version
					});
				}else{
					console.log(error,response.statusCode);
				}
			});
}


//隐私条款
exports.privacypolicy = function(req, res){
	res.render('article/privacypolicy');
};
//服务协议
exports.serviceagreement = function(req, res){
	res.render('article/serviceagreement');
};
//法律声明
exports.statement = function(req, res){
	res.render('article/statement');
}
//委托
exports.trust = function(req, res){
	var tp = req.url.split('&')[1];
	var id = req.url.split('&')[2];
	var userdata = null;
	var userip   = null;
	var userurl  = apiUrl+'item/entrust/'+id;
		if(req.signedCookies.hc_cookie_uid === undefined){
			var userid = null;
		}else{
			var userid = req.signedCookies.hc_cookie_uid['userOpenId'];
		}
	nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('委托协议：'+body);		//EROR DEBUG
		if(response.statusCode == 200){
			var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
			var item = data.data.lists;
			var user = data.data.user;
			if(item == ''){item = null}else{item = item;}
			if(user == ''){user = null}else{user = user;}
			if(tp == 2){
				res.render('article/zptrustagreement',{
					item : item,
					user : user
				});
			}else if(tp == 4){
				res.render('article/zptrustagreement',{
					item : item,
					user : user
				});
			}else{
				res.render('article/trustagreement',{
					item : item,
					user : user
				});
			}

		}else{
			console.log(error,response.statusCode);
		}
	});

	
}
//质押
exports.loan = function(req, res){
	var tp = req.url.split('&')[1];
	var id = req.url.split('&')[2];
	var userdata = null;
	var userip   = null;
	var userurl  = apiUrl+'item/entrust/'+id;
		if(req.signedCookies.hc_cookie_uid === undefined){
			var userid = null;
		}else{
			var userid = req.signedCookies.hc_cookie_uid['userOpenId'];
		}
	nodeapi.userapi(userurl, userdata, userid, userip, function(error, response, body){console.log('质押协议：'+body);		//EROR DEBUG
		if(response.statusCode == 200){
			var data = body.match(/<return_data>([\s\S]*?)<\/return_data>/);var data = JSON.parse(data[1]);
			var item = data.data.lists;
			var user = data.data.user;
			if(item == ''){item = null}else{item = item;}
			if(user == ''){user = null}else{user = user;}
			if(tp == 2){
				res.render('article/sploanagreement',{
					item : item,
					user : user
				});	
			}else if(tp == 4){
				res.render('article/sploanagreement',{
					item : item,
					user : user
				});	
			}else{
				res.render('article/loanagreement',{
					item : item,
					user : user
				});	
			}

		}else{
			console.log(error,response.statusCode);
		}
	});
	
}




