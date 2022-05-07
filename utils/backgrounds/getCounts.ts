export {}

const bgs = require('../data/bgs.json')
const animated = require('../data/animated.json')
const still = require('../data/static.json')

console.log(`Total: ${bgs.filter(e => e.community_item_class === 3).length}, Animated: ${animated.length}, Static: ${still.length}`)
