import withDatabase from '../../../lib/database'

const bgs = require('../../../assets/bgs_full.json')

export default withDatabase(async function handler(req, res) {
  const { did } = req.query

  if (!did || did === '') {
    return res.send([])
  }

  const votes = req.db.collection('votes')
  const docs = await votes.find({ deviceId: did }).sort({ _id: -1 }).toArray()

  const result = docs.map(d => bgs.find(bg => bg.url === d.url)).filter(d => d)

  res.send(result)
})
