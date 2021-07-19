import withCors from '@/lib/withCors'
import withCacher from '@/lib/withCacher'

export default withCacher(withCors(async (req, res) => {
  const items = await req.Cacher.getItems()

  const animatedTypeRandom = Math.floor(Math.random() * 10)
  const returnType = animatedTypeRandom < 3 // 0 - animated, 1-9 - static 30% for now

  const resbgs = returnType
    ? getAnimatedBackgrounds(items)
    : getStaticBackgrounds(items)

  res.setHeader('Random-Type', returnType)
  res.setHeader('Random-Cache-Updated', req.Cacher.lastUpdate)

  res.send(resbgs)
}))

function getAnimatedBackgrounds(itemsCache) {
  const [index1, index2] = getRandomIndeces(itemsCache.animated.length)

  const randomBg1 = itemsCache.animated[index1]
  const randomBg2 = itemsCache.animated[index2]

  return [randomBg1, randomBg2, {
    type: 'animated'
  }]
}

function getStaticBackgrounds(itemsCache) {
  const returnRatingType = Math.floor(Math.random() * 2)
  let sortArray

  switch (returnRatingType) {
    case 0:
      // 1000 most popular after first 1000(votes/views)
      sortArray = itemsCache.ratingAscSort.slice(itemsCache.ratingAscSort.length - 2000, itemsCache.ratingAscSort.length - 1000)
      // sortArray = items.viewsAscSort.slice(0, 1000) // 1000 least viewed bgs
      break
    case 1:
      // sortArray = itemsCache.viewsAscSort.slice(0, 1000) // 1000 least viewed bgs

      // 1000 most voted
      // sortArray = itemsCache.votesAscSort.slice(itemsCache.votesAscSort.length - 1000)

      // 1000 most popular(votes/views)
      sortArray = itemsCache.ratingAscSort.slice(itemsCache.ratingAscSort.length - 1000)
      break
    // case 2:
    //   // 1000 most popular(votes/views)
    //   sortArray = itemsCache.ratingAscSort.slice(itemsCache.ratingAscSort.length - 1000)
    //   break
    default: break
  }

  const [index1, index2] = getRandomIndeces(sortArray.length)

  const randomBg1 = sortArray[index1]
  const randomBg2 = sortArray[index2]

  return [randomBg1, randomBg2, {
    type: 'static'
  }]
}

function getRandomIndeces(dataLength) {
  const index1 = Math.floor(Math.random() * dataLength)
  const random2 = Math.floor(Math.random() * dataLength)

  // Check if it's same so we don't send 2 same pictures
  const index2 = random2 !== index1
    ? random2
    : random2 > 0
      ? random2 - 1
      : random2 + 1

  return [index1, index2]
}
