import Head from 'next/head'

import Header from '../components/Header'
import { DeviceHistory, UserHistory } from '../components/History'
import { useIdentity } from '@/lib/withIdentity'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useCookies } from 'react-cookie'

function History() {
  const identity = useIdentity()

  const [cookies] = useCookies(['bgsspid']);
  const deviceId = cookies.bgsspid

  return (
    <div className="bg-black">
      <Head>
        <title>Backgrounds.Steam.Design | Best Steam Backgrounds | History</title>
        <link rel="alternate" hrefLang="en" href="https://bgs.steam.design/en/" />
        <link rel="alternate" hrefLang="ru" href="https://bgs.steam.design/ru/" />
      </Head>

      <Header />

      <div className="w-full flex pt-16 max-w-screen-sm sm:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl mx-auto flex-col relative">
        {deviceId && <DeviceHistory deviceId={deviceId} />}
        {identity && <UserHistory identity={identity} className={deviceId && 'mt-16'} />}
      </div>
    </div >
  )
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...await serverSideTranslations(locale, ['common']),
    }, // will be passed to the page component as props
  }
}

export default History