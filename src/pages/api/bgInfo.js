import withCors from '@/lib/withCors'
import Cacher, { parseToObject } from '@/lib/votesCacher'

const bgs = require('@/assets/bgs_full.json')

const cacher = new Cacher({
  cacheTime: 60 * 60 * 1000,// 1 hour
  refreshTime: 30 * 60 * 1000,// 30 mins
  parseFunction: parseToObject,
})

export default withCors(async (req, res) => {
  const itemsCache = await cacher.getItems()
  const [left, ...rest] = req.query.url.split('-')

  const toEncode = rest.join('-')
  const encoded = encodeURIComponent(toEncode)
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/'/g, '%27')
    .replace(/!/g, '%21')

  const combined = `${left}-${encoded}`

  if (itemsCache.items[combined]) {
    return res.send(itemsCache.items[combined])
  }

  console.log('not found', combined, req.query.url)

  const found = bgs.find(bg => bg.url === combined)
  return res.send(found || {})
})
