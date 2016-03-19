import express from 'express'
import Firebase from 'firebase'

import getEventType from '../utils/get-event-type'
import providers from '../providers'

const router = express.Router()

router.post('/api/event', (request, res) => {
	const dataStore = new Firebase('https://kinja-events.firebaseio.com/events')
	const provider = providers.get(getEventType(request.body))

	if (provider && provider.transform) {
		dataStore.push(provider.transform.call(null, request.body), (error) => {
			if (error) {
				res.status(500).json({error: {message: 'Unable to push to firebase store'}})
				console.error(error)
			} else {
				res.status(200).json({success: true})
			}
		})
	} else {
		res.status(500).json({error: {message: 'Unrecognised event format'}})
	}
})

export default router