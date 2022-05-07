import Head from 'next/head'

import Header from '../../components/Header'
import { apiUrl } from '../../lib/getApiUrl'
import { useMemo } from 'react'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { Row } from '../../components/History/Row'
import { useTranslation } from 'next-i18next'
import { Background, GameInfo } from '@/types'

function Game ({ gameBgs, gameId }: {
  gameBgs: GameInfo
  gameId: string
}) {
  const { t } = useTranslation()

  const itemsPerRow = typeof window !== 'undefined'
    ? window.innerWidth < 560
      ? 2
      : 4 // default 4
    : 4

  const rows = useMemo(() => {
    if (!gameBgs || !gameBgs.static) {
      return []
    }

    const r: Background[][] = []
    let j = 0

    for (let i = 0; i < gameBgs.static.length; i++) {
      if (i % itemsPerRow === 0) {
        r[j] = []
        j++
      }

      r[j - 1].push(gameBgs.static[i])
    }
    return r
  }, [gameBgs, itemsPerRow])

  const animatedRows = useMemo(() => {
    if (!gameBgs || !gameBgs.animated) {
      return []
    }

    const r: Background[][] = []
    let j = 0

    for (let i = 0; i < gameBgs.animated.length; i++) {
      if (i % itemsPerRow === 0) {
        r[j] = []
        j++
      }

      r[j - 1].push(gameBgs.animated[i])
    }
    return r
  }, [gameBgs, itemsPerRow])

  const shareUrl = `https://backgrounds.gallery/games/${gameId}`
  const shareName = `${t('seo.title.gameId')} ${gameBgs.name}`
  const description = `${t('seo.description.gameId')}${gameBgs.name}`

  return (
    <div className="bg-black">
      <Head>
        <title>{shareName}</title>
        <meta name="description" key="description" content={description} />

        <meta name="twitter:url" key="twitterurl" content={shareUrl} />
        <meta name="twitter:title" key="twittertitle" content={shareName} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="/SocialBanner.png" />
        <meta name="twitter:card" content="summary_large_image" />

        <meta property="og:url" key="ogurl" content={shareUrl} />
        <meta property="og:title" key="ogtitle" content={shareName} />
        <meta property="og:description" key="ogdescription" content={description} />
        <meta property="og:type" key="ogtype" content="website" />
        <meta property="og:image" key="ogimage" content="/SocialBanner.png" />

        <link rel="alternate" hrefLang="en" href={`https://backgrounds.gallery/en/games/${gameId}`} />
        <link rel="alternate" hrefLang="ru" href={`https://backgrounds.gallery/ru/games/${gameId}`} />
        <link rel="alternate" hrefLang="x-default" href={shareUrl}></link>
      </Head>

      <Header />

      <div className="w-full flex pt-16 max-w-screen-sm sm:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl mx-auto flex-col relative">
        <div className="bg-gray-900 py-2 px-4 rounded mt-2">
          <h1 className="text-white">Backgrounds from <strong>{gameBgs.name}</strong></h1>
        </div>

        {rows.length > 0 && <>
          <div className="bg-gray-900 py-2 px-4 rounded my-2">
            <div className="text-white">Static backgrounds</div>
          </div>
          {rows.map((row, i) => <Row row={row} key={i} />)}
        </>}

        {animatedRows.length > 0 && <>
          <div className="bg-gray-900 py-2 px-4 rounded my-2">
            <div className="text-white">Animated backgrounds</div>
          </div>
          {animatedRows.map((row, i) => <Row row={row} key={i} animated={true} rowLen={itemsPerRow} />)}
        </>}
      </div>
    </div>
  )
}

export async function getServerSideProps ({ locale, params }) {
  let gameBgs = {}
  try {
    gameBgs = await fetch(`${apiUrl}/api/games/${params.id}`).then(r => r.json())
  } catch (e) {
    console.log('get bgs server side error', e)
  }

  return {
    props: {
      gameBgs,
      gameId: params.id,

      ...await serverSideTranslations(locale, ['common']),
    }, // will be passed to the page component as props
  }
}

export default Game
