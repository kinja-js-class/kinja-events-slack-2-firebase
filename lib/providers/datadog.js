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

	function makeRequest(resolve, reject) {
		https.get(url, res => {
			let response = ''
			res.on('data', chunk => response += chunk)
			res.on('end', _ => resolve(JSON.parse(response)))
		}).on('error', e => reject({error: {message: e.message}}))
	}

	return new Promise(makeRequest)
}

function transformEvents(eventsFromDatadog) {
	return eventsFromDatadog.reduce((acc, event) =>
		acc.concat(event.children.map(child =>
			transform({
				...child,
				url: event.url,
				host: event.host,
				resource: event.resource
			})
		))
	, [])
}

export function sync(options) {
	return new Promise((resolve, reject) =>
		getEvents(options.start, options.end)
			.then(data => resolve(transformEvents(data.events)
				// Date range restriction does not apply to child events in datadog. It's their API's fault
				// adjusting is necesarry to make sure we only operate on events that actually happened in the
				// requested time range.
				.filter(event => event.timestamp >= options.start && event.timestamp < options.end)))
			.catch(reject)
	)
}