const { MongoClient } = require('mongodb')
const dotenv = require('dotenv')
const bgs = require('../src/assets/bgs_full.json')

dotenv.config({
  path: '../.env.local'
})


const mongoUrl = process.env.MONGO_URL || ''

const client = new MongoClient(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


console.log('l', bgs.length)
async function main() {
  if (!client.isConnected()) await client.connect();

  const db = client.db('test')
  const views = db.collection('views')

  let i = 0
  for (const bg of bgs) {
    i++

    const query = { url: bg.url };
    const update = {
      $set: {
        url: bg.url,
      },
      $inc: {
        views: 0
      }
    };
    const options = { upsert: true };


    await views.updateOne(query, update, options);
    console.log('bg', i)
  }

  process.exit(0)
}

main()
