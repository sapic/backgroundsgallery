import Knex from 'knex'

// const client = new MongoClient(process.env.MONGO_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const knex = Knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'postgres',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    password: process.env.DB_PASS || 'test',
    database: process.env.DB_NAME || 'bgbattle',
  },
})

async function database(req, res, next) {
  // if (!client.isConnected()) await client.connect();

  // req.dbClient = client;
  req.db = knex

  return next()
}

async function getDatabaseClient() {
  return knex
}

const withDatabase = (fn) => (req, res) => database(req, res, () => fn(req, res))

export default withDatabase

export { getDatabaseClient }
