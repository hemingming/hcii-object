require.config({
	baseUrl: "scripts/lib",

	shim: {
		'user' : ['jquery'],
		'user' : ['jquery-ui'],
		'user' : ['raphael'],
		'user' : ['switchs'],
		'switchs': {
		　　　　　　deps: ['jquery'],
		　　　　　　exports: 'jQuery.fn.lc_switch'
		　　　　}
	},

	paths: {
		'jquery'   : 'jquery-1.8.3.min',
		'jquery-ui': 'jquery-ui.min',
		'switchs'  : 'jquery-switch',
		'raphael'  : 'raphael',
		'user'     : 'hc-user'
	}
});



require(['jquery', 'jquery-ui', 'switchs', 'raphael', 'user'],function($,jqueryui,raphael,switchs,user){
	$(function(){
		hcuserScript.init();
		/*
        $.ajax({
            url : '/scriptevent',
            type : 'POST',
            dataType : 'json',
            data : {'interfacekey' : 'huachengjinrong'},
            success : function(data){
                if(data===0){
                    
                }else{
                    //window.location.href='http://www.hcii.cn/';
                }
            },
            error : function(data){
                //window.location.href='http://www.hcii.cn/';
            }

        });
		*/		
	})

});






