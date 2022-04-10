
// import { NextApiResponse, NextApiRequest } from 'next'
import withPassport, { passport } from '../../../lib/withPassport'

const handler = (req, res) => {
  passport.authenticate('steam')(req, res, (...args) => {
    // console.log('passport authenticated', args)
  })
}

export default withPassport(handler)
