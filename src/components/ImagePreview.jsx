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
  /* height: 256px; */
  /* filter: brightness(2); */
  /* object-fit: contain; */
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
  /* background: rgba(0, 0, 0, 0.3); */
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


export default function ImagePreview({ item }) {
  // const { t } = useTranslation()
  return <Link href={`/backgrounds/${item.url}`}>
    <ImageContainer className="group">
      <MiniImage
        style={{
          backgroundImage: `url(https://community.cloudflare.steamstatic.com/economy/image/${item.iconUrl}/360fx360f)`
        }}
        alt='background'
      />
      <StatsOverlay className="">
        {/* <StatsIcon src={require('@/assets/images/eye.svg')} alt="" /> */}
        {/* <EyeSvg style={{ fill: 'currentColor', color: 'red' }} /> */}
        {item.views && <StatsItem className="mx-2">
          <EyeIcon className="mr-1" />
          <span className="">{item.views}</span>
        </StatsItem>}
        {item.votes && <StatsItem className="mx-2">
          <StarIcon className="mr-1" />
          <span className="">{item.votes}</span>
        </StatsItem>}
        {/* <EyeIcon /> */}
        {/* {(item.views || item.votes) && (<div className="-mx-1">
          {item.views && <span className="mx-1">{t('top.imageViews')}: {item.views}</span>}
          {item.votes && <span className="mx-1">{t('top.imageVotes')}: {item.votes}</span>}
        </div>)} */}
      </StatsOverlay>

      {/* <StatsContainer>
        {(item.views || item.votes) && (<div className="-mx-1">
          {item.views && <span className="mx-1">{t('top.imageViews')}: {item.views}</span>}
          {item.votes && <span className="mx-1">{t('top.imageVotes')}: {item.votes}</span>}
        </div>)}

        <div className="-mx-2">
          <a
            href={`https://steamcommunity.com/market/listings/${item.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2 hover:text-blue-300"
          >
            {t('top.steamLink')}
          </a>
          <a
            href={`https://steam.design/#${item.steamUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2 hover:text-blue-300"
          >
            {t('top.sapicLink')}
          </a>
        </div>
      </StatsContainer> */}
    </ImageContainer>
  </Link>
}