const cryp = require('crypto');
const algo = 'aes-256-ctr';
const pass = process.env['HASHKEY'];

module.exports = {
	encrypt: function(text) {
		var cipher = cryp.createCipher(algo,pass);
	  	var crypted = cipher.update(text,'utf8','hex');
	  	crypted += cipher.final('hex');
	  	return crypted;		
	},
	decrypt: function(text) {
		var decipher = cryp.createDecipher(algo,pass);
	  	var dec = decipher.update(text,'hex','utf8');
	  	dec += decipher.final('utf8');
	  	return dec;	
	}
}