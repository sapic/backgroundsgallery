import withDatabase from '../../lib/database'
import withPassport from '../../lib/withPassport'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bgs = require('../../assets/bgs_full.json')

/**
 *
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 * @returns
 */
const handler = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.send([])
  }

  const votes = await req.db('votes').where('user_id', req.user.id)
    .orderBy('created_at', 'DESC')
    .select()

  // const docs = await votes.find({ user_id: req.user.id }).sort({ _id: -1 }).toArray()

  const result = votes.map(d => bgs.find(bg => bg.url === d.url)).filter(d => d)

  res.send(result)
}
export default withDatabase(withPassport(handler))
