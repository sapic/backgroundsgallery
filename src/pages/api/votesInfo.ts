import withCors from '@/lib/withCors'
import withCacher from '@/lib/withCacher'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const itemsCache = await req.Cacher.getItems()

  res.setHeader('Random-Cache-Updated', itemsCache.lastUpdate)

  res.send(itemsCache.items)
}

export default withCors(withCacher(handler))
