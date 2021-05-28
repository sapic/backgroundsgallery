import { apiUrl } from '@/lib/getApiUrl'

export default class Cacher {
  cached = {}
  lastUpdate = 0
  alreadyReturning = null

  constructor({
    cacheTime,
    refreshTime,
    parseFunctions = []
  }) {
    this.cacheTime = cacheTime
    this.refreshTime = refreshTime
    this.parseFunctions = parseFunctions

    this.updateCache()
  }

  async getItems() {
    if (Date.now() - this.lastUpdate < this.cacheTime) {
      if (Date.now() - this.lastUpdate > this.refreshTime) {
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

      let items = { items: response }
      for (const func of this.parseFunctions) {
        items = await func(items)
      }

      this.cached = items

      this.lastUpdate = Date.now()

      this.alreadyReturning = null
      return items
    })()

    return this.alreadyReturning
  }
}

function parseWithSorts(itemsCache) {
  let response = itemsCache.items

  // Generate sort arrays
  itemsCache.viewsAscSort = [...response].sort((a, b) => a.views - b.views)
  itemsCache.votesAscSort = [...response].sort((a, b) => a.votes - b.votes)
  itemsCache.ratingAscSort = [...response].sort((a, b) => a.goodness - b.goodness)

  return itemsCache
}

function parseWithGameId(itemsCache) {
  let response = itemsCache.items

  const withGameId = {}

  for (const bg of response) {
    const gameId = bg.url.split('-')[0].split('/')[1]

    if (withGameId[gameId]) {
      withGameId[gameId].push(bg)
    } else {
      withGameId[gameId] = [bg]
    }
  }

  itemsCache.games = withGameId

  return itemsCache
}

function parseToObject(itemsCache) {
  let response = itemsCache.items

  const newItems = {}
  for (const item of response) {
    newItems[item.url] = item
  }

  itemsCache.urls = newItems

  return itemsCache
}

export {
  // defaultParseFunction,
  parseWithSorts,
  parseToObject,
  parseWithGameId,
}
