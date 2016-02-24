/*
 * 登录判断
 */
	exports.dologin = function(req, res, next){
			/*
			var session = req.signedCookies;
			var userid = session.hc_cookie_uid['userOpenId'];
			var username = session.hc_cookie_uid['name'];
			var mobile = session.hc_cookie_uid['mobile'];
			*/
			var session = req.signedCookies;
			if(session.hc_cookie_uid === undefined){
				res.redirect(303, '/login');
			}else if(session.hc_cookie_uid['userOpenId'] === null){
				res.redirect(303, '/authen');
			}else if(session.hc_cookie_uid['userOpenId'] !== undefined || session.hc_cookie_uid['userOpenId'] !== null){	
				var loginedkey = session.hc_cookie_uid;
				res.cookie('hc_cookie_uid', loginedkey, { httpOnly: true, signed: true, maxAge: 60*30000 });
				next();
			}else{
				next();
			}

				
	}

