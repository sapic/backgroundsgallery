import withCors from '../../lib/withCors'
import withCacher from '../../lib/withCacher'

export default withCacher(withCors(async (req, res) => {
  const itemsCache = await req.Cacher.getItems()
  res.send(itemsCache.animated)
}))
