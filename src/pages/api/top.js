import { apiUrl } from '@/lib/getApiUrl'
import withCors from '@/lib/withCors'

let itemsCache = {
  items: [],

  viewsAscSort: [],
  votesAscSort: [],
  ratingAscSort: [],

  lastUpdate: 0,
}
const cacheTime = 60 * 60 * 1000 // 1 hour
const refreshCacheTime = 30 * 60 * 1000 // 30 mins

const allowedTypes = [0, 1, 2]

export default withCors(async (req, res) => {
  await getBgItems()
  let { limit, offset, sort } = req.query
  limit = parseInt(limit)
  offset = parseInt(offset)
  sort = parseInt(sort)

  if (typeof limit !== 'number' || limit < 0 || limit > 100 || isNaN(limit)) {
    limit = 100
  }

  if (typeof offset !== 'number' || offset < 0 || isNaN(offset)) {
    offset = 0
  }

  if (typeof sort !== 'number' || !allowedTypes.includes(sort) || isNaN(sort)) {
    sort = 0
  }

  const count = itemsCache.items.length
  if (offset > count - 1) {
    return res.send({
      items: [],
      meta: {
        limit,
        offset,
        sort,
        count: itemsCache.items.length,
      }
    })
  }

  const sortToReturn = sort === 0
    ? itemsCache.ratingAscSort
    : sort === 1
      ? itemsCache.votesAscSort
      : itemsCache.viewsAscSort

  let start = count - (offset + limit)
  if (start < 0) {
    start = 0
  }
  let end = count - offset

  res.send({
    items: sortToReturn.slice(start, end).reverse(),
    meta: {
      limit,
      offset,
      sort,
      count: itemsCache.items.length,
    }
  })
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
    console.log('fetch weighted')
    const response = await fetch(`${apiUrl}/api/votesInfo`).then(r => r.json())
    if (!response || response.length < 1) {
      throw new Error('response error')
    }

    itemsCache.items = response

    // Generate sort arrays
    itemsCache.viewsAscSort = [...response].sort((a, b) => a.views - b.views)
    itemsCache.votesAscSort = [...response].sort((a, b) => a.votes - b.votes)
    itemsCache.ratingAscSort = [...response].sort((a, b) => a.goodness - b.goodness)

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
