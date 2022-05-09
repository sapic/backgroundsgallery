import fs from 'fs'

const pointsBgs = require('../data/bgs.json')
const bgs = require('../data/steam_tools_backgrounds.json')
const bgsWithSteamUrl = require('../data/bgs_with_steam_url.json')

console.log('l', pointsBgs.length, bgs.length)

const result: any = []
let found = 0

for (const bg of bgs) {
  const appid = parseInt(bg.url.split('/')[1].split('-')[0])

  const name = bg.name.replace(/&amp;/, '&')

  const names = [name]

  if (name.indexOf(' (Profile Background)') !== -1) {
    names.push(name.replace(' (Profile Background)', ''))
  }

  let isFound = false

  for (const pointbg of pointsBgs) {
    if (appid === pointbg.appid) {
      const toCheck = [
        pointbg.internal_description,
        pointbg.community_item_data.item_name,
        pointbg.community_item_data.item_title,
        pointbg.community_item_data.item_description,
      ]

      for (const name of names) {
        if (toCheck.indexOf(name) !== -1) {
          found++
          isFound = true
          result.push({
            ...bg,
            defid: pointbg.defid,
            pointCost: pointbg.point_cost,
            // steamUrl: `https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/${pointbg.appid}/${pointbg.community_item_data.item_image_large}`,
          })

          break
        }
      }

      if (isFound) {
        break
      }
    }
  }

  if (!isFound) {
    result.push(bg)
  }
}

for (let i = 0; i < result.length; i++) {
  const bg = result[i]
  if (bg.steamUrl) continue

  for (const withUrl of bgsWithSteamUrl) {
    if (withUrl.url === bg.url) {
      bg.steamUrl = withUrl.url
      bg.iconUrl = withUrl.iconUrl
      result[i] = bg
      break
    }
  }
}

console.log('found', found)
fs.writeFileSync('./utils/data/bgs_with_points.json', JSON.stringify(result))
