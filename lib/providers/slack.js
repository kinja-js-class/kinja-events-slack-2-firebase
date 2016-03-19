import { omit } from 'lodash'
import { EVENT_TYPE, SEVERITY } from '../const'

export function transform(response) {
	return {
		completed: false,
		severity: SEVERITY.INFO,
		type: EVENT_TYPE.SLACK,
		text: response.text,
		timestamp: parseInt(response.timestamp, 10),
		meta: omit(response, ['text', 'timestamp'])
	}
}

export function sync() {
	return Promise.resolve()
}