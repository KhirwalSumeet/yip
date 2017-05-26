const crypt = require(__dirname + '/../lib/encryption');

var authentication = {};
var db = {};

/* If cookies exists and if cookie is valid JSON then user exists
   If invalid then throw error
   If no cookie, continue without any errors */

authentication.validate = function(req, res, next) {
	if(req.cookies.session) {
		try {
			var details = JSON.parse(crypt.decrypt(req.cookies.session));
			req.email = details.email;
			next();
		} catch(err) {
			next(new Error('Unable to parse token'));
		}
	} else {
		next();
	}
}

/* If req.user.email exists then create a cookie and ser req.email = req.user.email */

authentication.createToken = function(req, res, next) {
	if(!req.user || !req.user.email) {
		next(new Error('User does not exist or incorrect username/password'));
		return;
	}

	if(req.body.remember == "on") {
		req.email = req.user.email;
		res.cookie('session', crypt.encrypt(JSON.stringify({ email: req.user.email })), { expire: false });
		next();
	} else {
		req.email = req.user.email;
		res.cookie('session', crypt.encrypt(JSON.stringify({ email: req.user.email })));
		next();
	}
}

module.exports = function(sequelize) {
	db = sequelize;
	return authentication;
}