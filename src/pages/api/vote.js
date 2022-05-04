import withPassport from '../../lib/withPassport'
import withDatabase from '../../lib/database'

const disableVoting = !!process.env.DISABLE_VOTING

export default withDatabase(withPassport(async (req, res) => {
  console.log('with db')
  res.statusCode = 200
  res.json({ status: 'ok' })

  let { item, views: bgs } = JSON.parse(req.body)

  const userId = req?.user?.id
  const isAnimated = bgs[2] && bgs[2].type && bgs[2].type === 'animated'

  if (bgs.length > 2) {
    bgs = [bgs[0], bgs[1]]
  }

  console.log('x')

  const votesCollectionName = isAnimated ? 'votes_animated' : 'votes'
  const votesTotalCollectionName = isAnimated ? 'votes_total_animated' : 'votes_total'
  const viewsCollectionName = isAnimated ? 'views_animated' : 'views'

  const votes = req.db(votesCollectionName)
  const votesTotal = req.db(votesTotalCollectionName)
  const views = req.db(viewsCollectionName)

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
        user_id: userId
      }

      if (deviceId) {
        toInsert.device_id = deviceId
      }

      await votes.insert(toInsert)

      await votesTotal.insert({
        url: item.url,
        votes: 1
      }).onConflict('url').merge({
        votes: req.db.raw('EXCLUDED.votes + 1')
      })
    } else {
      // animated
      const toInsert = {
        appid: item.appid,
        defid: item.defid,
        user_id: userId
      }

      if (deviceId) {
        toInsert.device_id = deviceId
      }

      await votes.insert(toInsert)

      await votesTotal.insert({
        appid: item.appid,
        defid: item.defid,
        votes: 1
      }).onConflict(['appid', 'defid']).merge({
        votes: req.db.raw('EXCLUDED.votes + 1')
      })

      // const query = {
      //   appid: item.appid,
      //   defid: item.defid
      // }
      // const update = {
      //   $set: {
      //     appid: item.appid,
      //     defid: item.defid
      //   },
      //   $inc: {
      //     votes: 1
      //   }
      // }
      // const options = { upsert: true }

      // votesTotal.updateOne(query, update, options)
    }
  }

  if (!isAnimated) {
    // static
    for (const bg of bgs) {
      await views.insert({
        url: bg.url,
        views: 1
      }).onConflict('url').merge({
        views: req.db.raw('EXCLUDED.views + 1')
      })
      // const query = { url: bg.url }
      // const update = {
      //   $set: {
      //     url: bg.url
      //   },
      //   $inc: {
      //     views: 1
      //   }
      // }
      // const options = { upsert: true }

      // views.updateOne(query, update, options)
    }
  } else {
    // animated
    for (const bg of bgs) {
      await views.insert({
        appid: bg.appid,
        defid: bg.defid,
        views: 1
      }).onConflict(['appid', 'defid']).merge({
        views: req.db.raw('EXCLUDED.views + 1')
      })
      // const query = {
      //   appid: bg.appid,
      //   defid: bg.defid
      // }
      // const update = {
      //   $set: {
      //     appid: bg.appid,
      //     defid: bg.defid
      //   },
      //   $inc: {
      //     views: 1
      //   }
      // }
      // const options = { upsert: true }

      // views.updateOne(query, update, options)
    }
  }
}))
