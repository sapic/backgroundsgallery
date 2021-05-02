import withCors from '@/lib/withCors'

const bgs = require('@/assets/bgs_full.json')

export default withCors(async (req, res) => {
  const [left, ...rest] = req.query.url.split('-')

  const toEncode = rest.join('')
  const encoded = encodeURIComponent(toEncode)
  const combined = `${left}-${encoded}`

  const found = bgs.find(bg => bg.url === combined)
  return res.send(found || {})
})
