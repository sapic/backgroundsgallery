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

function parseWithSorts(response) {
  let itemsCache = {}

  itemsCache.items = response

  // Generate sort arrays
  itemsCache.viewsAscSort = [...response].sort((a, b) => a.views - b.views)
  itemsCache.votesAscSort = [...response].sort((a, b) => a.votes - b.votes)
  itemsCache.ratingAscSort = [...response].sort((a, b) => a.goodness - b.goodness)

  return itemsCache
}

function parseWithGameId(response) {
  let itemsCache = {}

  const withGameId = {}

  for (const bg of response) {
    const gameId = bg.url.split('-')[0].split('/')[1]

    if (withGameId[gameId]) {
      withGameId[gameId].push(bg)
    } else {
      withGameId[gameId] = [bg]
    }
  }

  itemsCache.items = response
  itemsCache.games = withGameId

  return itemsCache
}

function parseToObject(response) {
  const newItems = {}
  for (const item of response) {
    newItems[item.url] = item
  }

  const itemsCache = {}

  itemsCache.items = newItems

  return itemsCache
}

export {
  defaultParseFunction,
  parseWithSorts,
  parseToObject,
  parseWithGameId,
}
