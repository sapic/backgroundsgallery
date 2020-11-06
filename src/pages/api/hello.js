// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import withPassport, { passport } from '../../lib/withPassport'
import withDatabase from '../../lib/database'

export default withDatabase(withPassport(async (req, res) => {
  const balls = req.db.collection('balls')
  const ball = await balls.findOne()

  res.statusCode = 200
  res.json({ name: 'John Doe', user: req.user, ball })
}))
