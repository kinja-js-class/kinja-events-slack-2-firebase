import https from 'https'
import querystring from 'querystring'

import { omit } from 'lodash'
import { EVENT_TYPE, SEVERITY } from '../const'

const API_KEY = 'dc12ee4090f59334148097dfe3a45b36'
const APP_KEY = '248b87023e7b5294bdc77220c8e0be7d0198dacc'
const DOG_URL = 'https://app.datadoghq.com/api/v1/events'
const INFO_TYPES = ['success', 'info']

export function transform(response) {
	const failed = INFO_TYPES.indexOf(response.alert_type) === -1
	return {
		completed: false,
		severity: failed ? 'warning' : 'info',
		type: EVENT_TYPE.DATADOG,
		text: failed ? 'Kinja deploy failed' : 'Kinja deploy finished',
		timestamp: response.date_happened,
		meta: omit(response, ['alert_type', 'title', 'date_happened'])
	}
}

function getEvents(start, end) {
	const options = {
		start,
		end,
		api_key: API_KEY,
		application_key: APP_KEY,
		tags: 'application:kinja-mantle,job:kinja_deploy_job'
	}
	const url = DOG_URL + '?' + querystring.stringify(options)

	return new Promise((resolve, reject) => {
		https.get(url, res => {
			let response = ''
			res.on('data', chunk => response += chunk)
			res.on('end', _ => resolve(JSON.parse(response)))
		}).on('error', e => reject({error: {message: e.message}}))
	})
}

export function sync() {
	const now = Math.floor(Date.now() / 1000)
	const start = now - 3600 * 24

	return new Promise((resolve, reject) => {
		getEvents(start, now).then(data => {
			const events = data.events.reduce((acc, event) =>
				acc.concat(event.children.map(child =>
					transform({
						...child,
						url: event.url,
						host: event.host,
						resource: event.resource
					})
				))
			, [])

			resolve({start, end: now, events})
		}, reject)
	})
}