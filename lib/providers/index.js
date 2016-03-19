import providers from './proxy'
import { EVENT_TYPE } from '../const'

// Loading providers
import * as slack from './slack'
import * as datadog from './datadog'

// Registering providers to proxy
providers.register(EVENT_TYPE.SLACK, slack)
providers.register(EVENT_TYPE.DATADOG, datadog)

export default providers