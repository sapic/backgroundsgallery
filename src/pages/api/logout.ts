import withPassport from '@/lib/withPassport'

export default withPassport((req, res) => {
  req.logout()
  res.redirect('/')
})
