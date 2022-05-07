// const root = require('./compiled.js')
import axios from 'axios'
// const getEncodedParams = require('./utils/getEncodedParams')
import fs from 'fs'

// const {
//   CLoyaltyRewards_QueryRewardItems_Request,
//   CLoyaltyRewards_QueryRewardItems_Response,
// } = root

// const baseSendObj = {
//   communityItemClasses: [3],
//   count: 1000,
// }

const url = 'https://api.steampowered.com/ILoyaltyRewardsService/QueryRewardItems/v1/?'
async function main () {
  let cursor
  let total: any[] = []

  while (true) {
    const params = new URLSearchParams()
    params.set('community_item_classes[0]', '3')
    params.set('count', '1000')
    if (cursor) {
      params.set('cursor', cursor)
    }

    // params.set('community_item_classes', '[3]')
    // const toSend = {
    //   ...baseSendObj,
    //   cursor,
    // }
    const { data } = await axios.get(`${url}${params.toString()}`, {
      // responseType: 'arraybuffer',
    })
    // console.log('got data', data)
    // process.exit(0)
    // const decoded = CLoyaltyRewards_QueryRewardItems_Response.decode(data)
    // console.log('decoded', decoded)

    console.log('total', total.length, data.response.next_cursor)

    if (!data.response.definitions || data.response.definitions.length === 0) {
      break
    } else {
      total = total.concat(data.response.definitions)
    }

    if (data.response.next_cursor) {
      console.log('set cursor', data.response.total_count, data.response.count)
      cursor = data.response.next_cursor
    } else {
      break
    }
  }

  const animated = total.filter(bg => {
    return bg.community_item_data.animated
  })
  const still = total.filter(bg => {
    return !bg.community_item_data.animated
  })

  fs.writeFileSync('./utils/data/bgs.json', JSON.stringify(total))
  fs.writeFileSync('./utils/data/animated.json', JSON.stringify(animated))
  fs.writeFileSync('./utils/data/static.json', JSON.stringify(still))
}
main()
