import withCors from '@/lib/withCors'
import withCacher from '@/lib/withCacher'

export default withCacher(withCors(async (req, res) => {
  const itemsCache = await req.Cacher.getItems()

  const appid = parseInt(req.query.appid)
  const defid = parseInt(req.query.defid)

  const item = itemsCache.animated.find(x => x.appid === appid && x.defid === defid)

  if (item) {
    return res.send(item)
  }

  console.log('not found', req.query)

  return res.send({})
}))
