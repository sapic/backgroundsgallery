import Head from 'next/head'
import { appWithTranslation } from 'next-i18next'

import '../styles/globals.css'
import withIdentity from '@/lib/withIdentity'

function MyApp({ Component, pageProps }) {
  return (<>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    </Head>
    <Component {...pageProps} />
  </>)
}

export default appWithTranslation(
  withIdentity(
    MyApp
  )
)
