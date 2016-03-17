import { omit } from 'lodash'
import { EVENT_TYPE, SEVERITY } from './const'

function slackTransform(response) {
	return {
		completed: false,
		severity: SEVERITY.INFO,
		type: EVENT_TYPE.SLACK,
		text: response.text,
		timestamp: parseInt(response.timestamp, 10),
		meta: omit(response, ['text', 'timestamp'])
	}
}

function wrapTransform(transform) {
	return {
		run: _ => transform(_)
	}
}

export function getTransform(eventType) {
	switch (eventType) {
		case EVENT_TYPE.SLACK:
			return wrapTransform(slackTransform)
		default:
			return null
	}
}