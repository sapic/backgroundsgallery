// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// export default (req, res) => {
//   console.log('auth callback')
//   res.statusCode = 200
//   res.json({ name: 'John Doe' })
// }

// import { NextApiResponse, NextApiRequest } from 'next'
import withPassport, { passport } from '../../../../lib/withPassport'

const handler = async (req, res) => {
  // console.log('steam api callback')

  passport.authenticate('steam', {
    failureRedirect: '/auth',
    successRedirect: '/',
  })(req, res, () => {
    // console.log('auth callback', args)
    return true
  })
}

export default withPassport(handler)
