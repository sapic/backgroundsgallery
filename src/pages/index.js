import Head from 'next/head'
import styles from '../styles/Home.module.css'
import clsx from 'clsx';

import { useIdentity } from '../lib/withIdentity'

export default function Home() {
  const identity = useIdentity()
  console.log('identity', identity)

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div >
  )
}
