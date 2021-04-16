const bgs = require('./src/assets/bgs_full.json')

const index = 2
const max = bgs.reduce((max, item) => max > item.hls[index] ? max : item.hls[index], 0)
console.log('max', max)