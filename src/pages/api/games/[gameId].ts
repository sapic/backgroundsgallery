import withCors from '@/lib/withCors'
import withCacher from '@/lib/withCacher'
import type { NextApiRequest, NextApiResponse } from 'next'

export default withCacher(withCors(async function handler (req: NextApiRequest, res: NextApiResponse) {
  const { gameId } = req.query

  if (!gameId || gameId === '' || Array.isArray(gameId)) {
    return res.send([])
  }

  const items = await req.Cacher.getItems()

  const bgs = items.games[gameId] || []
  let name = null
  if (bgs.length > 0) {
    name = bgs[0].game
  }

  res.send({
    name,
    items: bgs,
  })
}))
