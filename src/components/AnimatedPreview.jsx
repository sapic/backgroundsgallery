import styled from 'styled-components'
import tw from "twin.macro"
// import { useTranslation } from 'next-i18next'
import Link from 'next/link';

import EyeSvg from '@/assets/images/eye.svg'
import StarSvg from '@/assets/images/star.svg'

const ImageContainer = styled.a`
  /* width: 25%; */
  /* height: 192px; */
  width: 100%;
  height: 100%;

  ${tw`
    relative flex cursor-pointer
    transform scale-100 
    // hover:scale-110 transition-all duration-150
    // hover:z-10
  `}

  /* @media (max-width: 560px) {
    width: 50%;
  } */
`

const MiniImage = styled.div`
  width: 100%;
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;
`

const StatsOverlay = styled.div`
  ${tw`
    text-white absolute bottom-0 left-2 p-2
    transform rounded
    flex-row flex items-center
  `}
  white-space: nowrap;
`

const StatsItem = styled.div`
  ${tw`
    flex-row flex items-center
  `}
`

const EyeIcon = styled(EyeSvg)`
  color: white;
  fill: currentColor;
  width: 20px;
  height: 20px;
`

const StarIcon = styled(StarSvg)`
  color: white;
  fill: currentColor;
  width: 16px;
  height: 16px;
`

const MiniVideo = styled.video`
  object-fit: cover;
  width: 100%;
`


export default function ImagePreview({ item, big, still }) {
  // const { t } = useTranslation()
  const wembmSrc = big
    ? `https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/${item.appid}/${item.communityItemData.itemMovieWebm}`
    : `https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/${item.appid}/${item.communityItemData.itemMovieWebmSmall}`

  const mp4Src = big
    ? `https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/${item.appid}/${item.communityItemData.itemMovieMp4}`
    : `https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/${item.appid}/${item.communityItemData.itemMovieMp4Small}`

  const imgSrc = `https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/${item.appid}/${item.communityItemData.itemImageLarge}`


  return <Link href={`/animated/${item.appid}/${item.defid}-${item.internalDescription}`} passHref>
    <ImageContainer className="group">
      {!still
        ? <MiniVideo
          muted
          loop
          playsInline
          autoPlay
        >
          <source src={mp4Src} type="video/mp4" />
          <source src={wembmSrc} type="video/webm" />
        </MiniVideo>
        : <MiniImage
          style={{
            backgroundImage: `url(${imgSrc})`
          }}
          alt='background'
        />
      }

      <StatsOverlay className="">
        {item.views && <StatsItem className="mx-2">
          <EyeIcon className="mr-1" />
          <span className="">{item.views}</span>
        </StatsItem>}
        {item.votes && <StatsItem className="mx-2">
          <StarIcon className="mr-1" />
          <span className="">{item.votes}</span>
        </StatsItem>}
      </StatsOverlay>
    </ImageContainer>
  </Link>
}