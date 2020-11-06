import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb+srv://truecarry:2RRugg%23%21MU%23UHN.t@cluster0.qonxy.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function database(req, res, next) {
  if (!client.isConnected()) await client.connect();

  req.dbClient = client;
  req.db = client.db('test');

  return next()
}

export default fn => (req, res) =>
  database(req, res, () => fn(req, res))

