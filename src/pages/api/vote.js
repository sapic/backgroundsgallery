import withPassport from '../../lib/withPassport'
import withDatabase from '../../lib/database'

const disableVoting = !!process.env.DISABLE_VOTING

export default withDatabase(withPassport(async (req, res) => {
  res.statusCode = 200
  res.json({ status: 'ok' })

  let { item, views: bgs } = JSON.parse(req.body)

  const userId = req?.user?.id
  const isAnimated = bgs[2] && bgs[2].type && bgs[2].type === 'animated'

  if (bgs.length > 2) {
    bgs = [bgs[0], bgs[1]]
  }

  const votesCollectionName = isAnimated ? 'votes_animated' : 'votes'
  const votesTotalCollectionName = isAnimated ? 'votes_total_animated' : 'votes_total'
  const viewsCollectionName = isAnimated ? 'views_animated' : 'views'

  const votes = req.db.collection(votesCollectionName)
  const votesTotal = req.db.collection(votesTotalCollectionName)
  const views = req.db.collection(viewsCollectionName)

  const deviceId = req.headers['device-id']

  if (disableVoting) {
    console.log('disable voting true')
    return
  }

  if (item) {
    if (!isAnimated) {
      // static
      const toInsert = {
        url: item.url,
        user_id: userId,
        deviceId
      }

      if (deviceId) {
        toInsert.deviceId = deviceId
      }

      votes.insertOne(toInsert)

      const query = { url: item.url }
      const update = {
        $set: {
          url: item.url
        },
        $inc: {
          votes: 1
        }
      }
      const options = { upsert: true }

      votesTotal.updateOne(query, update, options)
    } else {
      // animated
      const toInsert = {
        appid: item.appid,
        defid: item.defid,
        user_id: userId,
        deviceId
      }

      if (deviceId) {
        toInsert.deviceId = deviceId
      }

      votes.insertOne(toInsert)

      const query = {
        appid: item.appid,
        defid: item.defid
      }
      const update = {
        $set: {
          appid: item.appid,
          defid: item.defid
        },
        $inc: {
          votes: 1
        }
      }
      const options = { upsert: true }

      votesTotal.updateOne(query, update, options)
    }
  }

  if (!isAnimated) {
    // static
    for (const bg of bgs) {
      const query = { url: bg.url }
      const update = {
        $set: {
          url: bg.url
        },
        $inc: {
          views: 1
        }
      }
      const options = { upsert: true }

      views.updateOne(query, update, options)
    }
  } else {
    // animated
    for (const bg of bgs) {
      const query = {
        appid: bg.appid,
        defid: bg.defid
      }
      const update = {
        $set: {
          appid: bg.appid,
          defid: bg.defid
        },
        $inc: {
          views: 1
        }
      }
      const options = { upsert: true }

      views.updateOne(query, update, options)
    }
  }
}))
