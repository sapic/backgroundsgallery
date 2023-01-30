import withCors from '@/lib/withCors'
import withCacher from '@/lib/withCacher'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const itemsCache = await req.Cacher.getItems()

  if (!req.query.url || typeof req.query.url !== 'string') {
    return res.send({})
  }

  const [left, ...rest] = req.query.url.split('-')

  const toEncode = rest.join('-')
  const encoded = encodeURIComponent(toEncode)
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/'/g, '%27')
    .replace(/!/g, '%21')

  const combined = `${left}-${encoded}`.toLowerCase()

  if (itemsCache.urls[combined]) {
    return res.send(itemsCache.urls[combined])
  }

  console.log('not found', combined, req.query.url)

  return res.send({})
}

export default withCacher(withCors(handler))
