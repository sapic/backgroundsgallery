import withCors from '../../lib/withCors.ts'
import withCacher from '../../lib/withCacher.ts'

const allowedTypes = [0, 1, 2]

export default withCacher(withCors(async (req, res) => {
  const itemsCache = await req.Cacher.getItems()
  let { limit, offset, sort } = req.query
  limit = parseInt(limit)
  offset = parseInt(offset)
  sort = parseInt(sort)

  if (typeof limit !== 'number' || limit < 0 || limit > 100000 || isNaN(limit)) {
    limit = 100
  }

  if (typeof offset !== 'number' || offset < 0 || isNaN(offset)) {
    offset = 0
  }

  if (typeof sort !== 'number' || !allowedTypes.includes(sort) || isNaN(sort)) {
    sort = 0
  }

  const count = itemsCache.items.length
  if (offset > count - 1) {
    return res.send({
      items: [],
      meta: {
        limit,
        offset,
        sort,
        count: itemsCache.items.length,
      },
    })
  }

  const sortToReturn = sort === 0
    ? itemsCache.ratingAscSort
    : sort === 1
      ? itemsCache.votesAscSort
      : itemsCache.viewsAscSort

  let start = count - (offset + limit)
  if (start < 0) {
    start = 0
  }
  const end = count - offset

  res.send({
    items: sortToReturn.slice(start, end).reverse(),
    meta: {
      limit,
      offset,
      sort,
      count: itemsCache.items.length,
    },
  })
}))
