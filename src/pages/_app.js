import '../styles/globals.css'
import withIdentity from '../lib/withIdentity'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default withIdentity(MyApp)
