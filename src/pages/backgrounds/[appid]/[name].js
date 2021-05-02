import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { apiUrl } from '@/lib/getApiUrl'
import Head from 'next/head'
// import Image from 'next/image'
import Header from '@/components/Header'
import styled from 'styled-components'
import tw from "twin.macro"

import EyeSvg from '@/assets/images/eye.svg'
import StarSvg from '@/assets/images/star.svg'
import LogoSvg from '@/assets/images/logo.svg'
import SteamSvg from '@/assets/images/steam.svg'

const PageContainer = styled.div`
  ${tw`
    w-full max-w-md
    flex flex-col
    pt-16 mx-auto relative
  `}
`

const BackgroundContainer = styled.div`
  height: 0;
  overflow: hidden;
  padding-top: 65%;
  background-size: contain;
  background-position: 50% 50%;
  background-repeat: no-repeat;
`

const InfoContainer = styled.div`
  ${tw`
    rounded bg-gray-900 text-gray-100
    py-2 px-4 m-2
  `}
`

const BackgroundTitle = styled.h1`
  ${tw`text-lg font-bold`}
`

const BackgroundGame = styled.h3`
  ${tw`text-sm`}
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
  const shareUrl = `https://bgs.steam.design/backgrounds/${bgInfo.url}`
  const shareName = `Backgrounds.Steam.Design | ${bgInfo.name}`

  return <div className="bg-black">
    <Head>
      <title>{shareName}</title>

      <meta name="twitter:url" key="twitterurl" content={shareUrl} />
      <meta name="twitter:title" key="twittertitle" content={shareName} />

      <meta property="og:url" key="ogurl" content={shareUrl} />
      <meta property="og:title" key="ogtitle" content={shareName} />

      {/* <link rel="alternate" hrefLang="en" href="https://bgs.steam.design/en/" />
      <link rel="alternate" hrefLang="ru" href="https://bgs.steam.design/ru/" /> */}
    </Head>

    <Header />

    <PageContainer className="">
      <BackgroundContainer style={{
        backgroundImage: `url(${bgInfo.steamUrl})`
      }}>
        <img src={bgInfo.steamUrl} alt="" />
      </BackgroundContainer>

      <InfoContainer>
        <BackgroundTitle>{bgInfo.name}</BackgroundTitle>
        <BackgroundGame>{bgInfo.game}</BackgroundGame>

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
          <BgLink>
            <LogoIcon />
            <span>Crop this background</span>
          </BgLink>
          <BgLink>
            <SteamIcon />
            <span>Buy on Steam</span>
          </BgLink>
        </LinksContainer>
      </InfoContainer>


      {/* {deviceId && <DeviceHistory deviceId={deviceId} />}
      {identity && <UserHistory identity={identity} className={deviceId && 'mt-16'} />} */}
    </PageContainer>
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