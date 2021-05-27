import withCors from '@/lib/withCors'
import Cacher, { parseWithSorts } from '@/lib/votesCacher'

const cacher = new Cacher({
  cacheTime: 60 * 60 * 1000,// 1 hour
  refreshTime: 30 * 60 * 1000,// 30 mins
  parseFunction: parseWithSorts,
})

export default withCors(async (req, res) => {
  const items = await cacher.getItems()

  const returnRatingType = 1 // return best ones for now
  // Math.floor(Math.random() * 2)
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

  console.log('sort array', sortArray[0])

  res.setHeader('Random-Type', returnRatingType);
  res.setHeader('Random-Cache-Updated', cacher.lastUpdate)

  res.send(resbgs)
})
