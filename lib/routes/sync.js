import express from 'express'
import Firebase from 'firebase'

import { EVENT_TYPE } from '../const'
import providers from '../providers'

const router = express.Router()

function pushToStore(response) {
	const dataStore = new Firebase('https://kinja-events.firebaseio.com/events')

	return response
}

router.get('/api/sync', (request, res) => {

	switch (request.query.provider) {
		case EVENT_TYPE.DATADOG:
			providers.get('datadog').sync().then(
				response => res.status(200).json(pushToStore(response)),
				response => res.status(500).json(response))
			break;
		default:
			res.status(500).json({error: {message: 'Unable to sync unknown provider'}})
			break;
	}

})

export default router