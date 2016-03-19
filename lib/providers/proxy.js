const _providers = {}

class Providers {
	register(name, provider) {
		_providers[name] = provider
	}

	get(name) {
		return name in _providers ? _providers[name] : null
	}
}

export default new Providers()