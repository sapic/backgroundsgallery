import axios from 'axios'
import fs from 'fs'

async function main () {
  const requestUrl = 'https://cdn.steam.tools/data/bg.json'

  const { data } = await axios.get(requestUrl, {
    headers: {
      referer: 'https://steam.tools/',
    },
  })
  fs.writeFileSync('./utils/data/steam_tools_backgrounds.json', JSON.stringify(data))
}
main()
