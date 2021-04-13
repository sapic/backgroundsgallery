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
`

const MiniImage = styled.img`
  width: 100%;
  height: 256px;
  /* filter: brightness(2); */
  object-fit: cover;
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

export default function ImagePreview({ item }) {
  const { t } = useTranslation()
  return <ImageContainer className="group">
    <MiniImage
      src={`https://community.cloudflare.steamstatic.com/economy/image/${item.iconUrl}/360fx360f`}
      alt='background'
    />
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