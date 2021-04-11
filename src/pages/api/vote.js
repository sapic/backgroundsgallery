import withPassport from '../../lib/withPassport'
import withDatabase from '../../lib/database'

export default withDatabase(withPassport(async (req, res) => {
  res.statusCode = 200
  res.json({ status: 'ok' })

  const { item, views: bgs } = JSON.parse(req.body)
  const userId = req?.user?.id

  // console.log('body', item, userId)

  const votes = req.db.collection('votes')
  const votesTotal = req.db.collection('votes_total')
  const views = req.db.collection('views')

  const deviceId = req.headers['device-id']


  if (item) {
    const toInsert = {
      url: item.url,
      user_id: userId,
      deviceId,
    }

    if (deviceId) {
      toInsert.deviceId = deviceId
    }

    votes.insertOne(toInsert)

    const query = { url: item.url };
    const update = {
      $set: {
        url: item.url,
      },
      $inc: {
        votes: 1
      }
    };
    const options = { upsert: true };

    votesTotal.updateOne(query, update, options);
  }

  for (const bg of bgs) {
    // console.log('adding views to bg', bg.url)
    const query = { url: bg.url };
    const update = {
      $set: {
        url: bg.url,
      },
      $inc: {
        views: 1
      }
    };
    const options = { upsert: true };

    views.updateOne(query, update, options);
  }
}))
