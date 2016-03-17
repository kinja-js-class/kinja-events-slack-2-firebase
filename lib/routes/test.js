import express from 'express'
import Firebase from 'firebase'

import testData from '../../test/fixtures/performance-test.js'

const router = express.Router()

router.get('/test/insert-mock-data', (request, res) => {
	const dataStore = new Firebase('https://kinja-events.firebaseio.com/performance-test')

	dataStore.set(testData, (error) => {
		if (error) {
			res.status(500).json({error: {message: 'Unable to push to firebase store'}})
			console.error(error)
		} else {
			res.status(200).json({success: true})
		}
	})
})

export default router