import express from 'express'
import Firebase from 'firebase'

import { filter, find } from 'lodash'

import { EVENT_TYPE } from '../const'
import providers from '../providers'

const router = express.Router()

function pushToStore(options, datadogEvents) {
	const dataStore = new Firebase('https://kinja-events.firebaseio.com/events')

	function applyDeltas(resolve, reject) {
		dataStore.orderByChild('timestamp').startAt(options.start).endAt(options.end).once('value', snapshot => {
			const datadogIDs = filter(snapshot.val(), event => event.type === EVENT_TYPE.DATADOG)
				.map(event => event.meta.id)

			const newEvents = datadogEvents.filter(event => datadogIDs.indexOf(event.meta.id) === -1)

			newEvents.map(event => dataStore.push(event))

			resolve({success: true, newEvents: newEvents.length ? newEvents : null })
		})
	}

	return new Promise(applyDeltas)
}

router.get('/api/sync', (request, res) => {
	switch (request.query.provider) {
		case EVENT_TYPE.DATADOG:
			const now = Math.floor(Date.now() / 1000)
			const options = {
				end: now,
				start: now - 3600 * 24
			}

			providers.get('datadog').sync(options)
				.then(response => pushToStore(options, response).then(result => res.status(200).json(result)))
				.catch(error => res.status(500).json(error))
			break;
		default:
			res.status(500).json({error: {message: 'Unable to sync unknown provider'}})
			break;
	}

})

export default router