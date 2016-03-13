'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import qs from 'qs'
import Firebase from 'firebase'

import { slackTransform } from './transforms'

const dataStore = new Firebase('https://kinja-events.firebaseio.com/events')

const app = express()
app.set('port', process.env.PORT)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.post('/add/slack', (request, respond) => {
	console.info(`Message received from ${request.body.user_name}`)
	let responseText = ''

	try {
		dataStore.push(slackTransform(request.body))
	} catch (e) {
		responseText = e.message
	}

	respond.send({'text': responseText})
})

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'))
})