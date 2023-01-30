// import { NextApiResponse, NextApiRequest } from 'next'
import type { NextApiRequest, NextApiResponse } from 'next'
import withPassport, { passport } from '../../../lib/withPassport'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  passport.authenticate('steam')(req, res, () => {
    // console.log('passport authenticated', args)
  })
}

export default withPassport(handler)
