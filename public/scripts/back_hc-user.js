/*
 * www.huachengjr.com www.hcii.cn script@auth:ming
 */
//'CMB',/*招商银行*/'SRCB',/*上海农村商业银行*/'ICBC',/*中国工商银行*/'BOB',/*北京银行*/'ABC',/*中国农业银行*/'CBHB',/*渤海银行*/'CCB',/*中国建设银行'*/
//'BJRCB',/*北京农商银行*/'BOC',/*中国银行*/'NJCB',/*南京银行*/'SPDB',/*浦发银行*/'CEB',/*中国光大银行*/'BCOM',/*中国交通银行*/'BEA',/*东亚银行*/
//'CMBC',/*中国民生银行*/'NBCB',/*宁波银行*/'SDB',/*深圳収展银行*/'HZB',/*杭州银行*/'GDB',/*广东发展银行*/'PAB',/*平安银行*/'CITIC',/*中信银行*/
//'HSB',/*徽商银行*/'HXB',/*华夏银行*/'CZB',/*浙商银行*/'CIB',/*兴业银行*/'SHB',/*上海银行*/'GZCB',/*广州银行*/'PSBC',/*中国邮政储蓄银行*/
//'UPOP',/*银联在线支付*/'DLB',/*大连银行*/'JSB',/*江苏银行*/

 	var hcUrl = './';

	String.prototype.NoSpace = function(){
		return this.replace(/\s+/g, ""); 
	}
	var passinit = /^(([a-z]+[0-9]+)|([0-9]+[a-z]+))[a-z0-9]*$/i;
    function setCookie(name,value){
        var Days = 1;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*6*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    }
    function getCookie(name){
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }
	function delCookie(name) { 
	    var exp = new Date(); 
	    exp.setTime(exp.getTime() - 1); 
	    var cval=getCookie(name); 
	    if(cval!=null) 
	        document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
	}
	var hcuserScript = {

		name : '花橙金融用户中心',
		version : '1.0.0',
		tabs : function(a,b,c){
			var that = this;
			$(a).each(function(i, o) {
				$(o).click(function() {

					$(a).removeClass(c);
					$(this).addClass(c);
					$(b).hide().eq(i).show();
				});
			});
		},
		pop: function(a,b,c) {
			var that = this;
			var blackbgh = document.documentElement.scrollHeight;
			$(b).css('height', blackbgh);
			var window_height = $(window).height();
			//var top = (parseInt(window_height) - parseInt($(a).height())) / 2 + 'px';
			var top = document.body.scrollTop | document.documentElement.scrollTop;
			$(a).css('top', top+100);
			$(a).show();
			$(b).show();
			$(c).click(function() {
				that.close(a,b);
			});
		},
		close: function(a,b) {
			var that = this;
			$(a).hide();
			$(b).hide();
		},
		userinfo : function(a){
			var that = this;

			var userinfo = getCookie('hcuserinfo');
			
			if(userinfo == null || userinfo == undefined){
				console.log(0);
				$.ajax({
					url : '/userinfo',
					type : 'POST',
					dataType : 'json',
					//cache : false,
					data: null,
					success : function(data){
						if(data.statusCode == 0){
							var picture = data.data.user.PicId;
							var level = data.data.user.Grade;
							var integral = data.data.assets.Integral;
				
							setCookie('hcuserinfo', picture+'&'+level+'&'+integral);
							if(picture.length != 0){$('.userpicture').addClass('head-'+picture.split('.')[0]);}else{$('#userpicture').addClass('head-1');}// html('<img src="'+data.data.user.PicId+'">');
							$('#level').html(data.data.user.Grade);
							$('#inte').html(data.data.assets.Integral);
						}	
					},
					error : function(data){console.log(data);return false;}
				});
			}else{
				var userinfo = getCookie('hcuserinfo');
				var picture = userinfo.split('&')[0];
				var level = userinfo.split('&')[1];
				var integral = userinfo.split('&')[2];

				if(picture.length != 0){$('.userpicture').addClass('head-'+picture.split('.')[0]);}else{$('#userpicture').addClass('head-1');}// html('<img src="'+data.data.user.PicId+'">');
				$('#level').html(level);
				$('#inte').html(integral);
			}
			
			$.ajax({
				url : '/userinfo',
				type : 'POST',
				dataType : 'json',
				//cache : false,
				data: null,
				success : function(data){
					if(data.statusCode == 0){
						$('.usermoney').html(data.data.assets.Fund);
						var yp = data.data.sum[1];
						var sp = data.data.sum[2];
						var cd = data.data.sum[3];
						var zp = data.data.sum[4];
						if(String(yp).indexOf('.') != -1){var yp = yp;}else{var yp = yp+'.00';};
						if(String(sp).indexOf('.') != -1){var sp = sp;}else{var sp = sp+'.00';};
						if(String(cd).indexOf('.') != -1){var cd = cd;}else{var cd = cd+'.00';};
						if(String(zp).indexOf('.') != -1){var zp = zp;}else{var zp = zp+'.00';};

						$('#mineval').html(
							'<dd><span class="hcuser u-yp">银票理财：</span> <strong><b>'+yp+'</b><em>元</em></strong></dd>'
                        	+'<dd><span class="hcuser u-sp">商票理财：</span> <strong><b>'+sp+'</b><em>元</em></strong></dd>'
                        	+'<dd><span class="hcuser u-cd">车贷理财：</span> <strong><b>'+cd+'</b><em>元</em></strong></dd>'
                        	+'<dd><span class="hcuser u-zp">支票理财：</span> <strong><b>'+zp+'</b><em>元</em></strong></dd>'
						);
						
					}	
				},
				error : function(data){console.log(data);return false;}
			});
		},

		sendsms : function(a){
			var that = this;
			//找回交易密码
			$(a).on('click', function(evt){
				evt.preventDefault();
				$(this).attr('disabled',true).addClass('hc-end');
				var mobile = $(this).attr('data');
				$.ajax({
					url : '/findsms',
					type : 'POST',
					dataType : 'json',
					//cache : false,
					data: {'mobile' : mobile},
					success : function(data){
						if(data.statusCode != 0){
							if(data.message === undefined){
								$('#error').html('<p>'+ data +'!</p>');
							}else{
								$('#error').html('<p>'+ data.message +'!</p>');
							}
						}else{
							$('#error').html('<p>短信发送成功!</p>');
						}	
					},
					error : function(data){
						console.log(data);
						return false;
					}
				})
				that.countdown('#send-code');
			});
		},


		//找回密码
		getpassword : function(){
			var that = this;
			//找回登录密码短信发送
			$('#send-code').on('click',function(evt){
				evt.preventDefault();
				var authcode = $('#authcode').val().NoSpace();
				var account = $('#account').val().NoSpace();
				var vercode = $('#vercode').val().NoSpace();

				var phone = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
				if(account === '' || account === null || isNaN(account)|| !phone.test(account) || account.length!=11){
					$('#error').html('<p>请正确输入注册手机号？</p>');
					return false;
				}
				if(vercode === '' || vercode === null || isNaN(vercode) || vercode.length!=4){
					$('#error').html('<p>请正确输入图片验证码？</p>');
					return false;
				}
				$('#error').html('<img src="/images/common/verfy.gif" alt="loading...">');
				
				$.ajax({
					url : '/sentsms',
					type : 'POST',
					dataType : 'json',
					//cache : false,
					data: {'mobile' : account, 'vercode' : vercode},
					success : function(data){
						if(data.statusCode != 0){
							if(data.message === undefined){
								$('#error').html('<p>'+ data +'!</p>');
								$('#verpicture').attr('src','/captcha?nocache='+new Date().getTime());
							}else{
								$('#error').html('<p>'+ data.message +'!</p>');
								$('#verpicture').attr('src','/captcha?nocache='+new Date().getTime());
							}
						}else{
							$('#error').html('<p>短信发送成功!</p>');
							$('#send-code').attr('disabled',true).addClass('hc-end');	
							that.countdown('#send-code');
						}
					},
					error : function(data){
						console.log(data);
						return false;
					}
				})

				
				return false;
			});
			
			$('#user-get').on('click', function(evt){
				evt.preventDefault();
				var account = $('#account').val().NoSpace();
				var password = $('#password').val().NoSpace();
				var surepass = $('#r-password').val().NoSpace();
				var vercode = $('#vercode').val().NoSpace();
				var authcode = $('#authcode').val().NoSpace();
				var phone = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
				var passinit = /^(([a-z]+[0-9]+)|([0-9]+[a-z]+))[a-z0-9]*$/i;

				if(account === '' || account === null || isNaN(account)|| !phone.test(account) || account.length!=11){
					$('#error').html('<p>请正确输入注册手机号？</p>');
					return false;
				}
				if(vercode === '' || vercode === null || isNaN(vercode) || vercode.length!=4){
					$('#error').html('<p>请正确输入图片验证码？</p>');
					return false;
				}
				if(authcode === '' || authcode === null || isNaN(authcode) || authcode.length!=4){
					$('#error').html('<p>请正确输入手机验证码？</p>');
					return false;
				}
				if(!passinit.test(password) || password.length<6){
					$('#error').html('<p>请以字母数字设置6位以上密码？</p>');
					return false;
				}
				if(password !== surepass){
					$('#error').html('<p>请确认两次输入密码一致？</p>');
					return false;
				}


				$('#error').html('<img src="/images/common/verfy.gif" alt="loading...">');
				
				$.ajax({
					url : '/loginpwd',
					type : 'POST',
					dataType : 'json',
					//cache : false,
					data: {'username' : account, 'password' : password, 'surepass' : surepass, 'vercode' : vercode, 'smscode' : authcode},
					success : function(data){
						if(data.statusCode != 0){
							if(data.message === undefined){
								$('#error').html('<p>'+ data +'!</p>');
								$('#verpicture').attr('src','/captcha?nocache='+new Date().getTime());
							}else{
								$('#error').html('<p>'+ data.message +'!</p>');
								$('#verpicture').attr('src','/captcha?nocache='+new Date().getTime());
							}
							//console.log(data);
						}else{
							//console.log(data);
							window.location.href='/usercenter';
						}	
					},
					error : function(data){
						$('#verpicture').attr('src','/captcha?nocache='+new Date().getTime());
						console.log(data);
						return false;
					}
				});
			});

			$('#register input').on('click keydown mousedown', function(){
				$('#error').html('');
			});

			$('#verpicture').on('click', function(){
	  			$(this).attr('src','/captcha?nocache='+new Date().getTime());
			});

			return false;
		},
		
		//认证
		authen : function(){
			var that = this;
			//注册认证的短信发送
			$('#send-code').on('click',function(evt){
				evt.preventDefault();
				$(this).attr('disabled',true).addClass('hc-end');
				var hidecode = $('#hidecode').val();
				if(hidecode === '' || hidecode === null){
					$('#error').html('<p>注册失效，请重新注册认证！</p>');
					return false;	
				}
				$('#error').html('<img src="/images/common/verfy.gif" alt="loading...">');

				$.ajax({
					url : '/sentmeagess',
					type : 'POST',
					dataType : 'json',
					//cache : false,
					data: {'tempId' : hidecode},
					success : function(data){
						if(data.statusCode != 0){
							if(data.message === undefined){
								$('#error').html('<p>'+ data +'!</p>');
								$('#verpicture').attr('src','/captcha?nocache='+new Date().getTime());
							}else{
								$('#error').html('<p>'+ data.message +'!</p>');
								$('#verpicture').attr('src','/captcha?nocache='+new Date().getTime());
							}
						}else{
							$('#error').html('<p>短信发送成功!</p>');
						}	
					},
					error : function(data){
						console.log(data);
						return false;
					}
				})

				that.countdown('#send-code');
			});

			$('#user-auth').on('click', function(evt){
				evt.preventDefault();
				var authcode = $('#authcode').val().NoSpace();						//短信
				var authname = $('#authname').val().NoSpace();						//姓名
				var authid   = $('#authid').val().NoSpace();  						//身份证
				var paypass  = $('#setpaypass').val().NoSpace();					//交易密码
				var surepass = $('#surepaypass').val().NoSpace();
				var verid    = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;			//SFZ号码
				var vername  = /^[\u4e00-\u9fa5]+$/i;// /.*[\u4e00-\u9fa5]+.*$/; 	//NAME中文
				var recommend = $('#recommend').val().NoSpace();

				var tempId = $('#hidecode').val();

				if(authcode === '' || authcode === null || isNaN(authcode) || authcode.length!=4){
					$('#error').html('<p>请正确输入手机验证码？</p>');
					return false;
				}
				if(authname === '' || authname === null || !vername.test(authname)){
					$('#error').html('<p>请正确输入真实姓名？</p>');
					return false;
				}
				if(authid === '' || authid === null || !verid.test(authid)){
					$('#error').html('<p>请正确输入身份证号？</p>');
					return false;
				}

				if(isNaN(paypass) || paypass.length<6){
					$('#error').html('<p>请设置4-6位数字交易密码？</p>');
					return false;	
				}
				if(paypass === '' || paypass === null || surepass === '' || surepass === null || paypass !== surepass){
					$('#error').html('<p>请正确输入交易支付密码？</p>');
					return false;	
				}
				$('#error').html('<img src="/images/common/verfy.gif" alt="loading...">');

				$.ajax({
					url : '/userauth',
					type : 'POST',
					dataType : 'json',
					//cache : false,
					data: {'tempId' : tempId, 'name' : authname, 'idCard' : authid, 'payment' : paypass, 'recommend' : recommend, 'smscode' :　authcode},
					success : function(data){
						if(data.statusCode != 0){
							if(data.message === undefined){
								$('#error').html('<p>'+ data +'!</p>');
							}else{
								$('#error').html('<p>'+ data.message +'!</p>');
							}
						}else{
							window.location.href='/usercenter';
						}	
					},
					error : function(data){
						console.log(data);
						return false;
					}
				})
			});

			$('#authen input').on('click keydown mousedown', function(){
				$('#error').html('');
			});
			
			return false;
		},

		//安全中心
		safety : function(){
			var that = this;
			//修改登录密码
			
			$('#mod-login').on('click', function(evt){
				evt.preventDefault();

				var mod_lyp = $('#login-ypass').val().NoSpace();
				var mod_lnp = $('#login-npass').val().NoSpace();
				var mod_lsp = $('#login-spass').val().NoSpace();
				if(mod_lyp === '' || mod_lnp === '' || mod_lsp === ''){
					$('#error').html('<p>请输入修改密码信息!</p>');
					return false;
				}
				if(!passinit.test(mod_lnp) || !passinit.test(mod_lsp) || mod_lnp.length<6 || mod_lsp.length<6){
					$('#error').html('<p>请以字母和数字设置6位以上密码!</p>');
					return false;
				}
				if(mod_lnp !== mod_lsp){
					$('#error').html('<p>请确认新密码两次输入一致？!</p>');
					return false;
				}
				$.ajax({
					url : '/modpassword',
					type : 'POST',
					dataType : 'json',
					//cache : false,
					data: {'oldpass' : mod_lyp, 'newpass' : mod_lsp},
					success : function(data){
						if(data.statusCode != 0){
							if(data.message === undefined){
								$('#error').html('<p>'+ data +'!</p>');
							}else{
								$('#error').html('<p>'+ data.message +'!</p>');
							}
						}else{
							$('.pop dd').html('<strong class="success"><i></i>修改成功！</strong>');
							that.pop('.pop','.black','.close');
							$('.user-safety input').val('');
							setTimeout(function(){
								that.close('.pop', '.black');
							},1000);
						}	
					},
					error : function(data){
						console.log(data);
						return false;
					}
				})
				return false;
			});

			//修改交易密码
			$('#mod-pay').on('click', function(evt){
				evt.preventDefault();
				var mod_pyp = $('#pay-ypass').val().NoSpace();
				var mod_pnp = $('#pay-npass').val().NoSpace();
				var mod_psp = $('#pay-spass').val().NoSpace();

				if(mod_pyp === '' || mod_pnp === '' || mod_psp === ''){
					$('#error').html('<p>请输入修改密码信息!</p>');
					return false;
				}
				if(isNaN(mod_pnp) || isNaN(mod_psp) || mod_pnp.length<6 || mod_psp.length<6){
					$('#error').html('<p>请以数字设置6位交易密码!</p>');
					return false;
				}
				if(mod_pnp !== mod_psp){
					$('#error').html('<p>请确认新密码两次输入一致？!</p>');
					return false;
				}
				$.ajax({
					url : '/modpaypass',
					type : 'POST',
					dataType : 'json',
					//cache : false,
					data: {'oldpass' : mod_pyp, 'newpass' : mod_psp},
					success : function(data){
						if(data.statusCode != 0){
							if(data.message === undefined){
								$('#error').html('<p>'+ data +'!</p>');
							}else{
								$('#error').html('<p>'+ data.message +'!</p>');
							}
						}else{
							$('.pop dd').html('<strong class="success"><i></i>修改成功！</strong>');
							that.pop('.pop','.black','.close');
							$('.user-safety input').val('');
							setTimeout(function(){
								that.close('.pop', '.black');
							},1000);
						}	
					},
					error : function(data){
						console.log(data);
						return false;
					}
				})
				return false;
			});
			
			//找回交易密码
			that.sendsms('#send-code');

			$('#mod-getpay').on('click', function(evt){
				evt.preventDefault();
				var code   = $('#authcode').val().NoSpace();
				var oldpay = $('#get-npass').val().NoSpace();
				var newpay = $('#get-spass').val().NoSpace();
				
				if(code === '' || code === null){
					$('#error').html('<p>请输入短信验证码!</p>');
					return false;
				}		
				if(oldpay === '' || newpay === ''){
					$('#error').html('<p>请输入修改密码信息!</p>');
					return false;
				}
				if(isNaN(oldpay) || isNaN(newpay) || oldpay.length<4 || newpay.length<4){
					$('#error').html('<p>请以数字设置6位交易密码!</p>');
					return false;
				}
				if(oldpay !== newpay){
					$('#error').html('<p>请确认新密码两次输入一致？!</p>');
					return false;
				}
				$.ajax({
					url : '/getpaypass',
					type : 'POST',
					dataType : 'json',
					//cache : false,
					data: {'newPayment' : newpay, 'smscode' : code},
					success : function(data){
						if(data.statusCode != 0){
							if(data.message === undefined){
								$('#error').html('<p>'+ data +'!</p>');
							}else{
								$('#error').html('<p>'+ data.message +'!</p>');
							}
						}else{
							$('.pop dd').html('<strong class="success"><i></i>修改成功！</strong>');
							that.pop('.pop','.black','.close');
							$('.user-safety input').val('');
							setTimeout(function(){
								that.close('.pop', '.black');
							},1000);
						}	
					},
					error : function(data){
						console.log(data);
						return false;
					}
				})
				return false;
			});


			$('.user-safety input').on('click keydown mousedown', function(){
				$('#error').html('');
			});
		},
		
		//充值中心
		recharge : function(){
			var that = this;
			that.tabs('#tbank a','.banks','on');

			$('.user-recharge input').on('click',function(){
				$('#error').html('');
			});
			//choiceBank
			$('#choicebanks span').on('click', function(){
				var codeid = $(this).children('em').attr('id');
				$('#bankcode').val(codeid);
				$('#choicebanks span').removeClass('on');
				$(this).addClass('on');			
			});

			$('#user-recharge').on('click',function(){
				
				var money = $('#money-init').val().NoSpace();		
				if(money === '' || money === null || isNaN(money)){
					$('#error').html('<p><i></i>请正确输入金额！</p>');
					return false;
				}
				if(money <100){
					$('#error').html('<p><i></i>充值金融必须大于100！</p>');
					return false;
				}
				if(!$('#choicebanks span').hasClass('on')){
					$('#error').html('<p><i></i>请选择你的银行！</p>');
					return false;
				}
			    
				var cardid = $('#choicebanks span.on').children('input').val();
				$('#bankcardid').val(cardid);


				var chars = 'HCIICN&HUACHENGJINRONG&PAYMENT&MONEY&HUACHENGJINRONG&ABCDEFGHJKMNPQRSTWXYZ&?to=payment=GOTO=LIANLIAN';
				var str = chars.substr(Math.floor(Math.random() * 19)).toString();
				$('#paymenturl').attr('action', '/userpayment?'+str);

				that.pop('.pop','.black','.close');
			});
			
			//更多银行卡
			$('.user-recharge .more').click(function(){
				if($('.morebank').hasClass('hide')){
					$('.morebank').removeClass('hide');
				}else{
					$('.morebank').addClass('hide');
				}
			});	
			return true;
			
		},
		
		//快捷支付
		useraddbank : function(){
			var that = this;
			//that.userbank();
			$('#usertobank').on('click', function(evt){
				var banknum = $('#banknumber').val().NoSpace();

				var money = $('#money-init').val().NoSpace();		
				if(money === '' || money === null || isNaN(money)){
					$('#error').html('<p><i></i>请正确输入金额！</p>');
					return false;
				}
				if(money <100){
					$('#error').html('<p><i></i>充值金融必须大于100！</p>');
					return false;
				}
				
				if(banknum == '' || isNaN(banknum)){
					$('#error').html('<p>请正确输入银行卡号！</p>');
					return false;
				}

				var chars = 'HCIICN&HUACHENGJINRONG&PAYMENT&MONEY&HUACHENGJINRONG&ABCDEFGHJKMNPQRSTWXYZ&?to=payment=GOTO=LIANLIAN';
				var str = chars.substr(Math.floor(Math.random() * 19)).toString();
				$('#paymenturl').attr('action', '/payment?'+str);
				that.pop('.pop','.black','.close');			
			});
			$('#choicebank input, #choicebank select').on('click keydown mousedown', function(){
				$('#error').html('');
			});
			
		},

		//提现
		withdraw : function(){
			var that = this;
			$('#choicebank span').eq(0).addClass('on');
			$('.user-withdraw input').on('click',function(){
				$('#error').html('');
			});
			//that.sendsms('#send-code');

			$('#user-withdraw').on('click',function(evt){
				evt.preventDefault();
				//var bankname = $('#bank option:selected').text();
				//var bankcode = $('#bank option:selected').val();
				var province = $('#province option:selected').val();
				var city = $('#city option:selected').text();
				var subbank = $('#bankarea').val().NoSpace();

				var money = $('#money-init').val().NoSpace();
				var payment = $('#payment').val().NoSpace();
				var cardid = $('#choicebank').children('input').val();

				if(money === '' || money === null || isNaN(money)){
					$('#error').html('<p><i></i>请正确输入金额！</p>');
					return false;
				}
				if($('#money-init').val() < 100){
					$('#error').html('<p><i></i>提现金额必须大于100元！</p>');
					return false;
				}
				if(cardid === '' || cardid === null || cardid === undefined){
					$('#error').html('<p><i></i>请选择银行卡！</p>');
					return false;
				}
				if(province == 0 || province =='' || province == null || city == '所在城市' || city =='' || city == null){
					$('#error').html('<p>请选择开户城市信息！</p>');
					return false;
				}
				if(payment === '' || payment === null || isNaN(payment)){
					$('#error').html('<p><i></i>请正确输入交易密码！</p>');
					return false;
				}
				//money  金额
                //cardDelId 银行卡加密id 在打开银行卡页面会获取到
                //payment 支付密码

				$.ajax({
					url : '/userwithdraw',
					type : 'POST',
					dataType : 'json',
					//cache : false,
					data: {'money' : money, 'cardDelId' : cardid, 'province' : province, 'city': city, 'subBank': subbank, 'payment' : payment},
					success : function(data){
						if(data.statusCode != 0){
							if(data.message === undefined){
								$('#error').html('<p>'+ data +'!</p>');
							}else{
								$('#error').html('<p>'+ data.message +'!</p>');
							}
						}else{
							$('.pop dd').html('<strong class="success"><i></i>提现成功！</strong>');
							that.pop('.pop','.black','.close');
							setTimeout(function(){
								that.close('.pop', '.black');
								window.location.href="/usercenter?withdraw";
							},1000);
							return false;
						}	
					},
					error : function(data){
						console.log(data);
						return false;
					}
				})
				return false;				

				
			});
		},

		//我的投资占比
		total : function(){
			var that = this;
            $.get(hcUrl+'scripts/lib/chart.js');
		},

		//收益宝
		profit : function(){
			var that = this;
			//转入
			$('#turnto').click(function(){
				$('#pop-contact').html(
					'<ul>'
					+'<li class="clear"><span>转入金额：</span><em><input type="text" name="turnto" class="pay" id="turn-init" placeholder="输入转入金额"> </em></li>'
					+'<li class="clear"><span>交易密码：</span><em><input type="password" name="pay" class="pay" id="pay-password" placeholder="交易密码"> <a href="/user-safety?vault">忘记交易密码？</a></em></li>'
					+'</ul><button type="button" id="moneyto" class="hc-buy">转 入</button>'
            	);
				that.pop('.pop','.black','.close');
				that.turn('into');
				return false;
			});

			//转出
			$('#turnout').click(function(){
				$('#pop-contact').html(
					'<ul>'
					+'<li class="clear"><span>转出金额：</span><em><input type="text" name="turnout" class="pay" id="turn-init" placeholder="输入转出金额"> </em></li>'
					+'<li class="clear"><span>交易密码：</span><em><input type="password" name="pay" class="pay" id="pay-password" placeholder="交易密码"> <a href="/user-safety?vault">忘记交易密码？</a></em></li>'
					+'</ul><button type="button" id="moneyto" class="hc-buy">转 出</button>'
            	);
            	$('#turnmoney').attr('id','moneyout');
				that.pop('.pop','.black','.close');
				that.turn('out');
				return false;
			});
		},
		turn : function(a){
			var that = this;
			var type = a;
			var info;
			(type === 'into')? info = '转入' : info = '转出';
			//提交
			$('#moneyto').click(function(evt){
				if($('#turn-init').val()=='' || $('#turn-init').val()==null || isNaN($('#turn-init').val())){
					$(this).html('请正确输入金额！');
					return false;
				}
				if($('#pay-password').val()=='' || $('#pay-password').val()==null ){
					$(this).html('请正确输入交易密码！');
					return false;
				}
				var money = $('#turn-init').val().NoSpace();
				var payment = $('#pay-password').val().NoSpace();
				evt.preventDefault();
				$.ajax({
					url : '/userturn',
					type : 'POST',
					dataType : 'json',
					data: {'money' : money, 'payment' : payment, 'type' : type},
					success : function(data){
						if(data.statusCode != 0){
							if(data.message === undefined){
								$('#moneyto').html('<p>'+ data +'!</p>');
							}else{
								$('#moneyto').html('<p>'+ data.message +'!</p>');
							}
						}else{
							$('#pop-contact').html('<strong class="success"><i></i>'+info+'成功！</strong>');
							setTimeout(function(){
								that.close('.pop', '.black');
								window.location.href="/usercenter?vault";
							},1000);
							
						}	
					},
					error : function(data){
						console.log(data);
						return false;
					}
				})
				

			});

		},
		//智能投资
		intell : function(){
			var that = this;
			if($('#amounta').length){
				$('#slider-rangea').slider({
					range: true,
					min: 1000,
					max: 50000,
					values: [1000, 50000],
					slide: function(event, ui) {
						$('#amounta').val(ui.values[0]);
						$("#amountb").val(ui.values[1]);
					}
				});
				$('#amounta').val($('#slider-rangea').slider('values', 0));
				$('#amountb').val($('#slider-rangea').slider('values', 1));
				$('#slider-rangeb').slider({
					range: true,
					min: 1,
					max: 360,
					values: [1, 360],
					slide: function(event, ui) {
						$('#amountc').val(ui.values[0]);
						$('#amountd').val(ui.values[1]);
					}
				});
				$('#amountc').val($('#slider-rangeb').slider('values', 0));
				$('#amountd').val($('#slider-rangeb').slider('values', 1));
				$('#slider-rangec').slider({
					range: true,
					min: 50,
					max: 300,
					values: [50, 300],
					slide: function(event, ui) {
						$('#amounte').val(ui.values[0] / 10);
						$('#amountf').val(ui.values[1] / 10);
					}
				});
				$('#amounte').val(5);
				$('#amountf').val(30);
			}

			if($('.intells dd').length){
				$(function(){
					$('.intells input').lc_switch();
					$('body').delegate('.lcs_check', 'lcs-statuschange', function() {
						var status = ($(this).is(':checked')) ? 'on' : 'off';
						var intellid = $(this).attr('data');
							$.ajax({
								url : '/stepintell',
								type : 'POST',
								dataType : 'json',
								data: {'delId' : intellid},
								success : function(data){
									if(data.statusCode != 0){
										if(data.message === undefined){
											$('#error').html('<p>'+ data +'!</p>');
										}else{
											$('#error').html('<p>'+ data.message +'!</p>');
										}
									}else{
										$('.pop dd').html('<strong class="success"><i></i>修改成功！</strong>');
										that.pop('.pop','.black','.close');
										setTimeout(function(){
											that.close('.pop', '.black');
										},1000);
										
									}	
								},
								error : function(data){
									console.log(data);
									return false;
								}
							})
					});
					//删除智能投资
					$('button.del-intell').on('click', function(evt){
						evt.preventDefault();
						var intellid = $(this).attr('data');
							$.ajax({
								url : '/delintell',
								type : 'POST',
								dataType : 'json',
								data: {'delId' : intellid},
								success : function(data){
									if(data.statusCode != 0){
										if(data.message === undefined){
											$('#error').html('<p>'+ data +'!</p>');
										}else{
											$('#error').html('<p>'+ data.message +'!</p>');
										}
									}else{
										$('.pop dd').html('<strong class="success"><i></i>删除成功！</strong>');
										that.pop('.pop','.black','.close');
										setTimeout(function(){
											that.close('.pop', '.black');
											window.location.href="/user-intell?userdel";
										},1000);
										
									}	
								},
								error : function(data){
									console.log(data);
									return false;
								}
							})
					})	
				})

			}

			$('#setintell').on('click', function(evt){
				evt.preventDefault();
				var minMoney = $('#amounta').val();
				var maxMoney = $('#amountb').val();
				var minCycle = $('#amountc').val();
				var maxCycle = $('#amountd').val();
				var minRates = $('#amounte').val();
				var maxRates = $('#amountf').val();
				var payment = $('.intell-init').val().NoSpace();
				if(minMoney==''|| maxMoney==''|| minCycle==''|| maxCycle==''|| minRates==''|| maxRates==''){
					$(this).html('请正确设置信息');
					return false;
				}
				if(payment == '' || payment == null || payment.length!=6){
					$('.intell-init').css({'border':'1px solid #ff0000'});
					$(this).html('正确输入交易密码');
					return false;
				}else{
					$(this).html('确认设置');
				}
				$.ajax({
					url : '/setintell',
					type : 'POST',
					dataType : 'json',
					data: {'minMoney' : minMoney, 'maxMoney' : maxMoney, 'minCycle' : minCycle, 'maxCycle' : maxCycle, 'minRates' : minRates, 'maxRates' : maxRates, 'payment' : payment},
					success : function(data){
						if(data.statusCode != 0){
							if(data.message === undefined){
								$('#error').html('<p>'+ data +'!</p>');
							}else{
								$('#error').html('<p>'+ data.message +'!</p>');
							}
						}else{
							$('.pop dd').html('<strong class="success"><i></i>添加成功！</strong>');
							that.pop('.pop','.black','.close');
							setTimeout(function(){
								that.close('.pop', '.black');
								window.location.href="/user-intell?userset";
							},1000);
							
						}	
					},
					error : function(data){
						console.log(data);
						return false;
					}
				})

				//console.log(minMoney, maxMoney, minCycle, maxCycle, minRates, maxRates, payment);

			});
		},
		//短信计时
		countdown : function(a){
			var that = this;
			var mail = setInterval(smail,1000);
			var j = 60;

			function smail(){
				j--;
				$(a).html(j+'s');
				if(j == 0) {
					clearInterval(mail);
					$(a).removeClass('hc-end').html('重新发送').attr('disabled',false);
					return false;
				}
			}
			
		},

		funds : function(){
			var that = this;
			var pageSize = 3;
			var pageIndex = 0;
			$.get(hcUrl+'scripts/lib/hc-found.js', function(data, status){
				$('#pageload').remove();
			    $.ajax({
			    	url : '/loadfund',   
			        type : 'POST',  
			        dataType : 'json',
			        //提交两个参数：pageIndex(页面索引)，pageSize(显示条数) 
			        data : { 'pageSize' : pageSize, 'pageIndex' : pageIndex, 'url' : 'journal'},                  
			        success : function(data) {
			        	var pcount = data.data.rows;
			        	console.log(pcount);
			        	fundData(pcount, pageSize, pageIndex, 'journal', 0);
			        }  
			    });
				
			});

			$('ul.fund li').click(function(){
				var fund = $('ul.fund li.on').index();
				$('.tfund').eq(fund).html('<img src="images/common/load.gif" id="pageload">');
				if(fund == 0){var fundurl = 'journal'}
				if(fund == 1){var fundurl = 'finance_order'}
				if(fund == 2){var fundurl = 'recharge'}
				if(fund == 3){var fundurl = 'withdraw'}
				if(fund == 4){var fundurl = 'reward'}
				if(fund == 5){var fundurl = 'vault'}
			    $.ajax({
			    	url : '/loadfund',   
			        type : 'POST',  
			        dataType : 'json',
			        //提交两个参数：pageIndex(页面索引)，pageSize(显示条数) 
			        data : { 'pageSize' : pageSize, 'pageIndex' : pageIndex, 'url' : fundurl},                  
			        success : function(data) {
			        	var pcount = data.data.rows;
			        	fundData(pcount, pageSize, pageIndex, fundurl, fund);
			        }  
			    });
			});
		},

		//债权转让
		invest : function(){
			var that = this;
			$.get(hcUrl+'scripts/lib/hc-usertransfer.js', function(data, status){
				$('#pageload').remove();
			});
		},

		//积分兑换
		integral : function(){
			var that = this;
			$('.integral-button').on('click', function(evt){
				evt.preventDefault();
				that.pop('.pop','.black','.close');
				$('.integral .min').click(function(){
					var number = parseInt($('#c-num').val());
					if(number>1){
						number--;
						$('#c-num').val(number);
					}
				});
				$('.integral .max').click(function(){
					var number = parseInt($('#c-num').val());			
						number++;
						$('#c-num').val(number);
				});
			});
		},

		//账户设置
		usersetup : function(){
			var that = this;

			$('.user-infor input').on('click',function(){
				if($('#user-err').length){$('#user-err').remove()};
			});
			$('#user-setup').on('click',function(evt){
				evt.preventDefault();
				if($('#nick-name').val()=='' || $('#nick-name').val()==null){
					$('#nick-name').css({'border':'1px solid #ff0000'});
					return false;
				}
				var mail = $('#e-mail').val();
				var myReg = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
				if(mail == '' || mail == null || !myReg.test(mail)){
					$('#e-mail').css({'border':'1px solid #ff0000'});
					return false;
				}
				//console.log(!myReg.test(mail));

				var picid = $('.user-infor em').attr('class').split(' ')[2].split('-')[1];
				var name = $('#nick-name').val().NoSpace();
				var mail = $('#e-mail').val().NoSpace();
				
			    $.ajax({
			    	url : '/setuserinfo',   
			        type : 'POST',  
			        dataType : 'json',
			        data : { 'headPicId' : picid, 'nickName' : name, 'email' : mail},

			        success : function(data) {
			        	if(data.statusCode != 0){
			        		$('#user-setup').html(data.message);
			        	}else{
			        		delCookie('hcuserinfo');
							$('.pop dd').html('<strong class="success"><i></i>保存成功！</strong>');
							that.pop('.pop','.black','.close');
							setTimeout(function(){
								that.close('.pop', '.black');
								window.location.href="/user-information?save";
							},1000);	
			        	}
			        }  
			    });

			});
		},

		init : function(){
			var that = this;
			//user-center 用户中心
			if($('#profit-rap').length){
				//隐藏金额
				var assets = $('#user-assets').text();
				var balance = $('#user-balance').text();
				$('#hiding').click(function(){
					if($(this).hasClass('balance')){
						$(this).removeClass('balance');
						$('#user-assets').html(assets);
						$('#user-balance').html(balance);
					}else{
						$(this).addClass('balance');
						$('#user-assets, #user-balance').html('--------');	
					}
				});
				that.profit();
				that.total();
			}

			//user-menu 用户中心导航
			that.tabs('.user-menu li','.param','on');

			if($('#userinfo').length){
				that.userinfo();
			}
			
			//user-head 用户中心修改头像
			$('.user-infor em').click(function(){
				$(this).next('.user-head').show();
			});
			$('.user-head li').click(function(){
				var head = $(this).text();
				var em = $('.user-infor em').attr('class').split(' ')[1];
				$('.user-infor em').removeClass().addClass('userhead userpicture '+head);
				$('.user-head').hide();
				
			});

			//user-recharge 充值 提现
			if($('.user-recharge').length){
				that.recharge();
				that.withdraw();
			}

			if($('#usertobank').length){
				that.useraddbank();
			}

			//user-message 用户消息
			$('.user-news li a').click(function(){
				$(this).parent().next('.message').slideToggle();
			});

			//user-intell 智能投资
			if($('.user-intell').length){
				that.intell();
			}

			//user-found 资金记录
			if($('.fund').length){
				that.funds();
			}
			 
			//invest 转让
			if($('.invest').length){
				that.invest();
			}

			
			//user-infor 帐户设置
			if($('.user-infor').length){
				that.usersetup();
			}

			//认证信息
			if($('#authen').length){
				$('#send-code').attr('disabled',true).addClass('hc-end');
				that.countdown('#send-code');
				that.authen();
			}
			//找回登录密码
			if($('#getpwd').length){
				that.getpassword();
			}

			/*积分兑换
			if($('.user-integral').length){
				that.integral();
				that.tabs('.integral .mode', null,'choice');
			}
			*/

			//提示user-tip
			if($('.user-tip').length){
				$('.user-tip').hover(function(){
					$(this).stop().children('#user-tip').fadeIn();
				},function(){
					$(this).stop().children('#user-tip').fadeOut();
				});
			}
			//银行卡
			if($('#choicebank').length){
					$.get(hcUrl+'scripts/lib/card.js', function(result){
						that.useraddbank();
						//that.pop('.pop','.black','.close');
					});
			}
			//账户安全
			if($('.user-safety').length){
				that.safety();
			}
			//卡券
			/**/
			if($('.user-card').length){
				$.get(hcUrl+'scripts/lib/hc-card.js', function(result){
					$('#pageload').remove();
				});
			}
			

			console.log('hc-u-ver 1.0');

			//placeholder
			var input = document.createElement('input');
			if('placeholder' in input){
				return;
			}else{
				$('#authen dd i').css({'visibility' : 'visible'})

			}
			$('.userlogin input').bind({
				focus : function(){$(this).next('i').css({'visibility' : 'hidden'})},
				blur : function(){if($(this).val()==''){$(this).next('i').css({'visibility' : 'visible'})}else{$(this).next('i').css({'visibility' : 'hidden'})}}
			});
					
		}

	}