import styled from 'styled-components'
import tw from "twin.macro"
// import { useTranslation } from 'next-i18next'
import Link from 'next/link';

import EyeSvg from '@/assets/images/eye.svg'
import StarSvg from '@/assets/images/star.svg'

const ImageContainer = styled.a`
  width: 25%;
  height: 192px;

  ${tw`
    relative flex cursor-pointer
    transform scale-100 hover:scale-110 transition-all duration-150
    hover:z-10
  `}

  @media (max-width: 560px) {
    width: 50%;
  }
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

const MiniVideo = styled.video``


export default function ImagePreview({ item }) {
  // const { t } = useTranslation()
  return <Link href={`/backgrounds/${item.url}`} passHref>
    <ImageContainer className="group">
      <MiniVideo
        src={`https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/${item.appid}/${item.communityItemData.itemMovieWebm}`}
        muted
        loop
        playsInline
        autoPlay
      />
      {/* <MiniImage
        style={{
          backgroundImage: `url(https://community.cloudflare.steamstatic.com/economy/image/${item.iconUrl}/360fx360f)`
        }}
        alt='background' */}
      {/* /> */}
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