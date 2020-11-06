import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function database(req, res, next) {
  try {
    if (!client.isConnected()) await client.connect();

    req.dbClient = client;
    req.db = client.db('test');
  } catch (err) {
    console.log('maybeDatabase error')
  }

  return next()
}

export default fn => (req, res) =>
  database(req, res, () => fn(req, res))


