const { MongoClient } = require('mongodb')
const dotenv = require('dotenv')
const Knex = require('knex')

dotenv.config({
  path: '.env.local',
})

const mongoUrl = process.env.MONGO_URL || ''

// console.log('url', process.env)

const client = new MongoClient(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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

async function main () {
  await client.connect()
  const db = client.db('test')
  const views = db.collection('views')
  const viewsAnimated = db.collection('views_animated')

  const tx = await knex.transaction()

  const viewsDocs = await views.find().toArray()

  // for (const view of viewsDocs) {
  await tx('views').insert(viewsDocs.map(view => ({
    url: view.url,
    views: view.views,
  }))).onConflict().ignore()
  // }

  const viewsAnimatedDocs = await viewsAnimated.find().toArray()
  // for (const view of viewsAnimatedDocs) {
  await tx('views_animated').insert(viewsAnimatedDocs.map(view => ({
    appid: view.appid,
    defid: view.defid,
    views: view.views,
  }))).onConflict().ignore()
  // }

  console.log('views_animated')

  const votesDocs = await db.collection('votes').find().toArray()
  // for (const vote of votesDocs) {
  await tx.batchInsert('votes', votesDocs.map(vote => ({
    url: vote.url,
    user_id: vote.user_id,
    device_id: vote.deviceId,
    created_at: vote._id.getTimestamp(),
  })), 1000)
  // }

  console.log('votes')

  const votesAnimatedDocs = await db.collection('votes_animated').find().toArray()
  // for (const vote of votesAnimatedDocs) {
  await tx.batchInsert('votes_animated', votesAnimatedDocs.map(vote => ({
    appid: vote.appid,
    defid: vote.defid,
    user_id: vote.user_id,
    device_id: vote.deviceId,
    created_at: vote._id.getTimestamp(),
  })))
  // }
  // .onConflict().ignore()

  console.log('votes_animated')

  const votesTotalDocs = await db.collection('votes_total').find().toArray()
  for (const vote of votesTotalDocs) {
    await tx('votes_total').insert({
      url: vote.url,
      votes: vote.votes,
    })
  }

  const votesTotalAnimatedDocs = await db.collection('votes_total_animated').find().toArray()
  for (const vote of votesTotalAnimatedDocs) {
    await tx('votes_total_animated').insert({
      appid: vote.appid,
      defid: vote.defid,
      votes: vote.votes,
    })
  }

  const animatedBgsDocs = await db.collection('animated_bgs').find().toArray()
  for (const bg of animatedBgsDocs) {
    await tx('animated_bgs').insert({
      appid: bg.appid,
      defid: bg.defid,

      type: bg.type,
      communityItemClass: bg.communityItemClass,
      communityItemType: bg.communityItemType,
      pointCost: bg.pointCost,
      timestampCreated: bg.timestampCreated,
      timestampUpdated: bg.timestampUpdated,
      timestampAvailable: bg.timestampAvailable,
      quantity: bg.quantity,
      internalDescription: bg.internalDescription,
      active: bg.active,
      communityItemData: bg.communityItemData,

      timestampAvailableEnd: bg.timestampAvailableEnd,
      usableDuration: bg.usableDuration,
      bundleDiscount: bg.bundleDiscount,
    })
  }

  await tx.commit()
  await client.close()
  await knex.destroy()
}

main()
