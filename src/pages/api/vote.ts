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

  const votesStatic = req.db('votes')
  const votesTotalStatic = req.db('votes_total')
  const viewsStatic = req.db('views')
  const votesAnimated = req.db('votes_animated')
  const votesTotalAnimated = req.db('votes_total_animated')
  const viewsAnimated = req.db('views_animated')

  const deviceId = req.headers['device-id']

  if (disableVoting) {
    console.log('disable voting true')
    return
  }

  if (item) {
    if (!isAnimated) {
      // static
      const toInsert: any = {
        url: item.url,
        user_id: userId,
      }

      if (deviceId) {
        toInsert.device_id = deviceId
      }

      await votesStatic.insert(toInsert)

      await votesTotalStatic.insert({
        url: item.url,
        votes: 1,
      }).onConflict('url').merge({
        votes: req.db.raw('votes_total.votes + 1'),
      })
    } else {
      // animated
      const toInsert: any = {
        appid: item.appid,
        defid: item.defid,
        user_id: userId,
      }

      if (deviceId) {
        toInsert.device_id = deviceId
      }

      await votesAnimated.insert(toInsert)

      await votesTotalAnimated.insert({
        appid: item.appid,
        defid: item.defid,
        votes: 1,
      }).onConflict(['appid', 'defid']).merge({
        votes: req.db.raw('votes_total_animated.votes + 1'),
      })
    }
  }

  if (!isAnimated) {
    // static
    for (const bg of bgs) {
      await viewsStatic.insert({
        url: bg.url,
        views: 1,
      }).onConflict('url').merge({
        views: req.db.raw('views.views + 1'),
      })
    }
  } else {
    // animated
    for (const bg of bgs) {
      await viewsAnimated.insert({
        appid: bg.appid,
        defid: bg.defid,
        views: 1,
      }).onConflict(['appid', 'defid']).merge({
        views: req.db.raw('views_animated.views + 1'),
      })
    }
  }
}))
