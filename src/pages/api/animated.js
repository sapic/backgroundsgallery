import withCors from '../../lib/withCors.ts'
import withCacher from '../../lib/withCacher.ts'

export default withCacher(withCors(async (req, res) => {
  const itemsCache = await req.Cacher.getItems()
  res.send(itemsCache.animated)
}))
