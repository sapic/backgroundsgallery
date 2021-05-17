import withCors from '@/lib/withCors'
import Cacher, { parseWithGameId } from '@/lib/votesCacher'

const cacher = new Cacher({
  cacheTime: 60 * 60 * 1000,// 1 hour
  refreshTime: 30 * 60 * 1000,// 30 mins
  parseFunction: parseWithGameId,
})


export default withCors(async function handler(req, res) {
  const { gameId } = req.query

  if (!gameId || gameId === '') {
    return res.send([])
  }

  const items = await cacher.getItems()

  const bgs = items.games[gameId] || []
  let name = null
  if (bgs.length > 0) {
    name = bgs[0].game
  }

  res.send({
    name,
    items: bgs
  })
})
