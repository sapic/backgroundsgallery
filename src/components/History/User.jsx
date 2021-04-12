import { Row } from './Row'

import clsx from 'clsx';

import useFetch from 'use-http'

function User(props) {
  const { className } = props
  let rows = []
  const options = {} // these options accept all native `fetch` options\

  let { data = [] } = useFetch(`/api/userHistory`, options, [])

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
    <div className={clsx([
      className,
      "bg-gray-900 py-2 px-4 rounded mt-2"
    ])}>
      <h1 className="text-white">View your Steam ID votes history</h1>
    </div>
    {rows.map((row) => <Row row={row} />)}
  </>
  )
}

export { User }
