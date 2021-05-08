import withCors from '@/lib/withCors'
import Cacher from '@/lib/votesCacher'


const cacher = new Cacher({
  cacheTime: 60 * 60 * 1000,// 1 hour
  refreshCacheTime: 30 * 60 * 1000,// 30 mins
  parseFunction(response) {
    let itemsCache = {}

    itemsCache.items = response

    // Generate sort arrays
    itemsCache.viewsAscSort = [...response].sort((a, b) => a.views - b.views)
    itemsCache.votesAscSort = [...response].sort((a, b) => a.votes - b.votes)
    itemsCache.ratingAscSort = [...response].sort((a, b) => a.goodness - b.goodness)

    return itemsCache
  }
})

export default withCors(async (req, res) => {
  const items = await cacher.getItems()

  const returnRatingType = Math.floor(Math.random() * 2)
  let sortArray

  switch (returnRatingType) {
    case 0:
      sortArray = items.viewsAscSort.slice(0, 1000) // 1000 least viewed bgs
      break
    case 1:
      // sortArray = itemsCache.viewsAscSort.slice(0, 1000) // 1000 least viewed bgs

      // 1000 most voted
      // sortArray = itemsCache.votesAscSort.slice(itemsCache.votesAscSort.length - 1000)

      // 1000 most popular(votes/views)
      sortArray = items.ratingAscSort.slice(items.ratingAscSort.length - 1000)
      break
    // case 2:
    //   // 1000 most popular(votes/views)
    //   sortArray = itemsCache.ratingAscSort.slice(itemsCache.ratingAscSort.length - 1000)
    //   break
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
  res.setHeader('Random-Cache-Updated', cacher.lastUpdate)

  res.send(resbgs)
})



// callInit
async function init() {
  await cacher.updateCache()
}
init()
