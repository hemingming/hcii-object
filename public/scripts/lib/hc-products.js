/*! products Script author : Ming*/
var hcType = 0;
var hcAmount = 0;
var hcCycle = 0;
var hcRates = 0;
var pageSize = 10;
var pageIndex = 0;
$(".choice dd a").click(function() {
	$("#products").html('<img src="http://www.hcii.cn/images/common/load.gif" id="pageload">');
	$(this).parent().children("a").removeClass("on");
	$(this).removeClass("on").addClass("on");
	var para = [];
	for (var i = 0; i < 8; i += 1) {
		para.push($(".choice dd").eq(i).children("a.on").index())
	}
	if (para[0] === 0) {
		hcType = 0
	}
	if (para[0] === 1) {
		hcType = 1
	}
	if (para[0] === 2) {
		hcType = 2
	}
	if (para[0] === 3) {
		hcType = 3
	}
	if (para[0] === 4) {
		hcType = 4
	}
	if (para[1] === 0) {
		hcAmount = 0
	}
	if (para[1] === 1) {
		hcAmount = "1000-10000"
	}
	if (para[1] === 2) {
		hcAmount = "10000-50000"
	}
	if (para[1] === 3) {
		hcAmount = "50000-100000"
	}
	if (para[1] === 4) {
		hcAmount = "100000-500000"
	}
	if (para[1] === 5) {
		hcAmount = "500000-99999999"
	}
	if (para[2] === 0) {
		hcCycle = 0
	}
	if (para[2] === 1) {
		hcCycle = "0-30"
	}
	if (para[2] === 2) {
		hcCycle = "30-90"
	}
	if (para[2] === 3) {
		hcCycle = "90-180"
	}
	if (para[2] === 4) {
		hcCycle = "180-365"
	}
	if (para[2] === 5) {
		hcCycle = "365-1095"
	}
	if (para[3] === 0) {
		hcRates = 0
	}
	if (para[3] === 1) {
		hcRates = "1-8"
	}
	if (para[3] === 2) {
		hcRates = "8-9"
	}
	if (para[3] === 3) {
		hcRates = "9-10"
	}
	if (para[3] === 4) {
		hcRates = "10-11"
	}
	if (para[3] === 5) {
		hcRates = "11-12"
	}
	if (para[3] === 6) {
		hcRates = "12-30"
	}
	$.ajax({
		url: "/loadproducts",
		type: "POST",
		dataType: "json",
		data: {
			"pageSize": pageSize,
			"pageIndex": pageIndex,
			"hcType": hcType,
			"hcAmount": hcAmount,
			"hcCycle": hcCycle,
			"hcRates": hcRates
		},
		success: function(data) {
			if (data.statusCode == 0) {
				var pcount = data.data.rows;
				prolist(pcount, hcType, hcAmount, hcCycle, hcRates)
			}
		}
	})
});

function prolist(pcount, hcType, hcAmount, hcCycle, hcRates) {
	var pcount = pcount;
	$.get(hcUrl + "scripts/lib/jquery.pagination.js", function(result) {
		hcType === undefined ? hcType = 0 : hcType = hcType;
		hcAmount === undefined ? hcAmount = 0 : hcAmount = hcAmount;
		hcCycle === undefined ? hcCycle = 0 : hcCycle = hcCycle;
		hcRates === undefined ? hcRates = 0 : hcRates = hcRates;
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
					url: "/loadproducts",
					type: "POST",
					dataType: "json",
					data: {
						"pageSize": pageSize,
						"pageIndex": pageIndex,
						"hcType": hcType,
						"hcAmount": hcAmount,
						"hcCycle": hcCycle,
						"hcRates": hcRates
					},
					success: function(data) {
						if (data.statusCode != 0) {
							$("#products").html("");
							$("#products").append('<p class="no">暂无您选择的产品，老板请稍等！</p>')
						} else {
							$("#products").html("");
							if (data.data.list.length === 0) {
								$("#products").append('<p class="no">暂无您选择的产品，看看其他产品吧！</p>');
								return false
							} else {
								pcount = data.data.rows;
								$(data.data.list).each(function(i, o) {
									if (o.label == 0) {
										var label = ""
									}
									if (o.label == 1) {
										var label = "名企专场"
									}
									if (o.label == 2) {
										var label = "新人专享"
									}
									if (o.label == 3) {
										var label = "夜间专享"
									}
									if (o.label == 4) {
										var label = "贵宾预约"
									}
									if (o.label == 5) {
										var label = "微粉专享"
									}
									if (o.label == undefined) {
										var label = ""
									}
									if (o.State == 1) {
										var button = '<button class="hc-sale">即将开售</button>';
										var rate = o.Rates;if(rate > 15){var rate = rate/2 +'+'+ rate/2;}
										var dmoney = o.OnCard_a;if(dmoney==''){var dmoney_a= '';}else{var dmoney_a='('+dmoney+')';}
										if(o.Type == 0){o.Number=''}else{o.Number=o.Number+'期'}
										$("#products").append('<dd><a href="/detail?product&' + o.DelId + "&Id=" + o.Cycle + "&Surplus=" + o.Surplus + "&Type=" + o.Type + '&web=HCIICN.html"><strong>' + rate + "<i> %</i></strong><em><b>" + o.Cycle + "</b> 天</em><em>" + o.Name + "<i> " + o.Number + ' </i> <i>'+dmoney_a+'</i> <i style="color:#ff674b;">' + label + "</i></em><em>" + o.MinSingle + '元起</em><em class="surplus"><b style="width:' + o.Percent + '%;"></b><span>' + parseInt(o.Surplus) + ' 份</span></em><i class="percent">' + o.Percent + "%</i>" + button + "</a></dd>")
									}
									if (o.State == 2) {
										if(o.Type == 0){o.Number=''}else{o.Number=o.Number+'期'}
										var button = '<button class="hc-buy">立即加入</button>';
										var dmoney = o.OnCard_a;if(dmoney==''){var dmoney_a= '';}else{var dmoney_a='('+dmoney+')';}
										var rate = o.Rates;if(rate > 15){var rate = rate/2 +'+'+ rate/2;}
										$("#products").append('<dd><a href="/detail?product&' + o.DelId + "&Id=" + o.Cycle + "&Surplus=" + o.Surplus + "&Type=" + o.Type + '&web=HCIICN.html"><strong>' + rate + "<i> %</i></strong><em><b>" + o.Cycle + "</b> 天</em><em>" + o.Name + "<i> " + o.Number + ' </i> <i>'+dmoney_a+'</i> <i style="color:#ff674b;">' + label + "</i></em><em>" + o.MinSingle + '元起</em><em class="surplus"><b style="width:' + o.Percent + '%;"></b><span>' + parseInt(o.Surplus) + ' 份</span></em><i class="percent">' + o.Percent + "%</i>" + button + "</a></dd>")
									}
								});
								$(data.data.list).each(function(i, o) {
									if (o.label == 0) {
										var label = ""
									}
									if (o.label == 1) {
										var label = "名企专场"
									}
									if (o.label == 2) {
										var label = "新人专享"
									}
									if (o.label == 3) {
										var label = "夜间专享"
									}
									if (o.label == 4) {
										var label = "贵宾预约"
									}
									if (o.label == 5) {
										var label = "微粉专享"
									}
									if (o.label == undefined) {
										var label = ""
									}
									if (o.State == 3) {
										if(o.Type == 0){o.Number=''}else{o.Number=o.Number+'期'}
										var button = '<button class="hc-work">已起息</button>';
										var rate = o.Rates;if(rate > 15){var rate = rate/2 +'+'+ rate/2;}
										var dmoney = o.OnCard_a;if(dmoney==''||dmoney == undefined){var dmoney_a= '';}else{var dmoney_a='('+dmoney[0]+')';}
										$("#products").append('<dd><a href="/detail?product&' + o.DelId + "&Id=" + o.Cycle + "&Surplus=" + o.Surplus + "&Type=" + o.Type + '&web=HCIICN.html"><strong>' + rate + "<i> %</i></strong><em><b>" + o.Cycle + "</b> 天</em><em>" + o.Name + "<i> " + o.Number + ' </i> <i>'+dmoney_a+'</i> <i style="color:#ff674b;">' + label + "</i></em><em>" + o.MinSingle + '元起</em><em class="surplus"><b style="width:' + o.Percent + '%;"></b><span></span></em><i class="percent">' + o.Percent + "%</i>" + button + "</a></dd>")
									}
									if (o.State == 4) {
										if(o.Type == 0){o.Number=''}else{o.Number=o.Number+'期'}
										var rate = o.Rates;if(rate > 15){var rate = rate/2 +'+'+ rate/2;}
										var button = '<button class="hc-end">已还款</button>';
										var dmoney = o.OnCard_a;if(dmoney==''||dmoney == undefined){var dmoney_a= '';}else{var dmoney_a='('+dmoney+')';}
										$("#products").append('<dd><a href="javascript:void(0);" style="cursor:not-allowed;"><strong>' + rate + "<i> %</i></strong><em><b>" + o.Cycle + "</b> 天</em><em>" + o.Name + "<i> " + o.Number + ' </i> <i>'+dmoney_a+'</i> <i style="color:#ff674b;">' + label + "</i></em><em>" + o.MinSingle + '元起</em><em class="surplus"><b style="width:' + o.Percent + '%;"></b><span></span></em><i class="percent">' + o.Percent + "%</i>" + button + "</a></dd>")
									}
								})
							}
						}
					}
				})
			}
		})
	})
};