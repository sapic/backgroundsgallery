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
  // const i = 0
  const rows = bgs.map(bg => ({
    url: bg.url,
    views: 0,
  }))

  const chunks = chunk(rows, 1000)

  for (const items of chunks) {
    await knex('views').insert(items).onConflict().ignore()
  }

  // for (const bg of bgs) {
  //   i++

  //   // await knex.batchInsert('views', rows, 100)
  //   await knex('views').insert({
  //     url: bg.url,
  //     views: 0,
  //   }).onConflict().ignore()

  //   console.log('bg', i)
  // }

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
