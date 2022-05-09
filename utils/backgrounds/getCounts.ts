export {}

const bgs = require('../data/bgs.json')
const animated = require('../data/animated.json')
const still = require('../data/static.json')
const filtered = require('../data/filtered.json')

console.log(`Total: ${bgs.filter(e => e.community_item_class === 3).length}, Animated: ${animated.length}, Static: ${still.length}`)
console.log(`Filtered: ${filtered.length}, Filtered no bg: ${filtered.filter(f => !f.steamUrl).length}`)
