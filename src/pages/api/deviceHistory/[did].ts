import withDatabase from '../../../lib/database'
import type { NextApiRequest, NextApiResponse } from 'next'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bgs = require('@/assets/bgs.json')

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { did } = req.query

  if (!did || did === '') {
    return res.send([])
  }

  const votes = req.db('votes')
  const docs = await votes.where({ device_id: did }).orderBy('created_at', 'DESC').select()

  const result = docs.map(d => bgs.find(bg => bg.url === d.url)).filter(d => d)

  res.send(result)
}

export default withDatabase(handler)
