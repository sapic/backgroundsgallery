import withPassport from '../../lib/withPassport'
import withDatabase from '../../lib/database'

const bgs = require('../../assets/bgs_full.json')

export default withDatabase(withPassport(async (req, res) => {
  try {
    const views = req.db.collection('views')
    const docs = await views.find({}, {
      sort: { views: 1 }
    }).limit(1000).toArray()

    const items = docs.map(i => bgs.find(b => b.url === i.url)).filter(i => i)

    res.statusCode = 200
    res.json({ items })
  } catch (err) {
    console.log('error', err)
    res.statusCode = 500
    res.json({ status: 'error' })
  }
}))
