import assert from 'assert';
import { omit } from 'lodash'

import { slackTransform } from '../lib/transforms'
import { response } from './fixtures/slack'

describe('Transformed slack response', () => {

	it('should contain text and timestamp', () => {
		console.log(slackTransform(response));
		assert.equal(slackTransform(response).text, response.text)
		assert.equal(slackTransform(response).timestamp, response.timestamp)
	})

	it('should contain info for the kinja-events application ', () => {
		assert.equal(slackTransform(response).completed, false)
		assert.equal(slackTransform(response).severity, 'info')
		assert.equal(slackTransform(response).type, 'slack')
	})

	it('should contain meta, w/ original response, w/o text and timestamp', () => {
		assert.deepEqual(slackTransform(response).meta, omit(response, ['text', 'timestamp']))
	})

})