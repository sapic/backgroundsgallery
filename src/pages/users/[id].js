import Head from 'next/head'
import { useState } from 'react'
import clsx from 'clsx';

export default function User() {
  const [selected, setSelected] = useState(0)
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

    </div >
  )
}