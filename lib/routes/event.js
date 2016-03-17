import express from 'express'
import Firebase from 'firebase'

import getEventType from '../utils/get-event-type'
import { getTransform } from '../transforms'

const router = express.Router()

router.post('/api/event', (request, res) => {
	const dataStore = new Firebase('https://kinja-events.firebaseio.com/events')
	const transform = getTransform(getEventType(request.body))

	if (transform) {
		dataStore.push(transform.run(request.body), (error) => {
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