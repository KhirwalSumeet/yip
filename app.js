var express = require('express');
var app = express();

app.get('/', function(req, res) {
	res.send("Done");
});

app.listen(80);