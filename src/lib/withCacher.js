import Cacher, {
  parseWithSorts,
  parseWithGameId,
  parseToObject
} from './votesCacher'

const cacher = new Cacher({
  cacheTime: 60 * 60 * 1000,// 1 hour
  refreshTime: 30 * 60 * 1000,// 30 mins
  parseFunctions: [
    parseWithSorts,
    parseWithGameId,
    parseToObject
  ],
})

// export middleware to wrap api/auth handlers
export default fn => (req, res) => {
  return new Promise(resolve => {
    req.Cacher = cacher
    resolve(fn(req, res))
  })
}
