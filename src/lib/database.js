import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function database(req, res, next) {
  console.log('init db')
  if (!client.isConnected()) await client.connect();
  console.log('db connected')

  req.dbClient = client;
  req.db = client.db('test');

  return next()
}

export default fn => (req, res) =>
  database(req, res, () => fn(req, res))

