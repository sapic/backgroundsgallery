import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { apiUrl } from '@/lib/getApiUrl'
import Head from 'next/head'
// import Image from 'next/image'
import Header from '@/components/Header'

function Background({ bgInfo }) {
  return <div className="bg-black">
    <Head>
      <title>Backgrounds.Steam.Design | Best Steam Backgrounds | History</title>

      <meta name="twitter:url" key="twitterurl" content="https://bgs.steam.design/" />
      <meta name="twitter:title" key="twittertitle" content="Backgrounds.Steam.Design | History" />

      <meta property="og:title" key="ogtitle" content="Backgrounds.Steam.Design | History" />
      <meta property="og:url" key="ogurl" content="https://bgs.steam.design/" />

      <link rel="alternate" hrefLang="en" href="https://bgs.steam.design/en/" />
      <link rel="alternate" hrefLang="ru" href="https://bgs.steam.design/ru/" />
    </Head>

    <Header />

    <div className="w-full flex pt-16 max-w-screen-sm sm:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl mx-auto flex-col relative">
      <img src={bgInfo.steamUrl} alt=""></img>
      {/* {deviceId && <DeviceHistory deviceId={deviceId} />}
      {identity && <UserHistory identity={identity} className={deviceId && 'mt-16'} />} */}
    </div>
  </div >
}

export async function getServerSideProps({ locale, params }) {
  let bgInfo = {}
  const url = encodeURIComponent(`${params.appid}/${params.name}`)
  console.log('url', `${apiUrl}/api/bgInfo?url=${url}`)
  try {
    bgInfo = await fetch(`${apiUrl}/api/bgInfo?url=${url}`).then(r => r.json())
  } catch (e) {
    console.log('get bgs server side error', e)
  }

  return {
    props: {
      // startTop: top,
      bgInfo,

      ...await serverSideTranslations(locale, ['common']),
    }, // will be passed to the page component as props
  }
}


export default Background