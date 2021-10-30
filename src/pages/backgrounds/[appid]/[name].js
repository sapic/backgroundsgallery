import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { apiUrl } from '@/lib/getApiUrl'
import Head from 'next/head'
// import Image from 'next/image'
import Header from '@/components/Header'
import styled from 'styled-components'
import tw from "tailwind-styled-components"
import { useTranslation } from 'next-i18next'
import Link from 'next/link';

import EyeSvg from '@/assets/images/eye.svg'
import StarSvg from '@/assets/images/star.svg'
import LogoSvg from '@/assets/images/logo.svg'
import SteamSvg from '@/assets/images/steam.svg'
import SteamPointsSvg from '@/assets/images/steam_points.svg'

const PageContainer = tw.div`
  w-full max-w-md
  flex flex-col
  pt-16 mx-auto relative

  md:max-w-screen-md md:flex-row
  xl:max-w-screen-lg 2xl:max-w-screen-xl
`

const BackgroundContainer = tw.div`
  bg-center md:bg-top pt-[65%] w-full h-0 overflow-hidden
  bg-no-repeat bg-contain
`

const InfoContainer = tw.div`
  rounded bg-gray-900 text-gray-100
  pt-2 pb-4 px-4 m-2
  md:w-80
  flex flex-col
  h-max
  md:mx-0
`

const BackgroundTitle = tw.h1`
  text-lg font-bold
`

const BackgroundGame = tw.h3`
  cursor-pointer font-semibold hover:text-blue-300 m-0 text-base
`

const StatsContainer = tw.div`
  flex -mx-2 mt-2
`

const LinksContainer = tw.div`
  flex flex-col mt-2 space-y-2
`

const StatsItem = tw.div`
  flex-row flex items-center text-sm
`

const EyeIcon = styled(EyeSvg)`
  color: white;
  fill: currentColor;
  width: 16px;
  height: 16px;
`

const StarIcon = styled(StarSvg)`
  color: white;
  fill: currentColor;
  width: 13px;
  height: 13px;
`

const LogoIcon = tw(LogoSvg)`
  mr-2 h-5 w-5
`

const SteamIcon = tw(SteamSvg)`
  mr-2 h-5 w-5 text-white fill-current
`

const BgLink = tw.a`
  flex items-center cursor-pointer
  hover:text-blue-300
`


const PointsIcon = tw(SteamPointsSvg)`
  mr-2 w-5 h-5
`

function Background({ bgInfo }) {
  const { t } = useTranslation()

  const shareUrl = `https://backgrounds.gallery/backgrounds/${bgInfo.url}`
  const shareName = `${t('seo.title.bgId')}${bgInfo.game} - ${bgInfo.name}`
  const description = `${t('seo.description.bgId')}${bgInfo.name} | ${bgInfo.game}`
  const previewUrl = 'https://community.cloudflare.steamstatic.com/economy/image/' + bgInfo.iconUrl

  // 753/1110690-...
  const gameId = bgInfo.url.split('-')[0].split('/')[1]

  return <div className="bg-black">
    <Head>
      <title>{shareName}</title>
      <meta name="description" key="description" content={description} />

      <meta name="twitter:url" key="twitterurl" content={shareUrl} />
      <meta name="twitter:title" key="twittertitle" content={shareName} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={previewUrl} />
      <meta name="twitter:card" content="summary_large_image" />

      <meta property="og:url" key="ogurl" content={shareUrl} />
      <meta property="og:title" key="ogtitle" content={shareName} />
      <meta property="og:description" key="ogdescription" content={description} />
      <meta property="og:type" key="ogtype" content="website" />
      <meta property="og:image" key="ogimage" content={previewUrl} />

      <link rel="alternate" hrefLang="en" href={`https://backgrounds.gallery/en/backgrounds/${bgInfo.url}`} />
      <link rel="alternate" hrefLang="ru" href={`https://backgrounds.gallery/ru/backgrounds/${bgInfo.url}`} />
      <link rel="alternate" hrefLang="x-default" href={shareUrl}></link>
    </Head>

    <Header />

    <PageContainer className="">
      <BackgroundContainer style={{
        backgroundImage: `url(${bgInfo.steamUrl})`
      }} />

      <InfoContainer>
        <BackgroundTitle>{bgInfo.name}</BackgroundTitle>

        <BackgroundGame>
          <Link href={`/games/${gameId}`}>
            <a>
              {bgInfo.game}
            </a>
          </Link>
        </BackgroundGame>

        <LinksContainer>
          <BgLink
            href={`https://steam.design/#${bgInfo.steamUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LogoIcon />
            <span>{t('bg.cropBg')}</span>
          </BgLink>
          <BgLink
            href={`https://steamcommunity.com/market/listings/${bgInfo.url}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SteamIcon />
            <span>{t('bg.buyBg')}</span>
          </BgLink>

          {bgInfo.defid && <BgLink
            href={`https://store.steampowered.com/points/shop/reward/${bgInfo.defid}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <PointsIcon />
            <span>{t('bg.buyPoins')}
              <span className="text-sm text-gray-400"> ({bgInfo.pointCost})</span>
            </span>
          </BgLink>}
        </LinksContainer>

        <StatsContainer>
          {bgInfo.views && <StatsItem className="mx-2">
            <EyeIcon className="mr-1" />
            <span className="">{bgInfo.views}</span>
          </StatsItem>}
          {bgInfo.votes && <StatsItem className="mx-2">
            <StarIcon className="mr-1" />
            <span className="">{bgInfo.votes}</span>
          </StatsItem>}
          {bgInfo.price && <StatsItem className="mx-2">
            <span className="font-bold mr-1">$</span>
            <span className="">{bgInfo.price}</span>
          </StatsItem>}
        </StatsContainer>
      </InfoContainer>
    </PageContainer >
  </div >
}

export async function getServerSideProps({ locale, params }) {
  let bgInfo = {}
  const url = encodeURIComponent(`${params.appid}/${params.name}`)
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