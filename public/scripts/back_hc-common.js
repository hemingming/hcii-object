/*
 * www.huachengjr.com www.hcii.cn script@auth:ming
 */
var hcUrl = './';
String.prototype.NoSpace = function(){
	return this.replace(/\s+/g, ""); 
}
var hcScript = {

	name : '花橙金融',
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
	pop : function(a,b,c) {
		var that = this;
		var blackbgh = document.documentElement.scrollHeight;
		$(b).css('height', blackbgh);
		var window_height = $(window).height();
		//var top = 200 +'px';
		//var top = (parseInt(window_height) - parseInt($(a).height())) / 2 + 'px';
		var top = document.body.scrollTop || document.documentElement.scrollTop;
		$(a).css('top', top+100);
		$(a).show();
		$(b).show();
		$(c).click(function() {
			that.close(a,b);
		});
	},
	close : function(a,b) {
		var that = this;
		$(a).hide();
		$(b).hide();
	},

	//产品详细查看
	detail : function(){
		var that = this;
		String.prototype.NoSpace = function(){ 
			return this.replace(/\s+/g, ""); 
		}

		var insur = Number($('#in-sur').text().NoSpace()).toFixed(2);   //剩余份数
		var inmax = Number($('#in-max').text().NoSpace()).toFixed(2);   //最大份数
		var indays = Number($('#in-days').text().NoSpace());			//投资天数
		var inrate = $('#in-rate').text().NoSpace()/100;                //投资利率
		
		//全选操作
		$('#in-checkall').click(function(){
			if($('#user-err').length){$('#user-err').remove()};
			if($('#in-checkall i').hasClass('check')){
				$('#in-checkall i').removeClass('check');
				$('#in-sum').text('0.00');
				$('#in-exp').text('0.00');
				$('#in-all').text('0.00');
				$('#in-init').val('');
			}else{
				$('#in-checkall i').addClass('check');
				if(parseInt(insur) > parseInt(inmax)){
					var inexp = parseInt(inmax)*inrate/360*indays;
					$('#in-init').val(parseInt(inmax));
					$('#in-sum').text(inmax);
					$('#in-exp').text(inexp.toFixed(2));
					var total = Number(inmax)+Number(inexp);
					$('#in-all').text(total.toFixed(2));
				}else{
					var inexp = parseInt(insur)*inrate/360*indays;
					$('#in-init').val(parseInt(insur));
					$('#in-sum').text(insur);
					$('#in-exp').text(inexp.toFixed(2));
					var total = Number(insur)+Number(inexp);
					$('#in-all').text(total.toFixed(2));
				}
			}
		});

		//金额操作
		$('#in-init').bind('keyup blur click',function(event){
			if($('#user-err').length){$('#user-err').remove()};
			var current = $('#in-init').val();
			$('#in-init').val(current.replace(/\D/g,''));
			if(parseInt(current) == 0|| current === '' || isNaN(current)){
				$('#in-init').val('');
				$('#in-sum').text('0.00');
				$('#in-exp').text('0.00');
				$('#in-all').text('0.00');
				return false;
			}
			if(parseInt(current) > insur){
				$('#in-init').val(parseInt(insur));
				var inexp = parseInt(insur)*inrate/360*indays;
				$('#in-sum').text(insur);
				$('#in-exp').text(inexp.toFixed(2));
				var total = Number(insur)+Number(inexp);
				$('#in-all').text(total.toFixed(2));
			}else{
				var inexp = parseInt(current)*inrate/360*indays;
				$('#in-sum').text(parseInt(current).toFixed(2));
				$('#in-exp').text(inexp.toFixed(2));
				var total = Number(current)+Number(inexp);
				$('#in-all').text(total.toFixed(2));
			}
		});

		
		//提交订单
		$('#sub-order').click(function(evt){
			evt.preventDefault();
			//if($('#user-err').length){$('#user-err').remove()};
			var order = $('#in-init').val();
			//$('.purch input').on('click keydown mousedown', function(){$('#sub-order').html('提交订单');});
			if(order == 0|| order === '' || isNaN(order)){
				//$('.purch').append('<em id="user-err" class="hide"><i></i>请输入认购金额提交订单！</em>');
				//$('#user-err').fadeIn();
				$('#sub-order').html('请输入认购金额');
				return false;
			}else{
				var slug = $('#billid').val();
				var code = $('#billorder').val();
				var buynumber = order;
				var cardid = $('#cardid').val();
				if(slug == '' || buynumber == ''){
					$('#sub-order').attr('disabled',true).html('没有购买资格');
					return false;
				}

				$('#sub-order').html('<img src="images/common/verfy.gif" style="margin:0 auto;display:block;">');

				$.ajax({
					url : '/paybill',
					type : 'POST',
					dataType : 'json',
					//cache : false,
					data: {'slug' : slug, 'copies' : buynumber, 'code' : code, 'cardid' : cardid},
					success : function(data){
						//console.log(data);
						if(data == -999){
							window.location.href='/login?detail'; //请登录
						}else{
							if(data.statusCode != 0){
								if(data.statusCode == 17.2){
									$('#sub-order').html('余额不足请先充值');
									return false;
								}else{
									$('#sub-order').html(data.message);
									return false;	
								}
							}else{
								var ormoney = data.data.order.prompt;
								var orint = data.data.order.prompt;
								var orate = data.data.order.prompt;

								if(orate === undefined){orate = '';}else{ orate = '+'+data.data.order.prompt['OrRates'];} 
								if(ormoney === undefined){ormoney = '';}else{ormoney = '+'+data.data.order.prompt['OrMoney'];}
								if(orint === undefined){orint = '';}else{orint = '+'+data.data.order.prompt['OrInterest'];}

								if(orate == '+undefined'){orate = '';} if(ormoney == '+undefined'){ormoney = '';} if(orint == '+undefined'){orint = '';}
								console.log(orate, ormoney, orint);
								//$('#user-pay').show();
								$('#pop-contact').html(
								    '<ul class="line">'
								        +'<li><span>产品名称：</span><em>'+data.data.view.Name+'</em></li>'
								        +'<li><span>投资金额：</span><em><b class="amount f-t" id="order-sum">' +$('#in-sum').text()+ ' '+ormoney+'</b> 元</em> </li>'
								        +'<li><span>预期收益：</span><em><b class="profit f-t" id="order-exp">' +$('#in-exp').text()+ ' '+orint+'</b> 元 </em></li>'
								        +'<li><span>下单时间：</span><em>'+data.data.order.orderTime+'</em></li>'
								        +'<li><span>订单编号：</span><em>'+data.data.order.orderCode+'</em></li>'
								    +'</ul>'
								    +'<ul>'
								        +'<li><span>账户姓名：</span><em>'+data.data.user.Name+'</em></li>'
								        +'<li><span>身份证号：</span><em>'+data.data.user.IdCard+'</em> </li>'
								        +'<li><span>手机号码：</span><em>'+data.data.user.Moblie+'</em> </li>'
								        +'<li><span>获得积分：</span><em>'+parseInt($('#in-sum').text())+'</em></li>'
								        +'<li><span>账户余额：</span><strong id="usermoney">'+data.data.assets['fund']+'</strong> 元</li>'
								        +'<li><span>收益宝余额：</span><em class="income"><b>'+data.data.assets['vault']+'</b> 元</em></li>'
								        +'<li><span>交易密码：</span><em><input type="password" name="pay" class="pay" id="pay-password" maxlength="6"> <a href="/user-safety">忘记交易密码？</a></em></li>'
								        +'<li><span>&nbsp;</span><em class="agreement">同意并查看<a href="/trustagreement&'+slug+'" target="_blank">《委托协议》</a>及<a href="/loanagreement&'+slug+'" target="_blank">《质押借款协议》</a></em></li>'
								    +'</ul>'
								    +'<input type="hidden" value="'+data.data.form['CardDelId']+','+data.data.form['ItemDelId']+','+data.data.form['Key']+','+data.data.form['OrderCode']+','+data.data.form['OrderCopies']+','+data.data.form['Strtotime']+','+data.data.form['ThisTime']+'" id="parampay">'
								    +'<button type="button" class="hc-buy" id="user-pay">确认支付</button>'
								);
								$('#sub-order').html('提交订单');
								if(parseInt($('#order-sum').text()) > parseInt($('#usermoney').text())){
									$('#user-pay').html('余额不足使用收益宝');
								}
								that.userpay();
								that.pop('.pop','.black','.close');
							}
						}
					},
					error : function(data){
						console.log(data);
						return false;
					}
				});
				
				
			}
		});

		//进度条
		$('.gress').animate({width : $('#percent').text()});

		$('#picdata').click(function(){
			var picurl = $('#bill').attr('data');
			var picarr = $('#bill').attr('parma');
			if(picurl.length>0){
				$('#bill').empty().append('<img src="http://'+picurl+'" alt="花橙金融">');
			}
			//console.log(picarr === '' , picarr === null , picarr === undefined);
			if(picarr !== ''){
				var arr = picarr.split(',');
				$('#bill').empty();
				for(var i = 0;i < arr.length;i+=1){
					$('#bill').append('<img src="http://'+arr[i]+'" alt="花橙金融">');
				}				
			}

			
		});
		that.tabs('.param-box ul li','.param-center dl','on');

		//卡券
		$('.mcard').click(function(e){
			$('#cardlist').show();
			e.stopPropagation();
		});

		$('#cardlist i').on('click', function(e){
			if($(this).hasClass('check')){
				$(this).removeClass('check');
				var cardid = '';
				$('#cardid').val(cardid);
				$('#cardlist').hide();
				e.stopPropagation();
			}else{
				$('#cardlist i').removeClass('check');
				$(this).addClass('check');
				var cardid = $(this).attr('data');
				$('#cardid').val(cardid);
				$('#cardlist').hide();
				e.stopPropagation();
			}

		});
		$('#cardlist').click(function(e){
			e.stopPropagation();
		});
		$(document).click(function(){
			$('#cardlist').hide();
		});

	},

	userpay : function(){
		var that = this;
		//确认支付
		$('#user-pay').click(function(evt){
			//$(this).attr('disabled',false);
			if($('#user-err').length){$('#user-err').remove()};
			if($('#pay-password').val() == '' || $('#pay-password').val().length != 6){
				$('#pay-password').css({'border':'1px solid #ff0000'});
				$(this).html('请正确输入交易密码');
				return false;
			}else{
				var param = $('#parampay').val();
				var CardDelId = param.split(',')[0];
				var ItemDelId = param.split(',')[1];
				var Key = param.split(',')[2];
				var OrderCode = param.split(',')[3];
				var OrderCopies = param.split(',')[4];
				var Strtotime = param.split(',')[5];
				var ThisTime = param.split(',')[6];
				var payment = $('#pay-password').val();
				evt.preventDefault();
				$('#user-pay').html('<img src="images/common/verfy.gif" style="margin:0 auto;display:block;">');
				$.ajax({
					url : '/topay',
					type : 'POST',
					dataType : 'json',
					//cache : false,
					data: {'cardDelId' : CardDelId, 'itemDelId' : ItemDelId, 'key' : Key, 'orderCode' : OrderCode, 'orderCopies' : OrderCopies, 'strtotime':Strtotime, 'thisTime':ThisTime, 'payment':payment},
					success : function(data){
						if(data == -999){
							window.location.href='/login'; //请登录
						}else{
							if(data.statusCode != 0){
								if(data.statusCode == 17.2){
									$('#user-pay').attr('disabled',true).html('余额不足请先充值');
									return false;
								}else{
									$('#user-pay').html(data.message);
									return false;	
								}
							}else{
								$('#user-pay').hide();
								$('#pop-contact').html('<strong class="success"><i></i>购买成功！</strong>');
								setTimeout(function(){
									window.location.href='/user-invest';
								},1000);
								return false;
							}
						}
					},
					error : function(data){
						console.log(data);
						return false;
					}
				});	
			}
			
		});		
	},

	//滚动信息
	scrollTop : function(a,b,c){
		var that = this;
		if ($(b).length > 1) {
			
			var speed = c;
			setTimeout(function scroll() {
				var $scroll0 = $(a).children().eq(0);
				$(a).animate({
					marginTop: -$scroll0.height()
				}, 800, function() {
					$(a).append($scroll0);
					$(a).css({
						marginTop: 0
					});
					setTimeout(scroll, speed);
				});
			}, speed);
		}
	},

	//登录处理
	userlogin : function(){
		var that = this;

		$('#user-login').on('click', function(evt){
			evt.preventDefault();
			var account = $('#account').val().NoSpace();
			var password = $('#password').val().NoSpace();
			if(account === '' || account === null || isNaN(account) || account.length!=11){
				$('#error').html('<p>请正确输入登录帐号？</p>');
				return false;
			}
			if(password === '' || password === null || password.length<6){
				$('#error').html('<p>请正确输入登录密码？</p>');
				return false;
			}
			$('#error').html('<img src="/images/common/verfy.gif" alt="loading...">');
			//验证登录
			if($('#vercode').length){
				var vercode  = $('#vercode').val().NoSpace();
				if(vercode === '' || vercode === null || isNaN(vercode) || vercode.length!=4){
					$('#error').html('<p>请正确输入图片验证码？</p>');
					return false;
				}
				$.ajax({
					url : '/veruserlogin',
					type : 'POST',
					dataType : 'json',
					//cache : false,
					data: {'username' : account, 'password' : password, 'vercode' : vercode},
					success : function(data){
						if($('#serror').length){$('#serror').html(data);}
						if(data.statusCode == 1.9){
							$('#error').html('<p>'+data.message+'! 请 <a href="/authen">【点击认证】</a> 激活！</p>');
							return false;
						}
						if(data.statusCode != 0){
							if(data.message === undefined){
								$('#error').html('<p>'+ data +'!</p>');
								$('#verpicture').attr('src','/captcha?nocache='+new Date().getTime());
							}else{
								$('#error').html('<p>'+ data.message +'!</p>');
								$('#verpicture').attr('src','/captcha?nocache='+new Date().getTime());
							}
							return false;
						}
						if(data.statusCode == 0){
							window.location.href='/usercenter';
						}
					},
					error : function(data){
						console.log(data);
						return false;
					}
				});

			}else{
				$.ajax({
					url : '/userlogin',
					type : 'POST',
					dataType : 'json',
					//cache : false,
					data: {'username' : account, 'password' : password},
					success : function(data){
						if($('#serror').length){$('#serror').html(data);}
						if(data.statusCode == 1.9){
							$('#error').html('<p>'+data.message+'! 请 <a href="/authen">【点击认证】</a> 激活！</p>');
							return false;
						}
						if(data.statusCode == -2.5){
							$('#error').html('<p>'+data.message+'! </p>');
							$('#user-login').attr('id','#user-login-ver').parent().before('<dd><label class="hcuser verify">验证码</label><input type="text" name="vercode"  placeholder="验证码" class="ver-code" id="vercode"><i>验证码</i><span><img src="/captcha" id="verpicture" /></span></dd>');
							$('#verpicture').on('click', function(){
					  			$(this).attr('src','/captcha?nocache='+new Date().getTime());
							});
							return false;
						}
						if(data.statusCode != 0){
							$('#error').html('<p>'+data.message+'!</p>');
							return false;
						}
						if(data.statusCode == 0){
							window.location.href='/usercenter';
						}
					},
					error : function(data){
						console.log(data);
						return false;
					}
				});
			}
		});
	},

	//注册
	uregister : function(){
		var that = this;

		$('#user-reg').on('click', function(evt){
			evt.preventDefault();
			var account = $('#account').val().NoSpace();
			var password = $('#password').val().NoSpace();
			var surepass = $('#r-password').val().NoSpace();
			var vercode = $('#vercode').val().NoSpace();
			var phone = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
			var passinit = /^(([a-z]+[0-9]+)|([0-9]+[a-z]+))[a-z0-9]*$/i;

			if(account === '' || account === null || isNaN(account)|| !phone.test(account) || account.length!=11){
				$('#error').html('<p>请正确输入注册手机号？</p>');
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
			if(vercode === '' || vercode === null || isNaN(vercode) || vercode.length!=4){
				$('#error').html('<p>请正确输入验证码？</p>');
				return false;
			}
			$('#error').html('<img src="/images/common/verfy.gif" alt="loading...">');
			$.ajax({
				url : '/userregister',
				type : 'POST',
				dataType : 'json',
				//cache : false,
				data: {'username' : account, 'password' : password, 'surepass' : surepass, 'vercode' : vercode},
				success : function(data){
					if(data.statusCode != 0){
						if(data.message === undefined){
							$('#error').html('<p>'+ data +'!</p>');
							$('#verpicture').attr('src','/captcha?nocache='+new Date().getTime());
						}else{
							$('#error').html('<p>'+ data.message +'!</p>');
							$('#verpicture').attr('src','/captcha?nocache='+new Date().getTime());
						}
						return false;
						//console.log(data);
					}else{
						$('#verpicture').attr('src','/captcha?nocache='+new Date().getTime());
						//console.log(data);
						window.location.href='/authen';
					}	
				},
				error : function(data){
					$('#verpicture').attr('src','/captcha?nocache='+new Date().getTime());
					console.log(data);
					return false;
				}
			});
		});
		$('#register input').on('click keydown mousedown', function(){$('#error').html('');});
		$('#verpicture').on('click', function(){
  			$(this).attr('src','/captcha?nocache='+new Date().getTime());
		});
		return false;
	},

	products : function(){
		var that = this;
		var pageSize = 3;
		var pageIndex = 0;
		$.get(hcUrl+'scripts/lib/hc-products.js', function(data, status){
			$('#pageload').remove();
		    $.ajax({
		    	url : '/loadproducts',   
		        type : 'POST',  
		        dataType : 'json',
		        //提交两个参数：pageIndex(页面索引)，pageSize(显示条数) 
		        data : { 'pageSize' : pageSize, 'pageIndex' : pageIndex, 'hcType' : 0, 'hcAmount' : 0, 'hcCycle' : 0, 'hcRates' : 0},                  
		        success : function(data) {
		        	if(data.statusCode == 0){
			        	var pcount = data.data.rows;
			        	prolist(pcount, hcType, hcAmount, hcCycle, hcRates);
		        	}
		        }  
		    });
			
		});	
	},

	init : function(){
		var that = this;
		$(window).load(function(){
			$('#loading').remove();
		});
		if($('#loading').length){
			setTimeout(function(){
				$('#loading').animate({top:'-100px'},800,function(){
					$(this).remove();
				});
			},200);	
		}
		if($('#hcii').length){
			setTimeout(function(){
				$('#hcii, .hcii').fadeIn();
			},20000);

			$('#hcii i').click(function(){
				$('#hcii, .hcii').fadeOut();
			});
		}

		//产品列表
		if($('#products').length){
			that.products();
		}
		//产品转让
		if($('.tran-ticket').length){
			//that.transfer();
			$.get(hcUrl+'scripts/lib/hc-transfer.js', function(data, status){
				$('#pageload').remove();
			});
		}

		//产品载入
		if($('.purch').length){
			that.detail();
		}

		//slide swiper
		if($('#banner').length){
			$('.swiper').slide({mainCell:'.picure ul',effect:'left',autoPlay:true,titCell:'.cursor li',interTime:4000});
		}

		if($('#notice').length){
			that.scrollTop('#notice > ul','#notice ul > li',2000);
			that.scrollTop('#hot > ul','#hot ul > li',2000);
			that.scrollTop('#partner > ul','#partner ul > li',3000);
		}

		//提示user-tip
		if($('.user-tip').length){
			$('.user-tip').hover(function(){
				$(this).stop().children('#user-tip').fadeIn();
			},function(){
				$(this).stop().children('#user-tip').fadeOut();
			});
		}
		
		//login & register & authen
		if($('#login').length){
			that.userlogin();
		}
		if($('#register').length){
			that.uregister();
		}
		//article publicPage
		if($('.job').length){
				$.get(hcUrl+'scripts/lib/jquery.pagination.js', function(result){
						$(function(){
							
							var num_entries = $('#hiddenresult li').length;
							var pagesize = 10;
							$('#pagination').pagination(num_entries, {
								prev_text: "上一页",
								next_text: "下一页",
								num_edge_entries: 2, //边缘页数
								num_display_entries: 4, //主体页数
								callback: pageselectCallback,
								items_per_page: pagesize //每页显示
								
							});
							 
							function pageselectCallback(page_index, jq){//装载对应分页的内容console.log(page_index);
								var new_content = $('#hiddenresult li').clone();
								$('#searchresult').empty();
								for(var i = page_index*pagesize; i < (page_index+1)*pagesize; i+=1 ){
									$('#searchresult').append(new_content[i]);
								}
								return false;
							}
							if(num_entries == 0){
								$('#searchresult').html('<p>暂无记录, 请稍后...</p>');
							}
						});
				});
				
				$('.news img').each(function(){
					$(this).css({'width' : '100%', 'height' : 'auto'});
				});
		}

		console.log('hc-c-ver 1.0');

		//placeholder
		var input = document.createElement('input');
		if('placeholder' in input){
			return;
		}else{
			$('#login dd i, #register dd i, #getpwd dd i').css({'visibility' : 'visible'})
		}
		$('.userlogin input').bind({
			focus : function(){$(this).next('i').css({'visibility' : 'hidden'})},
			blur : function(){if($(this).val()==''){$(this).next('i').css({'visibility' : 'visible'})}else{$(this).next('i').css({'visibility' : 'hidden'})}}
		});


	}

}



