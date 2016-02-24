/*
 * 主路由文件 @Ming
 */
var userController = require('./usercontroller.js'),
	main = require('../models/main.js'),
	user = require('../models/user.js'),
	usermodel = require('../models/usermodel.js'),
	userinfo = require('../models/userinfo.js');
	
	//captcha = require('../models/captcha.js');


module.exports = function(app){

	//首页
	app.get('/', main.home);

	//登录
	app.get('/login', user.login);

	//注册
	app.get('/register*', user.register);
	//认证
	app.get('/authen*', user.authen);
	
	//找回登录密码
	app.get('/forgetpassword*', user.getpassword);


	//产品列表
	app.get('/products*', main.products);
	
	//产品详情
	app.get('/detail*', main.detail);

	//债权转让
	app.get('/assignment*', main.assignment);

	//委托协议
	app.get('/trustagreement*', main.trust);
	//质押协议
	app.get('/loanagreement*', main.loan);
	//隐私条款
	app.get('/privacypolicy*', main.privacypolicy);
	//服务协议
	app.get('/serviceagreement*', main.serviceagreement);
	//法律声明
	app.get('/statement*', main.statement);


	//用户中心
	app.get('/usercenter*', usermodel.dologin, user.usercenter);
	//资金管理
	app.get('/user-fund*', usermodel.dologin, user.fund);
	//充值
	app.get('/user-recharge*', usermodel.dologin, user.recharge);
	//提现
	app.get('/user-withdraw*', usermodel.dologin, user.withdraw);
	//银行卡管理
	app.get('/user-bank*', usermodel.dologin, user.bank);
    //投资管理
    app.get('/user-invest*', usermodel.dologin, user.invest);
    //帐户安全
    app.get('/user-safety*', usermodel.dologin, user.safety);
    //智能投资
	app.get('/user-intell*', usermodel.dologin, user.intell);
    //我的卡券
    app.get('/user-card*', usermodel.dologin, user.card);
    //消息中心
    app.get('/user-message*', usermodel.dologin, user.message);
    //邀请好友
    app.get('/user-friend*', usermodel.dologin, user.friend);
    //积分换购
    app.get('/user-integral*', usermodel.dologin, user.integral);
    //帐户设置
    app.get('/user-information*', usermodel.dologin, user.information);

	
	app.post('/payment*', usermodel.dologin, user.payment);
	app.post('/userpayment*', usermodel.dologin, user.userpayment);


	//关于我们
	app.get('/about*', main.about);
	
	//新手指引
	app.get('/help*', main.help);

	
	//常见问题
	app.get('/question*', main.problem);

	//安全保障
	app.get('/safety*', main.safety);

	//加入花橙
	app.get('/job*', main.job);

	//如何购买
	app.get('/profiting*', main.howbuy);

	//合作伙伴
	app.get('/partners*', main.partners);


	//新闻报道
	app.get('/news*', main.news);

	//媒体报道
	app.get('/reports*', main.reports);

	//托收公示
	app.get('/collection*', main.collection);
	//回款公示
	app.get('/repayment*', main.repayment);

	//公告
	app.get('/notice*', main.notice);
	
	//详细内容
	app.get('/hcdetails*', main.details);

	//联系我们
	app.get('/service*', main.contactus);
	

	//用户逻辑
	userController.userRoutes(app);
};



