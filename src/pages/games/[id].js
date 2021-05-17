import Head from 'next/head'

import Header from '@/components/Header'
import { apiUrl } from '@/lib/getApiUrl'
import { useMemo } from 'react'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { Row } from '@/components/History/Row'

function Game({ gameBgs, gameId }) {
  const itemsPerRow = typeof window !== 'undefined'
    ? window.innerWidth < 560
      ? 2
      : 4 // default 4
    : 4


  const rows = useMemo(() => {
    if (!gameBgs || !gameBgs.items) {
      return []
    }

    const r = []
    let j = 0;

    for (let i = 0; i < gameBgs.items.length; i++) {
      if (i % itemsPerRow === 0) {
        r[j] = []
        j++
      }

      r[j - 1].push(gameBgs.items[i])
    }
    return r
  }, [gameBgs, itemsPerRow])

  const shareUrl = `https://bgs.steam.design/games/${gameId}`
  const shareName = `Backgrounds.Steam.Design | ${gameBgs.name}`
  const description = `Best steam backgrounds collection! | Steam Game Backgrounds - ${gameBgs.name}`

  return (
    <div className="bg-black">
      <Head>
        <meta name="description" key="description" content={description} />

        <meta name="twitter:url" key="twitterurl" content={shareUrl} />
        <meta name="twitter:title" key="twittertitle" content={shareName} />

        <meta property="og:url" key="ogurl" content={shareUrl} />
        <meta property="og:title" key="ogtitle" content={shareName} />

        <link rel="alternate" hrefLang="en" href={`https://bgs.steam.design/en/games/${gameId}`} />
        <link rel="alternate" hrefLang="ru" href={`https://bgs.steam.design/ru/games/${gameId}`} />
        <link rel="canonical" href={shareUrl}></link>
      </Head>

      <Header />

      <div className="w-full flex pt-16 max-w-screen-sm sm:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl mx-auto flex-col relative">
        <div className="bg-gray-900 py-2 px-4 rounded mt-2">
          <h1 className="text-white">{gameBgs.name}</h1>
        </div>
        {rows.map((row, i) => <Row row={row} key={i} />)}
      </div>
    </div >
  )
}

export async function getServerSideProps({ locale, params }) {
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