import withCors from '@/lib/withCors'
import withCacher from '@/lib/withCacher'
import { NextApiRequest, NextApiResponse } from 'next'

export default withCacher(
  withCors(async (req: NextApiRequest, res: NextApiResponse) => {
    const items = await req.Cacher.getItems()

    const animatedTypeRandom = Math.floor(Math.random() * 10)
    const returnType = animatedTypeRandom < 3 // 0 - animated, 1-9 - static 30% for now

    const resbgs = returnType ? getAnimatedBackgrounds(items) : getStaticBackgrounds(items)

    res.setHeader('Random-Type', returnType.toString())
    res.setHeader('Random-Cache-Updated', req.Cacher.lastUpdate)

    res.send(resbgs)
  })
)

function getAnimatedBackgrounds(itemsCache) {
  const backgrounds: any[] = []
  while (true) {
    if (backgrounds.length === 2) {
      break
    }

    const index = Math.floor(Math.random() * itemsCache.animated.length)
    const randomBg = itemsCache.animated[index]

    if (
      (backgrounds[0] && backgrounds[0].defid === randomBg.defid) ||
      (randomBg.views > 100 && randomBg.goodness < 0.1)
    ) {
      continue
    }

    backgrounds.push(randomBg)
  }

  return [
    backgrounds[0],
    backgrounds[1],
    {
      type: 'animated',
    },
  ]
}

function getStaticBackgrounds(itemsCache) {
  const returnRatingType = Math.floor(Math.random() * 3)
  let sortArray

  switch (returnRatingType) {
    case 0:
      // 1000 most popular after first 1000(votes/views)
      sortArray = itemsCache.ratingAscSort.slice(
        itemsCache.ratingAscSort.length - 2000,
        itemsCache.ratingAscSort.length - 1000
      )
      // sortArray = items.viewsAscSort.slice(0, 1000) // 1000 least viewed bgs
      break
    case 1:
      sortArray = itemsCache.viewsAscSort.slice(0, 1000) // 1000 least viewed bgs

      // 1000 most voted
      // sortArray = itemsCache.votesAscSort.slice(itemsCache.votesAscSort.length - 1000)

      // 1000 most popular(votes/views)
      // sortArray = itemsCache.ratingAscSort.slice(itemsCache.ratingAscSort.length - 1000)
      break
    case 2:
      sortArray = itemsCache.ratingAscSort.slice(itemsCache.ratingAscSort.length - 1000)
      break
    //   // 1000 most popular(votes/views)
    //   sortArray = itemsCache.ratingAscSort.slice(itemsCache.ratingAscSort.length - 1000)
    //   break
    default:
      break
  }

  const backgrounds: any[] = []
  while (true) {
    if (backgrounds.length === 2) {
      break
    }

    const index = Math.floor(Math.random() * sortArray.length)
    const randomBg = sortArray[index]

    if (
      (backgrounds[0] && backgrounds[0].url === randomBg.url) ||
      (randomBg.views > 100 && randomBg.goodness < 0.1)
    ) {
      continue
    }

    backgrounds.push(randomBg)
  }

  return [
    backgrounds[0],
    backgrounds[1],
    {
      type: 'static',
    },
  ]
}
