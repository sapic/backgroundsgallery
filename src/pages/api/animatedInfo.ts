import withCors from '@/lib/withCors'
import withCacher from '@/lib/withCacher'
import type { NextApiRequest, NextApiResponse } from 'next'

export default withCacher(withCors(async (req: NextApiRequest, res: NextApiResponse) => {
  const itemsCache = await req.Cacher.getItems()

  if (!req.query.appid ||
    !req.query.defid ||
    Array.isArray(req.query.appid) ||
     Array.isArray(req.query.defid)) {
    return res.send({})
  }

  const appid = parseInt(req.query.appid)
  const defid = parseInt(req.query.defid)

  const item = itemsCache.animated.find(x => x.appid === appid && x.defid === defid)

  if (item) {
    return res.send(item)
  }

  console.log('not found', req.query)

  return res.send({})
}))
