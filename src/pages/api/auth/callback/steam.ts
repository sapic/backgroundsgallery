import { NextApiResponse, NextApiRequest } from 'next'
import withPassport, { passport } from '../../../../lib/withPassport'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  passport.authenticate('steam', {
    failureRedirect: '/auth',
    successRedirect: '/',
  })(req, res, () => {
    return true
  })
}

export default withPassport(handler)
