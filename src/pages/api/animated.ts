import withCors from '../../lib/withCors'
import withCacher from '../../lib/withCacher'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const itemsCache = await req.Cacher.getItems()
  res.send(itemsCache.animated)
}

export default withCacher(withCors(handler))
