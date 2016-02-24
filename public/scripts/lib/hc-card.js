/*
 * 用户中心卡券
 */

/*
 * 数据参数
 */
var card = $('#usercard li.on').index();

$('#usercard li').click(function(){

	var card = $('#usercard li.on').index();
	$('.usercard').eq(0).html('<img src="images/common/load.gif" id="pageload">');
	usercard(card);
});


function usercard(card){
	//分页数据
	$.get(hcUrl+'scripts/lib/jquery.pagination.js', function(result){

		var pageIndex = 0;     //页面索引初始值   
		var pageSize  = 20;    //每页显示条数初始化，修改显示条数，修改这里即可
		var pcount = 20;

		if(card == 0){var state = 1;}if(card == 1){var state = 2;}if(card == 2){var state = 3;}
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

				/*
				 * pageSize : 条数  pageIndex : 指针  hcType : 类型  hcAmount : 金额  hcCycle : 周期  hcRates : 利率
				 */                                 
			    $.ajax({
			    	url : '/usercard',   
			        type : 'POST',  
			        dataType : 'json',
			        //提交两个参数：pageIndex(页面索引)，pageSize(显示条数) 
			        data : { 'pageSize' : pageSize, 'pageIndex' : pageIndex, 'state' : state },                  
			        success : function(data) {
			        	console.log(data);
			        	if(data.statusCode != 0){
			        		$('.usercard').empty();
			        		$('.usercard').append('<p>暂无相关记录！</p>');
			        	}else{
				        	$('.usercard').empty();
				        	pcount = data.data.rows;
				        	//console.log(data.data.rows);
				        	if(pcount == 0){
				        		$('.usercard').eq(card).empty().append('<p>暂无相关记录！</p>');
				        		return false;
				        	}else{
				        		if(card == 0){
					        		$('.usercard').eq(0).empty();
						        	$.each(data.data.list, function(i, o) {
                    					if(o.Type == 1 || o.Type == 5){var uit = '%';}if(o.Type == 2 || o.Type == 3){var uit = '元';}if(o.Type == 4){var uit = '天';}
						        		$('.usercard').eq(0).append('<dl class="card-on"><dt><p><strong>'+o.Factor+'&nbsp;'+uit+'</strong></p><p>有效期至'+o.EndTime+'</p></dt><dd><a title="'+o.Brief+'">'+o.Name+'</a></dd></dl>');
						        	});
				        		}
				        		if(card == 1){
				        			$('.usercard').eq(1).empty();
						        	$.each(data.data.list, function(i, o) {
                    					if(o.Type == 1 || o.Type == 5){var uit = '%';}if(o.Type == 2 || o.Type == 3){var uit = '元';}if(o.Type == 4){var uit = '天';}
						        		$('.usercard').eq(1).append('<dl class="card-off"><dt><p><strong>'+o.Factor+'&nbsp;'+uit+'</strong></p><p>有效期至'+o.EndTime+'</p></dt><dd><a title="'+o.Brief+'">'+o.Name+'</a></dd></dl>');
						        	});
				        		}
				        		if(card == 2){

				        			$('.usercard').eq(2).empty();
						        	$.each(data.data.list, function(i, o) {
                    					if(o.Type == 1 || o.Type == 5){var uit = '%';}if(o.Type == 2 || o.Type == 3){var uit = '元';}if(o.Type == 4){var uit = '天';}
						        		$('.usercard').eq(2).append('<dl class="card-off"><dt><p><strong>'+o.Factor+'&nbsp;'+uit+'</strong></p><p>有效期至'+o.EndTime+'</p></dt><dd><a title="'+o.Brief+'">'+o.Name+'</a></dd></dl>');
						        	});
				        		}

				        	}
			        	}
			        }  
			    });	  
			}
		});
	});
}

usercard(card);






