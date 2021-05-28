import withCors from '@/lib/withCors'
import withCacher from '@/lib/withCacher'

export default withCors(withCacher(async (req, res) => {
  const itemsCache = await req.Cacher.getItems(req)

  res.setHeader('Random-Cache-Updated', itemsCache.lastUpdate)

  res.send(itemsCache.items)
}))
