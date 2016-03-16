import testData from '../../test/fixtures/performance-test.js'

export default function insertRandomRows(request, respond) {
	const dataStore = new Firebase('https://kinja-events.firebaseio.com/performance-test')

	dataStore.set(testData)

	respond.send(`Inserted ${testData.length} items to 'performance-test'`)
}