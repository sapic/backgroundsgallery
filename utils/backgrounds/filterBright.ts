import fs from 'fs'

const allBackgrounds = require('../data/bgs_with_points.json')

const filtered = allBackgrounds.filter(b => {
  // Don't include image if no hls info
  if (!b.hls || b.hls.length !== 3) {
    return false
  }

  // // Don't include image if it's too dark
  if (b.hls[1] <= 30 || b.hls[2] <= 20) {
    return false
  }

  return true
})

console.log('filtered bgs', filtered.length)
fs.writeFileSync('./utils/data/filtered.json', JSON.stringify(filtered))
