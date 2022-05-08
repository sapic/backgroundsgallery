import axios from 'axios'
import fs from 'fs'

const url = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/'

axios(url).then(({ data }) => {
  fs.writeFileSync('./utils/data/apps.json', JSON.stringify(data))
})
