import Head from 'next/head'
import { appWithTranslation } from 'next-i18next'
import withCookies from '@/lib/withCookies'

import '../styles/globals.css'
import withIdentity from '@/lib/withIdentity'

function MyApp({ Component, pageProps }) {
  return (<>
    {/* <CookiesProvider> */}
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    </Head>
    <Component {...pageProps} />
    {/* </CookiesProvider> */}
  </>)
}

export default appWithTranslation(
  withCookies(
    withIdentity(
      MyApp
    )
  )
)
