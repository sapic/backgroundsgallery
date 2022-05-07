// const { MongoClient } = require('mongodb')
import dotenv from 'dotenv'
import camelcaseKeys from 'camelcase-keys'
const bgs = require('../data/animated.json')
const Knex = require('knex')

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
  let i = 0
  for (const bg of bgs) {
    i++
    try {
      const res = await knex('animated_bgs').insert(camelcaseKeys(bg, { deep: true }))
      console.log('bg', res, i, bg)
    } catch (e) {
      console.log('error', e)
    }
  }

  process.exit(0)
}

main()
