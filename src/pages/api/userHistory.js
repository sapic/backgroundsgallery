import withDatabase from '@/lib/database'
import withPassport from '@/lib/withPassport'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bgs = require('@/assets/bgs_full.json')

export default withDatabase(withPassport(async function handler (req, res) {
  if (!req.user || !req.user.id) {
    return res.send([])
  }

  const votes = req.db.collection('votes')
  const docs = await votes.find({ user_id: req.user.id }).sort({ _id: -1 }).toArray()

  const result = docs.map(d => bgs.find(bg => bg.url === d.url)).filter(d => d)

  res.send(result)
}))
