const exec 	 = require('child_process').exec;
const spawn  = require('child_process').spawn;
const stream = require('stream');

var deploy = function(req, res, next) {
	var update = exec(__dirname + '/../../bin/update', function(err, stdout, stderr) {
		console.log(err, stdout, stderr);
	})
	var stream = update.stdout;
	stream.on('data', function(data) {
		console.log(data.toString());
	})
	res.sendStatus(200);
}

var streamLogs = function(req, res, next) {
	var logs = spawn('pm2', ['log']);
	var post = new stream.Writable();

	logs.stdout.on('data', (data) => {
  		post.write(`stdout: ${data}`);
	});

	logs.stderr.on('data', (data) => {
  		post.write(`stderr: ${data}`);
	});

	logs.on('close', (code) => {
  		post.write(`child process exited with code ${code}`);
	});

	res.set('Content-Type', 'document');
    res.pipe(post);

	setTimeout(function() {
		logs.kill();	
      	res.end();
	}, 5*60*1000);
}

module.exports = {
	update: deploy,
	stream: streamLogs
};