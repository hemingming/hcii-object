/*
 * www.hcii.cn @author:Ming
 */
var http = require('http'),
	https = require('https'),
	express = require('express'),
	request = require('request'),
	fs = require('fs'),
    voucher = require('./voucher/voucher.js');

var app = express();
//var router = express.Router();

//handlebars视图引擎
var handlebars = require('express3-handlebars').create({ 
	defaultLayout : 'main' ,
	helpers : {
		section : function(name, options){
			if(!this._sections) this._sections = {};
			this._sections[name] = options.fn(this);
			return null;
		},
		static : function(name){
			return require('./lib/static.js').map(name);
		}
	}
    //,extname : '.hc'
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
//app.set('view cache', true);//开启缓存


//端口
app.set('port', process.env.PORT || 3000);

//日志
//app.use(require('morgan')('dev')); //dev
app.use(require('express-logger')({ path: __dirname + '/log/requests.log'}));

//数据解析
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//cookie session
app.use(require('cookie-parser')(voucher.cookieSecret));
app.use(require('express-session')({
    name : 'hcsession',
    resave: true,
    saveUninitialized: false,
    secret: voucher.cookieSecret,
    cookie: { maxAge: 60 * 10000 }
    //store: sessionStore,
}));



//静态文件
app.use(express.static(__dirname + '/public'));

//局部数据文件
app.use(function(req, res, next){
	if(!res.locals.partials) res.locals.partials = {};
 	//res.locals.partials.data = getData();
 	next();
});

/*flash消息
app.use(function(req, res, next){
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});
*/

//路由文件
require('./controllers/routes.js')(app);


//自动化视图渲染
var autoViews = {};
app.use(function(req,res,next){
    var path = req.path.toLowerCase();  
    // 检查缓存 如果存在渲染视图
    if(autoViews[path]) return res.render(autoViews[path]);
    // 如果不在缓存 匹配相关的.handlebars文件
    if(fs.existsSync(__dirname + '/views' + path + '.handlebars')){
        autoViews[path] = path.replace(/^\//, '');
        return res.render(autoViews[path]);
    }
    // 失败转入404
    next();
});

//404
app.use(function(req, res){
	res.status(404).render('404');
});

//500
app.use(function(req, res){
	res.status(500).render('500');
});



//多核集群
var server;
function startServer() {
    server = http.createServer(app).listen(app.get('port'), function(){
      console.log( 'hcii.cn started in ' + app.get('env') +
        ' mode on http://localhost:' + app.get('port') +
        '; press Ctrl-C to terminate.' );
    });
}

if(require.main === module){
    // 直接启动应用
    startServer();
} else {
    // require导入模块启动应用
    module.exports = startServer;
}



