import { EVENT_TYPE } from '../const'

export default function getEventType(response) {
	if (response.channel_name) {
		return EVENT_TYPE.SLACK
	}
}
