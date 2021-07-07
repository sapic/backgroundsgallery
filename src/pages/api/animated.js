import withDatabase from '../../lib/database'

export default withDatabase(async (req, res) => {
  console.log('animated.js')
  const animatedBgs = req.db.collection('animated_bgs')

  const bgs = await animatedBgs.find({}).toArray()
  console.log('bgs')

  res.send(bgs)
})
