import { apiUrl } from '@/lib/getApiUrl'

export default class Cacher {
  cached = {}
  lastUpdate = 0
  alreadyReturning = null

  constructor({
    cacheTime,
    refreshTime,
    parseFunction = defaultParseFunction
  }) {
    this.cacheTime = cacheTime
    this.refreshTime = refreshTime
    this.parseFunction = parseFunction
  }

  async getItems() {
    if (Date.now() - this.lastUpdate < this.cacheTime) {
      if (Date.now() - this.lastUpdate > this.refreshCacheTime) {
        this.updateCache()
      }

      return this.cached
    }

    return this.updateCache()
  }

  async updateCache() {
    if (this.alreadyReturning) {
      return this.alreadyReturning
    }

    this.alreadyReturning = (async () => {
      console.log('fetch weighted')
      const response = await fetch(`${apiUrl}/api/votesInfo`).then(r => r.json())
      if (!response || response.length < 1) {
        throw new Error('response error')
      }

      const items = await this.parseFunction(response)
      this.cached = items

      this.lastUpdate = Date.now()

      this.alreadyReturning = null
      return items
    })()

    return this.alreadyReturning
  }
}

function defaultParseFunction(response) {
  let itemsCache = {}

  itemsCache.items = response

  return itemsCache
}