import withCors from '../../lib/withCors.ts'
import withCacher from '../../lib/withCacher.ts'

export default withCacher(withCors(async (req, res) => {
  const itemsCache = await req.Cacher.getItems()
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
}))
