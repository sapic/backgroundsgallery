import withDatabase from '@/lib/database'
import withCors from '@/lib/withCors'

const bgs = require('@/assets/bgs_full.json')
let alreadyReturning = null
// const weightesPlaceholder = require('../../assets/weightedWithInfo.json')

export default withCors(withDatabase(async (req, res) => {
  const bgs = await getItems(req)

  req.setHeader('Random-Cache-Updated', itemsCache.lastUpdate)

  res.send(bgs)
}))

let itemsCache = {
  items: [],
  lastUpdate: 0,
}
const cacheTime = 60 * 60 * 1000 // 1 hour
const refreshCacheTime = 30 * 60 * 1000 // 30 mins

// callInit
withDatabase((req) => {
  getItems(req)
})({})

async function getItems(req) {
  // If cache fresh - return from it
  if (Date.now() - itemsCache.lastUpdate < cacheTime) {
    if (Date.now() - itemsCache.lastUpdate > refreshCacheTime) {
      updateCache(req.db)
    }

    return itemsCache.items
  } else if (itemsCache.items.length > 0) {
    // If cache old, but have items - return them and update cache in bg
    updateCache(req.db)
    return itemsCache.items
  }

  // Cache old and empty - return refresh result
  return updateCache(req.db)
}

// Promise to return if we're already calculating, so we don't do it twice
async function updateCache(db) {
  if (alreadyReturning) {
    return alreadyReturning
  }

  alreadyReturning = (async (db) => {
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
    itemsCache.lastUpdate = Date.now()

    alreadyReturning = null
    return itemsCache.items
  })(db)

  return alreadyReturning
}
