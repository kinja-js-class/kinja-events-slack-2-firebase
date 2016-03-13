import { extend, pick, omit } from 'lodash'

export function slackTransform(response) {
	let transformedResponse = extend({
		completed: false,
		severity: 'info',
		type: 'slack'
	}, pick(response, ['text', 'timestamp']))

	transformedResponse.meta = omit(response, ['text', 'timestamp'])

	return transformedResponse
}