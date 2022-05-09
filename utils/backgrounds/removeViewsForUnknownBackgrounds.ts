import dotenv from 'dotenv'
import Knex from 'knex'

const bgs = require('../../src/assets/bgs.json')

dotenv.config({
  path: '../.env.local',
})

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

console.log('l', bgs.length)
async function main () {
  const existing = await knex('views').select()
  const notFound: any[] = []

  for (const inDb of existing) {
    let found = false
    for (const bg of bgs) {
      if (inDb.url === bg.url) {
        found = true
        break
      }
    }

    if (!found) {
      notFound.push(inDb)
    }
  }

  console.log('Not found bgs:', notFound, notFound.length)

  for (const nf of notFound) {
    await knex('views').where('url', nf.url).delete()
  }

  process.exit(0)
}

main()

function chunk<T> (arr: T[], len): T[][] {
  const chunks: T[][] = []
  let i = 0
  const n = arr.length

  while (i < n) {
    chunks.push(arr.slice(i, i += len))
  }

  return chunks
}
