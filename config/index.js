var config = {};

config.port = process.env['PORT'] || 3000;
config.env = process.env['NODE_ENV'] || 'production';

config.nunjuck = {
	tags: {
	    blockStart		: '<%',
	    blockEnd		: '%>',
	    variableStart	: '<$',
	    variableEnd		: '$>',
	    commentStart	: '<#',
	    commentEnd		: '#>'
	},
	watch: false
};

config.email = {
    host: '203.110.240.245',
    port: 587,
    secure: false,
    auth: {
        user: 'barc@iitkgp.ac.in',
        pass: process.env['EMAIL_PASS']
    },
    tls: {
        rejectUnauthorized: false
    }
};

if(config.env == 'development') {
	config.logger = console;
	config.nunjuck['watch'] = true;
	config.baseUrl = '/barc/yip/';
} else {
	config.logger = console;
	config.nunjuck['watch'] = false;
	config.baseUrl = '/';
}

module.exports = config;