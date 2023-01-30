import Cors from 'cors'

const cors = Cors({
  origin: '*',
  methods: ['GET', 'HEAD', 'POST', 'PUT'],
})

// export middleware to wrap api/auth handlers
const withCors = (fn) => (req, res) => {
  return new Promise((resolve) => {
    cors(req, res, () => {
      resolve(fn(req, res))
    })
  })
}

export default withCors
