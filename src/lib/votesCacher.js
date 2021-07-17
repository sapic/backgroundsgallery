// import { apiUrl } from '@/lib/getApiUrl'

const bgs = require('@/assets/bgs_full.json')

export default class Cacher {
  cached = {}
  lastUpdate = 0
  alreadyReturning = null

  constructor({
    getDbClient,
    cacheTime,
    refreshTime,
    parseFunctions = []
  }) {
    this.cacheTime = cacheTime
    this.refreshTime = refreshTime
    this.parseFunctions = parseFunctions
    this.getDbClient = getDbClient

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
      const client = await this.getDbClient()
      if (!client.isConnected()) await client.connect()
      const db = client.db('test')
      let items = {}

      for (const func of this.parseFunctions) {
        items = await func(items, db)
      }

      this.cached = items

      this.lastUpdate = Date.now()

      this.alreadyReturning = null
      return this.cached
    })()

    return this.alreadyReturning
  }
}

async function getBackgroundsData(itemsCache, db) {
  console.log('fetch weighted in cache')
  const views = db.collection('views')
  const votesTotal = db.collection('votes_total')

  const viewsDocs = await views.find().toArray()
  const votesDocs = await votesTotal.find().toArray()

  const combined = {}
  const result = []

  for (const view of viewsDocs) {
    combined[view.url] = {
      views: view.views
    }
  }

  for (const votes of votesDocs) {
    if (!combined[votes.url]) {
      console.log('no vote in combined')
    }
    combined[votes.url].votes = votes.votes
  }

  let max = 0
  for (const key of Object.keys(combined)) {
    const item = combined[key]
    if (item.votes && item.votes > max) {
      max = item.votes
    }
  }

  for (const key of Object.keys(combined)) {
    const item = combined[key]

    if (!item.votes || !item.views) {
      continue
    }

    const bgInfo = bgs.find(bg => bg.url === key)
    if (!bgInfo) {
      continue
    }

    result.push({
      ...item,
      ...bgInfo,
      popularity: item.votes / max,
      goodness: item.votes / item.views
    })
  }

  itemsCache.items = result
  return itemsCache
}

async function getAnimatedData(itemsCache, db) {
  const animatedBgs = db.collection('animated_bgs')

  let bgs = await animatedBgs.find({}).toArray()
  bgs = bgs.sort((a, b) => b.timestampCreated - a.timestampCreated).map(bg => { // add game
    if (itemsCache.apps && itemsCache.apps[bg.appid]) {
      bg.game = itemsCache.apps[bg.appid]
    }

    return bg
  })

  itemsCache.animated = bgs

  return itemsCache
}

async function getAppsData(itemsCache, db) {
  const appsJson = require('@/assets/apps.json')

  let result = {}
  const { applist } = appsJson
  const { apps } = applist

  for (const app of apps) {
    result[app.appid] = app.name
  }

  itemsCache.apps = result

  return itemsCache
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
    newItems[item.url.toLowerCase()] = item
  }

  itemsCache.urls = newItems

  return itemsCache
}

export {
  // defaultParseFunction,
  getBackgroundsData,
  getAnimatedData,
  getAppsData,

  parseWithSorts,
  parseToObject,
  parseWithGameId,
}
