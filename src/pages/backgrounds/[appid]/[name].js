import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { apiUrl } from '@/lib/getApiUrl'
import Head from 'next/head'
// import Image from 'next/image'
import Header from '@/components/Header'
import styled from 'styled-components'
import tw from "twin.macro"
import { useTranslation } from 'next-i18next'
import Link from 'next/link';

import EyeSvg from '@/assets/images/eye.svg'
import StarSvg from '@/assets/images/star.svg'
import LogoSvg from '@/assets/images/logo.svg'
import SteamSvg from '@/assets/images/steam.svg'

const PageContainer = styled.div`
  ${tw`
    w-full max-w-md
    flex flex-col
    pt-16 mx-auto relative

    md:max-w-screen-md md:flex-row
    xl:max-w-screen-lg 2xl:max-w-screen-xl
  `}
`

const BackgroundContainer = styled.div`
  width: 100%;
  height: 0;
  overflow: hidden;
  padding-top: 65%;
  background-size: contain;
  background-repeat: no-repeat;

  ${tw`bg-center md:bg-top`}
`

const InfoContainer = styled.div`
  height: max-content;

  ${tw`
    rounded bg-gray-900 text-gray-100
    pt-2 pb-4 px-4 m-2
    md:w-80
    flex flex-col

    md:mx-0
  `}
`

const BackgroundTitle = styled.h1`
  ${tw`text-lg font-bold`}
`

const BackgroundGame = styled.h3`
  ${tw`my-2 cursor-pointer hover:text-blue-300`}
`

const StatsContainer = styled.div`
  ${tw`flex -mx-2`}
`

const LinksContainer = styled.div`
  ${tw`flex flex-col mt-2 space-y-2`}
`

const StatsItem = styled.div`
  ${tw`
    flex-row flex items-center text-sm
  `}
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

const LogoIcon = styled(LogoSvg)`
  width: 20px;
  height: 20px;

  ${tw`mr-2`}
`

const SteamIcon = styled(SteamSvg)`
  width: 20px;
  height: 20px;
  fill: currentColor;
  color: white;

  ${tw`mr-2`}
`

const BgLink = styled.a`
  ${tw`
    flex items-center cursor-pointer
    hover:text-blue-300
  `}
`

function Background({ bgInfo }) {
  const { t } = useTranslation()

  const shareUrl = `https://bgs.steam.design/backgrounds/${bgInfo.url}`
  const shareName = `Backgrounds.Steam.Design | ${bgInfo.name}`
  const description = `Best steam backgrounds collection! | Steam Background - ${bgInfo.name} | ${bgInfo.game}`

  // 753/1110690-...
  const gameId = bgInfo.url.split('-')[0].split('/')[1]

  return <div className="bg-black">
    <Head>
      <title>{shareName}</title>
      <meta name="description" key="description" content={description} />

      <meta name="twitter:url" key="twitterurl" content={shareUrl} />
      <meta name="twitter:title" key="twittertitle" content={shareName} />

      <meta property="og:url" key="ogurl" content={shareUrl} />
      <meta property="og:title" key="ogtitle" content={shareName} />

      <link rel="alternate" hrefLang="en" href={`https://bgs.steam.design/en/backgrounds/${bgInfo.url}`} />
      <link rel="alternate" hrefLang="ru" href={`https://bgs.steam.design/ru/backgrounds/${bgInfo.url}`} />
      <link rel="canonical" href={shareUrl}></link>
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
        </LinksContainer>
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