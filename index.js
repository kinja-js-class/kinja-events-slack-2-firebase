var express = require('express');
var qs = require('qs');

var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');

var Firebase = require("firebase");
var dataStore = new Firebase("https://kinja-events.firebaseio.com/slack");

var app = express();
app.set('port', (process.env.PORT || 5000));

app.post('/receive', function (request, respond) {
	var body = '';
	request.on('data', function (data) {
		body += data;
	});

	request.on('end', function () {
		var data = decoder.write(body);
		dataStore.set(qs.parse(data));
	});

	respond.send({"text": "Thank you!"});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});