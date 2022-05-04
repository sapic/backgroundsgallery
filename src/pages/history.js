import Head from 'next/head'

import Header from '../components/Header'
import { DeviceHistory, UserHistory } from '../components/History'
import { useIdentity } from '../lib/withIdentity'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useCookies } from 'react-cookie'
import { useTranslation } from 'next-i18next'

function History () {
  const identity = useIdentity()
  const { t } = useTranslation()

  const [cookies] = useCookies(['bgsspid'])
  const deviceId = cookies.bgsspid

  const description = 'Best steam backgrounds collection! Find your favorite! Your votes history.'

  return (
    <div className="bg-black">
      <Head>
        <title>{t('seo.title.history')}</title>
        <meta name="description" key="description" content={description} />

        <meta name="twitter:url" key="twitterurl" content="https://backgrounds.gallery/history" />
        <meta name="twitter:title" key="twittertitle" content="Backgrounds.Gallery | History" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="/SocialBanner.png" />
        <meta name="twitter:card" content="summary_large_image" />

        <meta property="og:title" key="ogtitle" content="Backgrounds.Gallery | History" />
        <meta property="og:url" key="ogurl" content="https://backgrounds.gallery/history" />
        <meta property="og:description" key="ogdescription" content={description} />
        <meta property="og:type" key="ogtype" content="website" />
        <meta property="og:image" key="ogimage" content="/SocialBanner.png" />

        <link rel="alternate" hrefLang="en" href="https://backgrounds.gallery/en/history" />
        <link rel="alternate" hrefLang="ru" href="https://backgrounds.gallery/ru/history" />
        <link rel="alternate" hrefLang="x-default" href="https://backgrounds.gallery/history"></link>
      </Head>

      <Header />

      <div className="w-full flex pt-16 max-w-screen-sm sm:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl mx-auto flex-col relative">
        {deviceId && <DeviceHistory deviceId={deviceId} />}
        {identity && <UserHistory identity={identity} className={deviceId && 'mt-16'} />}
      </div>
    </div >
  )
}

export async function getServerSideProps ({ locale }) {
  return {
    props: {
      ...await serverSideTranslations(locale, ['common'])
    } // will be passed to the page component as props
  }
}

export default History
