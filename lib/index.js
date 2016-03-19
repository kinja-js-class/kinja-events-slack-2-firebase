'use strict'

import express from 'express'
import bodyParser from 'body-parser'

import eventRoutes from './routes/event'
import syncRoutes from './routes/sync'
import testRoutes from './routes/test'

const app = express()

app.set('port', process.env.PORT)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use('/', eventRoutes)
app.use('/', syncRoutes)
app.use('/', testRoutes)

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'))
})