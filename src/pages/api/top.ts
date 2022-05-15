import withCors from '@/lib/withCors'
import withCacher from '@/lib/withCacher'
import { NextApiRequest, NextApiResponse } from 'next'

const allowedTypes = [0, 1, 2]

export default withCacher(withCors(async (req: NextApiRequest, res: NextApiResponse) => {
  const itemsCache = await req.Cacher.getItems()
  const { limit: qLimit, offset: qOffset, sort: qSort } = req.query
  let limit = parseInt(Array.isArray(qLimit) ? qLimit[0] : qLimit)
  let offset = parseInt(Array.isArray(qOffset) ? qOffset[0] : qOffset)
  let sort = parseInt(Array.isArray(qSort) ? qSort[0] : qSort)

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
    items: [...sortToReturn.slice(start, end)].reverse(),
    meta: {
      limit,
      offset,
      sort,
      count: itemsCache.items.length,
    },
  })
}))
