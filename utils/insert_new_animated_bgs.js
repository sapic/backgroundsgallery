const { MongoClient } = require('mongodb')
const dotenv = require('dotenv')
const bgs = require('./animated.json')

dotenv.config({
  path: '../.env.local'
})

const mongoUrl = process.env.MONGO_URL || ''

const client = new MongoClient(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

console.log('l', bgs.length)
async function main () {
  if (!client.isConnected()) await client.connect()

  const db = client.db('test')
  const animatedBgs = db.collection('animated_bgs')

  let i = 0
  for (const bg of bgs) {
    i++
    try {
      const res = await animatedBgs.insert(bg)

      // const query = { url: bg.url };
      // const update = {
      //   $set: {
      //     url: bg.url,
      //   },
      //   $inc: {
      //     views: 0
      //   }
      // };
      // const options = { upsert: true };

      // await views.updateOne(query, update, options);
      console.log('bg', res, i)
    } catch (e) { }

    // if (i === 13000) {
    //   process.exit(0)
    // }
  }

  process.exit(0)
}

main()
