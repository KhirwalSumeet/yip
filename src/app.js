const express 		= require('express');
const nunjucks 		= require('nunjucks');
const bodyParser 	= require('body-parser');
const cookieParser 	= require('cookie-parser');
const config 		= require(__dirname + '/../config');
const logger 		= config.logger;
const db 			= require(__dirname + '/models/index.js');
const authenticate 	= require(__dirname + '/routes/authentication.js')(db);
const user 			= require(__dirname + '/routes/user')(db);
const update 		= require(__dirname + '/routes/update')(db);
const deploy 		= require(__dirname + '/routes/deploy');
const app = express();

nunjucks.configure(__dirname + '/views', {
	express: app,
	tags: config.nunjuck.tags,
	watch: config.nunjuck.watch
})


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(config.baseUrl, express.static(__dirname + '/public'));

app.use(function(req, res, next) {
	logger.log('Received request at ' + req.originalUrl + ' ' + Date());
	next();
})

app.get(config.baseUrl, function(req, res, next) {
	res.render('index.html', { title: 'Young Innovators Program'});
})

app.get(config.baseUrl + 'index', function(req, res, next) {
	res.render('index.html', { title: 'Young Innovators Program'});
})

app.get(config.baseUrl + 'login', authenticate.validate, function(req, res, next) {
	if(req.email){
		res.redirect('dashboard');
		return;
	}
	res.render('login.html', { title: 'Login | Young Innovators Program'});
})

app.get(config.baseUrl + 'signup', authenticate.validate,function(req, res, next) {
	if(req.email){
		res.redirect('dashboard');
		return;
	}
	res.render('signup.html', { title: 'Signup | Young Innovators Program'});
})

app.get(config.baseUrl + 'rules', function(req, res, next) {
	res.render('rules.html')
})

app.get(config.baseUrl + 'dashboard', authenticate.validate, function(req, res, next) {
	req.email = 'mak1910@outlook.com';
	if(req.email) {
		res.render('dashboard.html', { title: 'Dashboard | Young Innovators Program', email : req.email });
	} else {
		res.redirect('login');
	}
})

app.get(config.baseUrl + 'logout', function(req, res, next) {
	res.clearCookie('session');
	res.redirect('index');
})

app.get(config.baseUrl + 'faq', function(req, res, next) {
	res.render("faq.html");
})

app.get(config.baseUrl + 'verification/:email', function(req, res, next) {
	req.email = req.params.email;
	logger.log(req.email);
	next();
}, user.validateUserEmail, function(req, res, next) {
	res.redirect('../dashboard');
})

// Api Routes

app.post(config.baseUrl + 'api/register', user.createUser, authenticate.createToken, function(req, res, next) {
	res.redirect('../dashboard');
});

app.post(config.baseUrl + 'api/challenge', user.checkUser, authenticate.createToken, function(req, res, next){
	res.redirect('../dashboard');
})

app.post(config.baseUrl + 'api/deployGit', deploy.update);
app.post(config.baseUrl + 'api/randomAndamanVS', deploy.stream);

app.post(config.baseUrl + 'api/getAll', authenticate.validate, user.getAllData);
app.post(config.baseUrl + 'api/updateTeachers', authenticate.validate, update.teachers);
app.post(config.baseUrl + 'api/updateSchools', authenticate.validate, update.schools);
app.post(config.baseUrl + 'api/updateTeams', authenticate.validate, update.teams);
// Default routes

app.get(config.baseUrl, function(req, res, next) {
	res.sendStatus(404);
})

app.use(function(err, req, res, next) {
	logger.error(err);
	if(config.env == 'development') {
		res.json(err);
	} else {
		res.sendStatus(500);
	}
})

app.listen(config.port, function() {
	logger.log('Base Url is ' + config.baseUrl);
	logger.log('App running on port ' + config.port);
	logger.log('App restarted');
})