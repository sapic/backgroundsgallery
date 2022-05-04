import withCors from '../../lib/withCors.ts'
import withCacher from '../../lib/withCacher.ts'

export default withCacher(withCors(async function handler (req, res) {
  const { gameId } = req.query

  if (!gameId || gameId === '') {
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
