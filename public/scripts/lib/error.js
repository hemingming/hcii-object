/*
 * 错误信息调用
 */


 var errorScript = {
 	open : true,
 	error : function(){
 		var that = this;
 			var url = window.parent.location.search.indexOf('?error');
 			if(url !== -1){
 				$('#serror').show();	
 			}else{
 				that.open = false;
 			}
 	}
 }