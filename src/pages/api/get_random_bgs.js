const bgs = require('../../assets/bgs.json')

export default (req, res) => {
  const bgKeys = Object.keys(bgs)
  const randomBg1 = bgs[bgKeys[Math.floor(Math.random() * bgKeys.length)]]
  const randomBg2 = bgs[bgKeys[Math.floor(Math.random() * bgKeys.length)]]

  res.send([randomBg1, randomBg2])
}