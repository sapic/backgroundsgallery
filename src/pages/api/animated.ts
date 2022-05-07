import withCors from '../../lib/withCors'
import withCacher from '../../lib/withCacher'
import { NextApiRequest, NextApiResponse } from 'next'

export default withCacher(withCors(async (req: NextApiRequest, res: NextApiResponse) => {
  const itemsCache = await req.Cacher.getItems()
  res.send(itemsCache.animated)
}))
