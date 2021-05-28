import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function database(req, res, next) {
  if (!client.isConnected()) await client.connect();

  req.dbClient = client;
  req.db = client.db('test');

  return next()
}

async function getDatabaseClient() {
  return client
}

export default fn => (req, res) =>
  database(req, res, () => fn(req, res))

export {
  getDatabaseClient
}
