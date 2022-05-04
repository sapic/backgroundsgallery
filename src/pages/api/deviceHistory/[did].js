import withDatabase from '../../../lib/database'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bgs = require('../../../assets/bgs_full.json')

export default withDatabase(async function handler (req, res) {
  const { did } = req.query

  if (!did || did === '') {
    return res.send([])
  }

  const votes = req.db('votes')
  const docs = await votes.where({ deviceId: did }).sort('created_at', 'DESC')

  const result = docs.map(d => bgs.find(bg => bg.url === d.url)).filter(d => d)

  res.send(result)
})
