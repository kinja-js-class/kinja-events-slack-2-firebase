var express = require('express');
var qs = require('qs');

var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');

var Firebase = require("firebase");
var dataStore = new Firebase("https://kinja-events.firebaseio.com/slack");

var app = express();

app.post('/receive', function (request, respond) {
	var body = '';
	filePath = __dirname + '/public/data.txt';
	request.on('data', function (data) {
		body += data;
	});

	request.on('end', function () {
		var data = decoder.write(body);
		dataStore.set(qs.parse(data));
	});

	respond.send({"text": "Thank you!"});
});

app.listen(8080);