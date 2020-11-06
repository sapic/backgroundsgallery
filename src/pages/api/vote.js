import withPassport from '../../lib/withPassport'
import withDatabase from '../../lib/database'

export default withDatabase(withPassport(async (req, res) => {

  const { item } = JSON.parse(req.body)
  const userId = req?.user?.id

  console.log('body', item, userId)

  const votes = req.db.collection('votes')
  const votesTotal = req.db.collection('votes_total')
  // const ball = await balls.findOne()
  votes.insertOne({
    url: item.url,
    user_id: userId,
  })

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

  res.statusCode = 200
  res.json({ name: 'John Doe', user: req.user })
}))
