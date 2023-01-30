import Head from 'next/head'
import { appWithTranslation } from 'next-i18next'
import { Provider } from 'use-http'
import { apiUrl } from '../lib/getApiUrl'

import '../styles/globals.css'
import withIdentity from '../lib/withIdentity'

const identity = withIdentity as any

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <Provider url={apiUrl}>
        <Component {...pageProps} />
      </Provider>
    </>
  )
}

export default appWithTranslation(identity(MyApp))
