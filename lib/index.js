'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import qs from 'qs'
import Firebase from 'firebase'

const dataStore = new Firebase('https://kinja-events.firebaseio.com/slack')

const app = express()
app.set('port', process.env.PORT)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.post('/receive/slack', (request, respond) => {
	console.info(`Message received from ${request.body.user_name}`)
	dataStore.push(request.body)
	console.info('Pushed to store')
	respond.send({'text': ''})
})

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'))
})