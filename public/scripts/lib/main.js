
require.config({
	baseUrl: "scripts/lib",

	shim: {
		'swiper'  : ['jquery'],
		'common'  : ['jquery']
	},

	paths: {
		'jquery'  : 'jquery-1.8.3.min',
		'swiper'  : 'swiper.min',
		'progressbar': 'progressbar.min',	
		'common'  : 'hc-common'
	}
});



require(['jquery','swiper','common'],function($, swiper, common){
    $(function(){
        hcScript.init();
        /*
        $.ajax({
            url : '/scriptevent',
            type : 'POST',
            dataType : 'json',
            data : {'interfacekey' : 'huachengjinrong'},
            success : function(data){
                if(data===0){
                    
                }else{
                    window.location.href='http://www.hcii.cn/';
                }
            },
            error : function(data){
                window.location.href='http://www.hcii.cn/';
            }

        });
        */
    });

});



define(['jquery','progressbar'], function($, ProgressBar) {
	if($('#progress').length){
        var circle = new ProgressBar.Circle('#progress', {
            color: '#ff674b',
            strokeWidth: 5,
            trailWidth: 5,
            duration: 1500,
            text: {
                value: '100'
            },
            step: function(state, bar) {
                bar.setText((bar.value() * 100).toFixed(0)+'%');
            }
        });
        var number = $('#progress i').text();
        circle.animate(number / 100);
    }

});



