import styled from 'styled-components'
import tw from "twin.macro"
import { useTranslation } from 'next-i18next'

const ImageContainer = styled.div`
  width: 25%;
  height: 192px;
  ${tw`relative`}

  @media (max-width: 560px) {
    width: 50%;
  }

  &:hover {
    & > img {
      filter: brightness(1);
    }
  }
`

const MiniImage = styled.img`
  width: 100%;
  height: 256px;
  /* filter: brightness(2); */
  object-fit: cover;

  filter: ${props => `brightness(${props.brightnessFilter})`};
`

const StatsContainer = styled.div`
  ${tw`
    text-white absolute top-16 left-1/2 -translate-x-1/2 bg-gray-500 p-2
    transform rounded
    flex-col
    opacity-0 group-hover:opacity-100
  `}
  white-space: nowrap;
`

// const ImageColor = styled.div`
//   //hsl(107deg 60% 14%);
//   background: ${props => `hsl(${props.hsl[0]}deg ${props.hsl[1]}% ${props.hsl[2]}%)`};
//   height: 100px;
//   width: 100px;
//   position: absolute;
//   z-index: 1;
//   top: 0;
// `

export default function ImagePreview({ item }) {
  const { t } = useTranslation()
  console.log('image previewItem', item, item.hls)

  // const averageColorH = item.hls[0] / 255 * 360 // degrees
  const averageColorS = item.hls[2] / 255  //*100 %
  const averageColorL = item.hls[1] / 255  //*100 %
  const brightnessFilter = averageColorL > 0.5
    ? 1
    : Math.floor((1 + (1 - (averageColorS + averageColorL))) * 100) / 100

  return <ImageContainer className="group">
    <MiniImage
      src={`https://community.cloudflare.steamstatic.com/economy/image/${item.iconUrl}/360fx360f`}
      alt='background'
      averageLight={averageColorL}
      averageSaturation={averageColorS}
      brightnessFilter={brightnessFilter}
    />
    {/* <ImageColor
      hsl={[averageColorH, averageColorS, averageColorL]}
    /> */}
    <StatsContainer>
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
    </StatsContainer>
  </ImageContainer>
}