import Cors from 'cors'
import { apiUrl } from '@/lib/getApiUrl'

const cors = Cors({
  origin: "*",
  methods: ['GET', 'HEAD'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default async (req, res) => {
  // Run the middleware
  await runMiddleware(req, res, cors)

  await getBgItems()

  const returnRatingType = Math.floor(Math.random() * 3)
  let sortArray

  switch (returnRatingType) {
    case 0:
      sortArray = itemsCache.viewsAscSort.slice(0, 1000) // 1000 least viewed bgs
      break
    case 1:
      sortArray = itemsCache.viewsAscSort.slice(0, 1000) // 1000 least viewed bgs

      // 1000 most voted
      // sortArray = itemsCache.votesAscSort.slice(itemsCache.votesAscSort.length - 1000)
      break
    case 2:
      // 1000 most popular(votes/views)
      sortArray = itemsCache.ratingAscSort.slice(itemsCache.ratingAscSort.length - 1000)
      break
    default: break
  }

  const index1 = Math.floor(Math.random() * sortArray.length)
  const random2 = Math.floor(Math.random() * sortArray.length)

  // Check if it's same so we don't send 2 same pictures
  const index2 = random2 !== index1
    ? random2
    : random2 > 0
      ? random2 - 1
      : random2 + 1

  const randomBg1 = sortArray[index1]
  const randomBg2 = sortArray[index2]
  const resbgs = [randomBg1, randomBg2]

  res.setHeader('Random-Type', returnRatingType);

  res.send(resbgs)
}

let itemsCache = {
  items: [],

  viewsAscSort: [],
  votesAscSort: [],
  ratingAscSort: [],

  lastUpdate: 0,
}
const cacheTime = 60 * 60 * 1000 // 1 hour
const refreshCacheTime = 30 * 60 * 1000 // 30 mins

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
    itemsCache.viewsAscSort = response.sort((a, b) => a.views - b.views)
    itemsCache.votesAscSort = response.sort((a, b) => a.votes - b.votes)
    itemsCache.ratingAscSort = response.sort((a, b) => a.goodness - b.goodness)

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