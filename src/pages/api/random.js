// import withDatabase from '../../lib/maybeDatabase'
const bgs = require('../../assets/bgs.json')

// export default withDatabase((req, res) => {
export default (req, res) => {
  const bgKeys = Object.keys(bgs)
  const randomBg1 = bgs[bgKeys[Math.floor(Math.random() * bgKeys.length)]]
  const randomBg2 = bgs[bgKeys[Math.floor(Math.random() * bgKeys.length)]]
  const resbgs = [randomBg1, randomBg2]

  res.send(resbgs)

  if (req.db) {
    const views = req.db.collection('views')

    for (const bg of resbgs) {
      const query = { url: bg.url };
      const update = {
        $set: {
          url: bg.url,
        },
        $inc: {
          views: 1
        }
      };
      const options = { upsert: true };

      views.updateOne(query, update, options);
    }
  }
}
