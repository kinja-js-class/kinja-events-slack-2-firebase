'use strict'

const express = require('express')
const qs = require('qs')

const StringDecoder = require('string_decoder').StringDecoder
const decoder = new StringDecoder('utf8')

const Firebase = require("firebase")
const dataStore = new Firebase("https://kinja-events.firebaseio.com/slack")

const app = express()
app.set('port', (process.env.PORT || 5000))

app.post('/receive', (request, respond) => {
	let body = ''
	request.on('data', (data) => body += data)

	request.on('end', () => {
		const data = decoder.write(body)
		console.info('Data received', data)
		dataStore.push(qs.parse(data))
		console.info('Pushed to store')
	})

	respond.send({'text': 'Thank you!'})
})

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'))
})