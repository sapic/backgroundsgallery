import Cacher, {
  getBackgroundsData,
  getAnimatedData,
  getAppsData,

  parseWithSorts,
  parseWithGameId,
  parseToObject
} from './votesCacher'

import { getDatabaseClient } from './database'

const cacher = new Cacher({
  cacheTime: 60 * 60 * 1000, // 1 hour
  refreshTime: 30 * 60 * 1000, // 30 mins
  parseFunctions: [
    // get data
    getAppsData,
    getBackgroundsData,
    getAnimatedData,

    // add custom sorts
    parseWithSorts,
    parseWithGameId,
    parseToObject
  ],
  getDbClient: getDatabaseClient
})

// export middleware to wrap api/auth handlers
const withCacher = fn => (req, res) => {
  return new Promise(resolve => {
    req.Cacher = cacher
    resolve(fn(req, res))
  })
}

export default withCacher
