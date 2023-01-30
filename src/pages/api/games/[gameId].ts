import withCors from '@/lib/withCors'
import withCacher from '@/lib/withCacher'
import type { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { gameId } = req.query

  if (!gameId || gameId === '' || Array.isArray(gameId)) {
    return res.send([])
  }

  const items = await req.Cacher.getItems()

  const bgs = items.games[gameId] || []
  let name = null
  if (bgs && bgs.static && bgs.static.length > 0) {
    name = bgs.static[0].game
  } else if (bgs && bgs.animated && bgs.animated.length > 0) {
    name = bgs.animated[0].game
  }

  res.send({
    name,
    ...bgs,
  })
}

export default withCacher(withCors(handler))
