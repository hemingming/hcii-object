
/*
 * 数据参数
 */
function fundData(pcount, pageSize, pageIndex, fundurl, fund){
		var pageIndex = 0;     //页面索引初始值   
		var pageSize  = 20;    //每页显示条数初始化，修改显示条数，修改这里即可
		var pcount = pcount;
	//分页数据
	$.get(hcUrl+'scripts/lib/jquery.pagination.js', function(result){


		

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
			    $.ajax({
			    	url : '/loadfund',   
			        type : 'POST',  
			        dataType : 'json',
			        //提交两个参数：pageIndex(页面索引)，pageSize(显示条数) 
			        data : { 'pageSize' : pageSize, 'pageIndex' : pageIndex, 'url' : fundurl},                  
			        success : function(data) {
			        	pcount = data.data.rows;
			        	$('.tfund').eq(fund).empty();
			        	if(fund == 0){
				        	$(data.data.list).each(function(i, o){
				        		var type = o.Type;
				        		var bol = '+';
				        		if(type == 11){var bol = '-';}if(type == 20){var bol = '-';}if(type == 21){var bol = '-';}if(type == 30){var bol = '-';}if(type == 34){var bol = '-';}if(type == 50){var bol = '-';}
				        		$('.tfund').eq(fund).append('<tr><td>￥<font class="blue">'+bol+' '+o.Money+'</font></td><td>'+o.Explain+'</td><td>'+o.UpTime+'</td><td>￥<font class="orange">'+o.Fund+'</font></td></tr>');
				        	});
			        	}
			        	if(fund == 1){
			        		if(data.data.list.length==0){$('.tfund').eq(fund).empty().append('<p>暂无相关记录！</p>');}
				        	$(data.data.list).each(function(i, o){
				        		$('.tfund').eq(fund).append('<tr><td>'+o.Name+'</td><td>'+o.Copies+' 份</td><td>￥<font class="orange">'+o.Money+'</font></td><td>￥<font class="blue">'+o.Interest+'</font></td><td>'+o.State_a+'</td><td>'+o.Type_a+'</td><td>'+o.EndDate+'</td></tr>');
				        	});
			        	}
			        	if(fund == 2){
			        		if(data.data.list.length==0){$('.tfund').eq(fund).empty().append('<p>暂无相关记录！</p>');}
				        	$(data.data.list).each(function(i, o){
				        		var state = o.State;if(state == 1){state = '成功';}else{state = o.State;}
				        		$('.tfund').eq(fund).append('<tr><td>￥<font class="orange">'+o.Money+'</font></td><td>￥<font class="blue">'+o.Fee+'</font></td><td>'+state+'</td><td>'+o.UpTime+'</td></tr>');
				        	});
			        	}
			        	if(fund == 3){
			        		if(data.data.list.length==0){$('.tfund').eq(fund).empty().append('<p>暂无相关记录！</p>');}
				        	$(data.data.list).each(function(i, o){
				        		
				        		$('.tfund').eq(fund).append('<tr><td>'+o.Card+'</td><td>'+o.Money+'</td><td>'+o.Fee+'</td><td>'+o.State_a+'</td><td>'+o.UpTime+'</td><td>'+o.Type_a+'</td></tr>');
				        	});
			        	}
			        	if(fund == 4){
			        		if(data.data.list.length==0){$('.tfund').eq(fund).empty().append('<p>暂无相关记录！</p>');}
				        	$(data.data.list).each(function(i, o){
				        		var state = o.State;if(state == 1){state = '成功';}else{state = o.State;}
				        		$('.tfund').eq(fund).append('<tr><td>￥<font class="orange">'+o.Money+'</font></td><td>'+state+'</td><td>'+o.Explain+'</td><td>'+o.UpTime+'</td></tr>');
				        	});
			        	}
			        	if(fund == 5){
			        		if(data.data.list.length==0){$('.tfund').eq(fund).empty().append('<p>暂无相关记录！</p>');}
				        	$(data.data.list).each(function(i, o){
				        		var state = o.State;if(state == 1){state = '成功';}else{state = o.State;}
				        		$('.tfund').eq(fund).append('<tr><td>￥<font class="orange">'+o.Money+'</font></td><td>'+state+'</td><td>'+o.Type_a+'</td><td>'+o.UpTime+'</td></tr>');
				        	});
			        	}

			        }  
			    });
			    
			    
			}
		});
	});	
}



