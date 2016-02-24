var hcType = 0;
var hcAmount = 0;
var hcCycle = 0;
var hcRates = 0;
$("#sub-nav li a").click(function() {
	$("#tranbox").html('<img src="images/common/load.gif" id="pageload">');
	$("#sub-nav li a").removeClass("on");
	$(this).removeClass("on").addClass("on");
	var para = $(this).text();
	if (para === "不限") {
		hcRates = 0
	}
	if (para === "9%以下") {
		hcRates = "1-8"
	}
	if (para === "9-10%") {
		hcRates = "9-10"
	}
	if (para === "10-11%") {
		hcRates = "10-11"
	}
	if (para === "11-12%") {
		hcRates = "11-12"
	}
	if (para === "12%以上") {
		hcRates = "12-30"
	}
	proData(hcCycle, hcRates)
});

function proData(hcCycle, hcRates) {
	$.get(hcUrl + "scripts/lib/jquery.pagination.js", function(result) {
		hcCycle === undefined ? hcCycle = 0 : hcCycle = hcCycle;
		hcRates === undefined ? hcRates = 0 : hcRates = hcRates;
		var pageIndex = 0;
		var pageSize = 8;
		var pcount = $("#pagecount").val();
		$(function() {
			$("#pagination").pagination(pcount, {
				callback: PageCallback,
				prev_text: "上一页",
				next_text: "下一页",
				items_per_page: pageSize,
				num_edge_entries: 2,
				num_display_entries: 6,
				current_page: pageIndex,
			});

			function PageCallback(index, jq) {
				InitTable(index)
			}
			function InitTable(pageIndex) {
				var pageIndex = (pageIndex * pageSize);
				$.ajax({
					url: "/loadtransfer",
					type: "POST",
					dataType: "json",
					data: {
						"pageSize": pageSize,
						"pageIndex": pageIndex,
						"hcCycle": hcCycle,
						"hcRates": hcRates
					},
					success: function(data) {
						if (data.statusCode != 0) {
							$("#tranbox").empty();
							$("#tranbox").append('<p class="on">暂无您选择的产品，老板请稍等！</p>')
						} else {
							$("#tranbox").empty();
							if (data.data.list.length === 0) {
								$("#tranbox").append('<p class="on">暂无您选择的产品，看看其他产品吧！</p>');
								return false
							} else {
								pcount = data.data.rows;
								$(data.data.list).each(function(i, o) {
									var inter = (Number(o.Interest) + Number(o.SwMoney)).toFixed(2);
									$("#tranbox").append('<dl><dt><em class="hcuser head-t-' + o.UserPicId + '"></em><p><b>' + o.UserName.substr(0,3) + '******** </b></p></dt><a data="' + o.DelId + '" href="javascript:void(0);" class="transfer-buy"><dd><span class="tip"><strong>' + o.Name + " " + o.Number + '期</strong><p><i class="orange">' + o.Money + "</i> 元</p></span><span><b>" + o.SwCycle + "</b>天</span><span><p><b>" + o.Rates + "</b>%</p><p>" + o.Interest + '元</p></span><span><p><b class="blue">' + o.SwRates + "</b>%</p><p>" + inter + '元</p></span><button class="hc-buy">购买</button></dd></a></dl>')
								});
								$("#tranrank").empty();
								$("#tranrank").append("<dt><em>排名</em><em>用户</em><em>成交金额</em></dt>");
								$(data.data.ranking).each(function(i, o) {
									var rank = i + 1;
									$("#tranrank").append('<dd><i class="hcuser rank-' + rank + '"></i><b>' + rank + "</b><span>" + o.MobileCode + "</span><span>" + o.Amount + "</span></dd>")
								});
								$(".transfer-buy").on("click", function(evt) {
									evt.preventDefault();
									var itemid = $(this).attr("data");
									if (itemid == "" || itemid == null) {
										window.reload()
									} else {
										$.ajax({
											url: "/transferid",
											type: "POST",
											dataType: "json",
											data: {
												"itemdelid": itemid
											},
											success: function(data) {
												if (data == -999) {
													window.location.href = "/login?transfer";
													return false
												} else {
													$("#pop-trans").html('<ul class="line"><li><span>产品名称：</span><em>' + data.data.item.Name + '</em></li><li><span>投资金额：</span><em><b class="amount f-t">' + data.data.order.Money + ' </b> 元</em> </li><li><span>预期收益：</span><em><b class="profit f-t">' + data.data.order.OrInterest + "</b> 元</em></li><li><span>下单时间：</span><em>" + data.data.order.OrderTime + "</em></li><li><span>订单编号：</span><em>" + data.data.order.Code + "</em></li></ul>" + "<ul><li><span>账户姓名：</span><em>" + data.data.user.Name + "</em></li><li><span>身份证号：</span><em>" + data.data.user.IdCard + " </em> </li><li><span>手机号码：</span><em>" + data.data.user.Moblie + "</em></li><li><span>账户积分：</span><em>" + data.data.assets.Integral + "+" + parseInt(data.data.order.SwMoney) + "</em></li><li><span>账户余额：</span><em>" + data.data.assets.fund + "元</em></li><li><span>收益宝余额：</span><em>" + data.data.assets.vault + '元</em></li><li><span>交易密码：</span><em><input type="password" name="pay" class="pay" id="tranpass"> <a href="/user-safety?transfer" target="_blank">忘记交易密码？</a></em></li></ul><ul><li><span>&nbsp;</span><em><button type="button" id="transfer-pay" data="' + data.data.form.OrderDelId + '">确认支付</button></em></li></ul>');
													tranpay();
													hcScript.pop(".pop", ".black", ".close");
													return false
												}
											}
										})
									}
								})
							}
						}
					}
				})
			}
		})
	})
}
proData();

function tranpay() {
	$("#transfer-pay").on("click", function(evt) {
		var payment = $("#tranpass").val();
		var order = $(this).attr("data");
		if (payment == "" || payment == null) {
			$(this).html("输入交易密码");
			return false
		}
		if (order == "" || order == undefined || order == null) {
			$(this).html("转让编码错误");
			return false
		}
		evt.preventDefault();
		$("#transfer-pay").html('<img src="images/common/verfy.gif" style="margin:0 auto;display:block;">');
		$.ajax({
			url: "/transferpay",
			type: "POST",
			dataType: "json",
			data: {
				"orderdelid": order,
				"payment": payment
			},
			success: function(data) {
				if (data == -999) {
					window.location.href = "/login?transfer";
					return false
				} else {
					if (data.statusCode != 0) {
						if (data.statusCode == 18.3) {
							$("#transfer-pay").css({
								"background": "#aeaeae",
								"color": "#fff",
								"border": "1px solid #9e9e9e"
							}).html("已被认购")
						} else {
							$("#transfer-pay").html(data.message)
						}
					} else {
						$("#transfer-pay").hide();
						$("#pop-trans").html('<strong class="success"><i></i>购买成功！</strong>');
						setTimeout(function() {
							window.location.href = "/user-invest"
						}, 1000);
						return false
					}
				}
			}
		})
	})
};