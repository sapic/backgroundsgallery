import withCors from '@/lib/withCors'
import { apiUrl } from '@/lib/getApiUrl'

const bgs = require('@/assets/bgs_full.json')

let itemsCache = {
  items: {},

  lastUpdate: 0,
}
const cacheTime = 60 * 60 * 1000 // 1 hour
const refreshCacheTime = 30 * 60 * 1000 // 30 mins

export default withCors(async (req, res) => {
  await getBgItems()
  const [left, ...rest] = req.query.url.split('-')

  const toEncode = rest.join('')
  const encoded = encodeURIComponent(toEncode)
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/'/g, '%27')

  const combined = `${left}-${encoded}`

  if (itemsCache.items[combined]) {
    return res.send(itemsCache.items[combined])
  }

  console.log('not found', combined, req.query.url)

  const found = bgs.find(bg => bg.url === combined)
  return res.send(found || {})
})


async function getBgItems() {
  if (Date.now() - itemsCache.lastUpdate < cacheTime) {
    if (Date.now() - itemsCache.lastUpdate > refreshCacheTime) {
      updateCache()
    }

    return itemsCache.items
  }

  return updateCache()
}

// Promise to return if we're already calculating, so we don't do it twice
let alreadyReturning = null
async function updateCache() {
  if (alreadyReturning) {
    return alreadyReturning
  }

  alreadyReturning = (async () => {
    const response = await fetch(`${apiUrl}/api/votesInfo`).then(r => r.json())
    if (!response || response.length < 1) {
      throw new Error('response error')
    }

    const newItems = {}
    for (const item of response) {
      newItems[item.url] = item
    }
    // console.log('new items', newItems)

    itemsCache.items = newItems

    // itemsCache.items = response

    // Generate sort arrays
    // itemsCache.viewsAscSort = [...response].sort((a, b) => a.views - b.views)
    // itemsCache.votesAscSort = [...response].sort((a, b) => a.votes - b.votes)
    // itemsCache.ratingAscSort = [...response].sort((a, b) => a.goodness - b.goodness)

    itemsCache.lastUpdate = Date.now()

    return itemsCache.items
  })()

  return alreadyReturning
}

// callInit
async function init() {
  await getBgItems()
}
init()