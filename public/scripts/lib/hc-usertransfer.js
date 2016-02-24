/*
 * 用户中心债权转让
 */

/*
 * 数据参数
 */
var now = $('.invest li.on').index();
//var pcount = $('#pagecount').val();

$('.invest li').click(function(){
	var now = $('.invest li.on').index();
	$('.tbody').eq(0).html('<img src="images/common/load.gif" id="pageload">');
	var pcount = pcount;
	transferData(now);
});

function transfer(){
		//transfer
		$('.transfer').on('click', function(evt){
			evt.preventDefault();
			var delid = $(this).attr('data');
			$.ajax({
				url : '/transfer',
				type : 'POST',
				dataType : 'json',
				data: {'delid' : delid},
				success : function(data){
					if(data.statusCode == 18.2){
							//console.log(data.statusCode == 18.2);
							//$('#user-pay').hide();
							$('.pop dt').html('投资转让');
							$('#pop-contact').html('<strong class="error"><i></i>'+data.message+'！</strong>');
							/*
							setTimeout(function(){
								hcuserScript.close('.pop', '.black');
							},3000);
							*/		
					}else{
							$('.pop dt').html('投资转让');
							//$('#user-pay').show();
							//$('#totransfer').attr('data',data.data.order.DelId);
							$('#pop-contact').html(
					            '<ul class="line clear">'
					            +'<li><label>产品名称：</label><em id="bname">'+data.data.item.Name+'</em></li>'
					            +'<li><label>订单编号：</label><em id="border">'+data.data.order.Code+'</em></li>'
					            +'<li><em class="line-r"><label>投资金额：</label><b class="blue f-t" id="a-amount">'+data.data.order.Money+' </b> 元</em> <em class="line-r"><label>项目周期：</label><b id="cycle">'+data.data.item.Cycle+'</b> 天</em></li>'
					            +'<li><em class="line-r"><label>到期收益：</label><b class="blue f-t" id="b-profit">'+data.data.order.Interest+'</b> 元</em><label>剩余收益：</label><span><b class="blue f-t" id="f-profit-s">'+data.data.transfer.OrInterest+'</b> 元</span></li>'
					            +'<li><em class="line-r"><label>购买日期：</label>'+data.data.order.UpTime+'</em> <em class="line-r"><label>到期日期：</label>'+data.data.order.EndDate+'</em></li>'
					            +'</ul>'
					            +'<ul class="line">'
					            +'<li><h2>转让预算</h2></li>'
					            +'<li><label>已投周期：</label><span><b id="days-y">'+data.data.transfer.HoCycle+'</b> 天</span> <strong>剩余周期：</strong><span><b id="days">'+data.data.order.SwCycle+'</b> 天</span></li>'
					            +'<li><label>已赚收益：</label><span><b class="blue f-t" id="f-profit-y">'+data.data.transfer.Interest+'</b> 元</span><strong>转让金额：</strong><span><b class="amount f-t" id="f-amount">'+data.data.order.Money+' </b> 元</span></li>'
					            +'<li><label>年化利率：</label><span><b id="rate">'+data.data.item.Rates+'</b> %</span> <strong>转让收益：</strong><span><b class="profit f-t" id="f-profit">'+data.data.transfer.OrInterest+'</b> 元</span></li>'
					            +'<li><label>手续费用：</label><span><b>'+data.data.transfer.Fee+'</b> 元</span> <strong>补贴收益：</strong><em class="blue f-t" id="f-profit-b"><input type="text" id="swmoney" class="orange" value="0" /></em>元</li>'
					            +'<li><div id="transfer-max"></div></li>'
					            +'</ul><ul><li><span>交易密码：</span><em><input type="password" name="pay" class="pay" id="payment"> <a href="/user-safety"> &nbsp;忘记交易密码？</a></em></li><li><span>&nbsp;</span><em><button type="button" id="totransfer" data="'+data.data.order.DelId+'">确认转让</button></em></li></ul> '
					        );
							totransfer();
						}
						
						hcuserScript.pop('.pop','.black','.close');	

				},
				error : function(data){
					console.log(data);
					return false;
				}
			})
		});

		//查看项目详情
		$('a.mybill').on('click', function(evt){
			evt.preventDefault();
			var billid = $(this).parent().next().children('button').attr('data');
			$.ajax({
				url : '/billdetail',
				type : 'POST',
				dataType : 'json',
				data: { 'delId' : billid },
				success : function(data){
					if(data.statusCode != 0){
						console.log(data);
					}else{
						var datatype = data.data.order.ItemType;
						if(datatype == 4){
							$('#payment').val('');
							$('#user-pay').hide();
							$('.pop dt').html('投资项目');
							$('#pop-contact').html(
								'<ul class="line clear">'
								+'<li><label>项目名称：</label><em>'+data.data.item.Name+'</em></li>'
								+'<li><label>订单编号：</label><em>'+data.data.order.Code+'</em></li>'
								+'<li><em class="line-r"><label>投资金额：</label><b class="amount">'+data.data.order.Money+'</b> 元</em> <em class="line-r"><label>预期利息：</label><b class="amount">'+data.data.order.OrInterest+'</b> 元</em></li>'
								+'<li><em class="line-r"><label>项目周期：</label><b>'+data.data.item.Cycle+'</b> 天</em> <em class="line-r"><label>年化利率：</label><b>'+data.data.item.Rates+'</b> %</em></li>'
								+'<li><em class="line-r"><label>到期日期：</label><b>'+data.data.item.EndDate+'</b></em><em class="line-r"><label>最迟还款日：</label><b>'+data.data.item.LastDate+'</b></em></li>'
								+'<li><label>发售日期：</label><b>'+data.data.item.StartTime+'</b> </li>'
								+'<li><label>购买日期：</label><b>'+data.data.order.UpTime+'</b> </li>'
								+'</ul>'
								+'<ul><li><label>协议查看：</label><a href="/trustagreement&4&'+data.data.order.DelId+'" target="_blank">委托协议</a> <a href="/loanagreement&4&'+data.data.order.DelId+'"  target="_blank">质押协议</a></li><li><label>抵押担保：</label><a href="javascript:void(0);" data="'+data.data.item.Img+'" class="lookbill"> 查看 </a></li><li class="pledge"></li><li>&nbsp;</li></ul>'
								);
						}else if(datatype == 2){
							$('#pop-contact').html(
								'<ul class="line clear">'
								+'<li><label>项目名称：</label><em>'+data.data.item.Name+'</em></li>'
								+'<li><label>订单编号：</label><em>'+data.data.order.Code+'</em></li>'
								+'<li><em class="line-r"><label>投资金额：</label><b class="amount">'+data.data.order.Money+'</b> 元</em> <em class="line-r"><label>预期利息：</label><b class="amount">'+data.data.order.OrInterest+'</b> 元</em></li>'
								+'<li><em class="line-r"><label>项目周期：</label><b>'+data.data.item.Cycle+'</b> 天</em> <em class="line-r"><label>年化利率：</label><b>'+data.data.item.Rates+'</b> %</em></li>'
								+'<li><em class="line-r"><label>到期日期：</label><b>'+data.data.item.EndDate+'</b></em><em class="line-r"><label>最迟还款日：</label><b>'+data.data.item.LastDate+'</b></em></li>'
								+'<li><label>发售日期：</label><b>'+data.data.item.StartTime+'</b> </li>'
								+'<li><label>购买日期：</label><b>'+data.data.order.UpTime+'</b> </li>'
								+'</ul>'
								+'<ul><li><label>协议查看：</label><a href="/trustagreement&2&'+data.data.order.DelId+'" target="_blank">委托协议</a> <a href="/loanagreement&2&'+data.data.order.DelId+'"  target="_blank">质押协议</a></li><li><label>抵押担保：</label><a href="javascript:void(0);" data="'+data.data.item.Img+'" class="lookbill"> 查看 </a></li><li class="pledge"></li><li>&nbsp;</li></ul>'
								);
						}else{
							$('#payment').val('');
							$('#user-pay').hide();
							$('.pop dt').html('投资项目');
							$('#pop-contact').html(
								'<ul class="line clear">'
								+'<li><label>项目名称：</label><em>'+data.data.item.Name+'</em></li>'
								+'<li><label>订单编号：</label><em>'+data.data.order.Code+'</em></li>'
								+'<li><em class="line-r"><label>投资金额：</label><b class="amount">'+data.data.order.Money+'</b> 元</em> <em class="line-r"><label>预期利息：</label><b class="amount">'+data.data.order.OrInterest+'</b> 元</em></li>'
								+'<li><em class="line-r"><label>项目周期：</label><b>'+data.data.item.Cycle+'</b> 天</em> <em class="line-r"><label>年化利率：</label><b>'+data.data.item.Rates+'</b> %</em></li>'
								+'<li><em class="line-r"><label>到期日期：</label><b>'+data.data.item.EndDate+'</b></em><em class="line-r"><label>最迟还款日：</label><b>'+data.data.item.LastDate+'</b></em></li>'
								+'<li><label>发售日期：</label><b>'+data.data.item.StartTime+'</b> </li>'
								+'<li><label>购买日期：</label><b>'+data.data.order.UpTime+'</b> </li>'
								+'</ul>'
								+'<ul><li><label>协议查看：</label><a href="/trustagreement&1&'+data.data.order.DelId+'" target="_blank">委托协议</a> <a href="/loanagreement&1&'+data.data.order.DelId+'"  target="_blank">质押协议</a></li><li><label>抵押担保：</label><a href="javascript:void(0);" data="'+data.data.item.Img+'" class="lookbill"> 查看 </a></li><li class="pledge"></li><li>&nbsp;</li></ul>'
								);	
						}
	
					}
					hcuserScript.pop('.pop','.black','.close');
					$('.lookbill').click(function(){
						var pic = $(this).attr('data');
						$(this).parent().next('.pledge').html('<img style="width:100%" src="http://'+pic+'">');
					});
				},
				error : function(data){
					console.log(data);
					return false;
				}
			});

			
		});
}
function transferData(now){
		var pageIndex = 0;     //页面索引初始值   
		var pageSize  = 20;    //每页显示条数初始化，修改显示条数，修改这里即可
	if(now == 1){var state = 3;}else if(now == 2){var state = 4;}else{var state = 0}
	$.ajax({
		url: "/usertransfer",
		type: "POST",
		dataType: "json",
		data : { 'pageSize' : pageSize, 'pageIndex' : pageIndex, 'state' : state}, 
		success: function(data) {
			if (data.statusCode == 0) {
				var pcount = data.data.rows;
				
				transferList(now, pcount);
			}
		}
	})
}

function transferList(now, pcount){
	var pcount = pcount;
	//console.log(pcount);
	//分页数据
	$.get(hcUrl+'scripts/lib/jquery.pagination.js', function(result){

		var pageIndex = 0;     //页面索引初始值   
		var pageSize  = 20;    //每页显示条数初始化，修改显示条数，修改这里即可

		$(function(){
			//InitTable(0);    //Load事件，初始化表格数据，页面索引为0（第一页）

			//分页，PageCount是总条目数，这是必选参数，其它参数都是可选
			$("#pagination").pagination(pcount, {
				callback: PageCallback,  //PageCallback() 为翻页调用次函数。
				prev_text: "上一页",
				next_text: "下一页",
				items_per_page:pageSize,
				num_edge_entries: 2,       //两侧首尾分页条目数
				num_display_entries: 6,    //连续分页主体部分分页条目数
				current_page: pageIndex,   //当前页索引
			});
			//翻页调用   
			function PageCallback(index, jq) {             
			    InitTable(index);  
			}  
			//请求数据   
			function InitTable(pageIndex) {

				var pageIndex = (pageIndex * pageSize);
				if(now == 1){var state = 3;}else if(now == 2){var state = 4;}else{var state = 0}				

				/*
				 * pageSize : 条数  pageIndex : 指针  hcType : 类型  hcAmount : 金额  hcCycle : 周期  hcRates : 利率
				 */                                 
			    $.ajax({
			    	url : '/usertransfer',   
			        type : 'POST',  
			        dataType : 'json',
			        //提交两个参数：pageIndex(页面索引)，pageSize(显示条数) 
			        data : { 'pageSize' : pageSize, 'pageIndex' : pageIndex, 'state' : state},                  
			        success : function(data) {
			        	
			        	if(data.statusCode != 0){
			        		$('.tbody').empty();
			        		$('.tbody').append('<p>暂无相关记录！</p>');
			        	}else{
				        	$('.param> tbody').empty();
				        	if(data.data.list.length === 0){
				        		$('.tbody').eq(now).empty().append('<p>暂无相关记录！</p>');
				        		return false;
				        	}else{
				        		
				        		if(now == 0){
					        		$('.tbody').eq(0).empty();
					        		pcount = data.data.rows;
						        	$(data.data.list).each(function(i, o){
						        		var os = parseInt(o.Switch);
						        		var st = parseInt(o.State);
						        		if(os == 1){var sw = '<button data="'+o.DelId+'" class="hc-sale">转让中</button>';}if(os == 2){var sw = '<button data="'+o.DelId+'" class="hc-end">已转</button>';}if(os == 3){var sw='<button data="'+o.DelId+'" class="hc-end transfer">过期</button>';}if(os == 0){var sw='<button data="'+o.DelId+'" class="hc-buy transfer">转让</button>';}
						        		var type = o.ItemType;if(type==0){var type_a = '活动'}else{var type_a = '<a href="javascript:;" class="mybill">查看</a>';}
						        		if(st == 4){var sw='<button class="hc-end">结束</button>';var type_a = '<a href="javascript:;">已还款</a>';}
						        		if(type == 0){var sw=' ';}
						        		$('.tbody').eq(0).append('<tr><td>'+o.Code+'<br/>下单时间：'+o.UpTime+'<br/>到期时间：'+o.EndDate+'</td><td>'+o.ItemType_a+'</td><td>￥<font class="orange">'+o.Money+'</font></td><td>￥<font class="blue">'+o.Interest+'</font></td><td>￥<font class="orange">'+o.OrMoney+'</font></td><td>￥<font class="blue">'+o.OrInterest+'</font></td><td>'+o.OrCycle+'天</td><td>'+o.State_a+'</td><td>'+type_a+'</td><td>'+sw+'</td></tr>');	
						        	});
				        		}
				        		if(now == 1){
				        			
				        			$('.tbody').eq(1).empty();
				        			pcount = data.data.rows;
						        	$(data.data.list).each(function(i, o){
						        		
						        		var os = parseInt(o.Switch);
						        		var st = parseInt(o.State);
						        		var type = o.ItemType;if(type==0){var type_a = '活动'}else{var type_a = '<a href="javascript:;" class="mybill">查看</a>';}
					        			if(os == 1){var sw = '<button data="'+o.DelId+'" class="hc-sale">转让中</button>';}if(os == 2){var sw = '<button data="'+o.DelId+'" class="hc-end">已转</button>';}if(os == 3){var sw='<button data="'+o.DelId+'" class="hc-end transfer">过期</button>';}if(os == 0){var sw='<button data="'+o.DelId+'" class="hc-buy transfer">转让</button>';}
						        		if(type == 0){var sw=' ';}
						        		if(st == 3){
						        			$('.tbody').eq(now).append('<tr><td>'+o.Code+'<br/>下单时间：'+o.UpTime+'<br/>到期时间：'+o.EndDate+'</td><td>'+o.ItemType_a+'</td><td>￥<font class="orange">'+o.Money+'</font></td><td>￥<font class="blue">'+o.Interest+'</font></td><td>￥<font class="orange">'+o.OrMoney+'</font></td><td>￥<font class="blue">'+o.OrInterest+'</font></td><td>'+o.OrCycle+'天</td><td>'+o.State_a+'</td><td>'+type_a+'</td><td>'+sw+'</td></tr>');
						        		}
						        		
						        	});
				        		}
				        		if(now == 2){
									pcount = data.data.rows;
				        			$('.tbody').eq(2).empty();
						        	$(data.data.list).each(function(i, o){
						        		//console.log(i,o.State);
										//var state = o.State;if(state == 3){state = '在投';}if(state == 4){var state ='已还';}
						        		var os = parseInt(o.Switch);
						        		var st = parseInt(o.State);
						        		var type = o.ItemType;if(type==0){var type_a = '活动'}else{var type_a = '<a href="javascript:;" class="mybill">查看</a>';}
						        		if(os == 1){var sw = '<button data="'+o.DelId+'" class="hc-sale">转让中</button>';}if(os == 2){var sw = '<button data="'+o.DelId+'" class="hc-end">已转</button>';}if(os == 3){var sw='<button data="'+o.DelId+'" class="hc-end transfer">过期</button>';}if(os == 0){var sw='<button data="'+o.DelId+'" class="hc-buy transfer">转让</button>';}
						        		if(st == 4){var sw='<button class="hc-end">结束</button>';var type_a = '<a href="javascript:;">已还款</a>';}
						        		if(type == 0){var sw=' ';}
						        		if(st == 4){
						        			$('.tbody').eq(now).append('<tr><td>'+o.Code+'<br/>下单时间：'+o.UpTime+'<br/>到期时间：'+o.EndDate+'</td><td>'+o.ItemType_a+'</td><td>￥<font class="orange">'+o.Money+'</font></td><td>￥<font class="blue">'+o.Interest+'</font></td><td>￥<font class="orange">'+o.OrMoney+'</font></td><td>￥<font class="blue">'+o.OrInterest+'</font></td><td>'+o.OrCycle+'天</td><td>'+o.State_a+'</td><td>'+type_a+'</td><td><button class="hc-end">结束</button></td></tr>');
						        		}
						        	});
				        		}
				        		if(now == 3){
				        			$('.tbody').eq(now).empty().append('<tr><td colspan ="8"><p>！</p></td></tr>');
									//$('#pagination').empty();
				        		}
				        		transfer();
				        	}
			        	}
			        }  
			    });	  
			}
		});
	});
}
transferData(now);

function totransfer(){
	//transfer sure
	$('#totransfer').on('click',function(evt){
		
		var orderDelId = $(this).attr('data');
		var swMoney = $('#swmoney').val();
		var payment = $('#payment').val();

		if(swMoney >500 || swMoney <0 || isNaN(swMoney)){
			$(this).html('补贴收益金额限制');
			return false;
		}
		if(orderDelId == '' || orderDelId == undefined||orderDelId==null){
			$(this).html('转让编码错误');
			return false;
		}
		if(payment == ''||payment==null){
			$(this).html('输入交易密码');
			return false;
		}
		evt.preventDefault();
		$('#totransfer').html('<img src="images/common/verfy.gif" style="margin:0 auto;display:block;">');
		$.ajax({
			url : '/suretransfer',
			type : 'POST',
			dataType : 'json',
			data: {'orderDelId' : orderDelId, 'swMoney' : swMoney, 'payment' : payment},
			success : function(data){
				if(data.statusCode != 0){
					$('#totransfer').html(data.message);
				}else{
					$('#payment').val('');
					$('#user-pay').hide();
					$('#pop-contact').html('<strong class="success"><i></i>转让成功！</strong>');
					setTimeout(function(){
						window.location.href='/user-invest';
					},1000);
					return false;
				}	
			},
			error : function(data){
				console.log(data);
				return false;
			}
		})
	});	
}

$('#tranrule').click(function(){
	$('.pop dt').html('债权转让规则：');
	$('#pop-contact').html(
		'<p style="padding:20px 30px;line-height:28px;">1、标明可转让的产品才能使用债权转让功能。<br/>'
		+'2、债权转让适用于投资已满7日的订单。在该订单到期前6日仍未完成的债权转让，平台将自动终止。<br/>'
		+'3、债权出让者按约定利率出让该债权。债权受让者享有成交日起至该债权到期日双方约定利率的收益。<br/>'
		+'4、债权转让双方成交即表示同意约定利率，超出产品利率部分由出让方原收益或本金中扣除，到期后支付给受让方。<br/>'
		+'5、低于产品利率部分由受让方到期收益中扣除，支付给出让方。（目前暂不支持低于产品利率转让,敬请谅解）<br/>'
		+'6、债权出让者享有债权转让成交当日之前收益（不含成交当日），债权受让者享有债权转让当日之后（含成交当日）收益。<br/>'
		+'7、债权转让的订单只能转让一次，且不可拆分。<br/>'
		+'8、债权转让收取出让方转让金额0.3%的手续费（最低1元/笔）。<br/><br/>'
		+'客服热线：4000-267-555</p>'
	);
	hcuserScript.pop('.pop','.black','.close');
});


