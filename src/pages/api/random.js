export default async (req, res) => {
  const bgs = await getBgItems()

  const index1 = Math.floor(Math.random() * bgs.length)
  const random2 = Math.floor(Math.random() * bgs.length)

  // Check if it's same so we don't send 2 same pictures
  const index2 = random2 !== index1
    ? random2
    : random2 > 0
      ? random2 - 1
      : random2 + 1

  const randomBg1 = bgs[index1]
  const randomBg2 = bgs[index2]
  const resbgs = [randomBg1, randomBg2]


  res.send(resbgs)
}

let itemsCache = {
  items: [],
  lastUpdate: 0,
}
const cacheTime = 60 * 60 * 1000 // 1 hour

async function getBgItems() {
  if (Date.now() - itemsCache.lastUpdate < cacheTime) {
    return itemsCache.items
  }

  const response = await fetch('http://localhost:3000/api/getBgsForRandom').then(r => r.json())
  if (!response.items) {
    throw new Error('response error')
  }

  itemsCache.items = response.items
  itemsCache.lastUpdate = Date.now()

  return itemsCache.items
}
