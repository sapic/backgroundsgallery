import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { apiUrl } from '../../../lib/getApiUrl'
import Head from 'next/head'
// import Image from 'next/image'
import Header from '../../../components/Header'
import styled from 'styled-components'

import { useTranslation } from 'next-i18next'
import Link from 'next/link'

import EyeSvg from '../../../assets/images/eye.svg'
import StarSvg from '../../../assets/images/star.svg'
import LogoSvg from '../../../assets/images/logo.svg'
import SteamSvg from '../../../assets/images/steam.svg'

const PageContainer = styled.div``

const BackgroundContainer = styled.div`
  width: 100%;
  /* height: 0; */
  overflow: hidden;
  /* padding-top: 65%; */
  /* background-size: contain;
  background-repeat: no-repeat; */
`

const BackgroundVideo = styled.video``

const BackgroundTitle = styled.h1``

const BackgroundGame = styled.h3``

const StatsContainer = styled.div``

const LinksContainer = styled.div``

const StatsItem = styled.div``

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
`

const SteamIcon = styled(SteamSvg)`
  width: 20px;
  height: 20px;
  fill: currentColor;
  color: white;
`

const BgLink = styled.a``

function Background({ bgInfo }) {
  const { t } = useTranslation()

  console.log('bg info', bgInfo)

  const shareUrl = `https://backgrounds.gallery/animated/${bgInfo.appid}/${bgInfo.defid}-${bgInfo.internalDescription}`
  const shareName = `${t('seo.title.bgId')}${bgInfo.game} - ${bgInfo.internalDescription}`
  const description = `${t('seo.description.bgId')}${bgInfo.internalDescription} | ${bgInfo.game}`
  const previewUrl = `https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/${bgInfo.appid}/${bgInfo.communityItemData.itemImageLarge}`

  // 753/1110690-...
  const gameId = bgInfo.appid
  const webmUrl = `https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/${bgInfo.appid}/${bgInfo.communityItemData.itemMovieWebm}`
  const mp4Url = `https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/${bgInfo.appid}/${bgInfo.communityItemData.itemMovieMp4}`

  return (
    <div className="bg-black">
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

        <link
          rel="alternate"
          hrefLang="en"
          href={`https://backgrounds.gallery/en/animated/${bgInfo.appid}/${bgInfo.defid}-${bgInfo.internalDescription}`}
        />
        <link
          rel="alternate"
          hrefLang="ru"
          href={`https://backgrounds.gallery/ru/animated/${bgInfo.appid}/${bgInfo.defid}-${bgInfo.internalDescription}`}
        />
        <link rel="alternate" hrefLang="x-default" href={shareUrl}></link>
      </Head>

      <Header />

      <PageContainer
        className="w-full max-w-md
          flex flex-col
          pt-16 mx-auto relative

          md:max-w-screen-md md:flex-row
          xl:max-w-screen-lg 2xl:max-w-screen-xl"
      >
        <BackgroundContainer>
          <BackgroundVideo muted loop playsInline autoPlay>
            <source src={mp4Url} type="video/mp4" />
            <source src={webmUrl} type="video/webm" />
          </BackgroundVideo>
        </BackgroundContainer>

        <div
          className="
        flex flex-col h-max
        rounded bg-gray-900 text-gray-100
        pt-2 pb-4 px-4 m-2
        md:w-80
        md:mx-0"
        >
          <BackgroundTitle className="text-lg font-bold">
            {bgInfo.internalDescription}
          </BackgroundTitle>

          <BackgroundGame className="cursor-pointer font-semibold hover:text-blue-300">
            <Link href={`/games/${gameId}`}>{bgInfo.game}</Link>
          </BackgroundGame>

          <LinksContainer className="flex flex-col mt-2 space-y-2">
            {/* <div className="text-white">{JSON.stringify(bgInfo)}</div> */}

            <BgLink
              href={`https://steam.design/#${webmUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center cursor-pointer
                hover:text-blue-300"
            >
              <LogoIcon className="mr-2" />
              <span>{t('bg.cropBg')}</span>
            </BgLink>
            <BgLink
              href={`https://store.steampowered.com/points/shop/c/backgrounds/reward/${bgInfo.defid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center cursor-pointer
                hover:text-blue-300"
            >
              <SteamIcon className="mr-2" />
              <span>{t('bg.buyBg')}</span>
            </BgLink>
          </LinksContainer>

          <StatsContainer className="flex -mx-2 mt-2">
            {!!bgInfo.views && (
              <StatsItem className="mx-2 flex-row flex items-center text-sm">
                <EyeIcon className="mr-1" />
                <span className="">{bgInfo.views}</span>
              </StatsItem>
            )}
            {!!bgInfo.votes && (
              <StatsItem className="mx-2 flex-row flex items-center text-sm">
                <StarIcon className="mr-1" />
                <span className="">{bgInfo.votes}</span>
              </StatsItem>
            )}
            {!!bgInfo.pointCost && (
              <StatsItem className="mx-2 flex-row flex items-center text-sm">
                <span className="">{bgInfo.pointCost}</span>
                <span className="font-bold ml-1">SP</span>
              </StatsItem>
            )}
          </StatsContainer>
        </div>
      </PageContainer>
    </div>
  )
}

export async function getServerSideProps({ locale, params }) {
  let bgInfo = {}
  const defId = params.name.split('-')[0]

  try {
    bgInfo = await fetch(`${apiUrl}/api/animatedInfo?appid=${params.appid}&defid=${defId}`).then(
      (r) => r.json()
    )
  } catch (e) {
    console.log('get bgs server side error', e)
  }

  return {
    props: {
      // startTop: top,
      bgInfo,

      ...(await serverSideTranslations(locale, ['common'])),
    }, // will be passed to the page component as props
  }
}

export default Background
