var captchapng = require('captchapng');

exports.captcha = function(req, res){

        var number = parseInt(Math.random()*9000+1000);
        if(req.query.nocache === undefined){
            res.cookie('hc_cookie_verify', number, { httpOnly: true, signed: true, maxAge: 60*5000 });
        }else{
            res.cookie('hc_cookie_verify', number, { httpOnly: true, signed: true, maxAge: 60*5000 });
            res.location('/captcha');
        }
        
        var p = new captchapng(74,40,number); // width,height,numeric captcha 
        p.color(248, 248, 248, 255);  // First color: background (R, G, B, alpha) 
        p.color(249, 151, 50, 255); // Second color: paint (R, G, B, alpha) 
        var img = p.getBase64();
        var imgbase64 = new Buffer(img,'base64',number);
        res.writeHead(200, {
            'Content-Type': 'image/png'
        });
        
        res.end(imgbase64);
       
        
};