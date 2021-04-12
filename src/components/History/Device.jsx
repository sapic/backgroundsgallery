import { Row } from './Row'

import useFetch from 'use-http'

function Device(props) {
  const { deviceId } = props
  console.log('deviceId', deviceId)
  let rows = []
  const options = {} // these options accept all native `fetch` options\

  let { data = [] } = useFetch(`/api/deviceHistory/${deviceId}`, options, [])

  const r = []
  let j = 0;
  const itemsPerRow = typeof window !== 'undefined'
    ? window.innerWidth < 560
      ? 2
      : 4 // default 4
    : 4

  for (let i = 0; i < data.length; i++) {
    if (i % itemsPerRow === 0) {
      r[j] = []
      j++
    }

    r[j - 1].push(data[i])
  }

  rows = r

  return (<>
    <div className="bg-gray-900 py-2 px-4 rounded mt-2">
      <h1 className="text-white">View your Device votes history</h1>
    </div>
    {rows.map((row, i) => <Row row={row} key={i} />)}
  </>
  )
}

export { Device }
