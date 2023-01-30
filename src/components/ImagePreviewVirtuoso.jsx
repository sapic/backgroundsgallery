import styled from 'styled-components'

// import { useTranslation } from 'next-i18next'
import Link from 'next/link'

import EyeSvg from '../assets/images/eye.svg'
import StarSvg from '../assets/images/star.svg'

const MiniImage = styled.div`
  width: 100%;
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;
`

const StatsOverlay = styled.div``

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
  return (
    <Link
      href={`/backgrounds/${item.url}`}
      className="group relative flex cursor-pointer
        transform scale-100 hover:scale-110 transition-all duration-150
        hover:z-10
        w-1/2 sm:w-full h-[192px]"
    >
      <MiniImage
        style={{
          backgroundImage: `url(https://community.cloudflare.steamstatic.com/economy/image/${item.iconUrl}/360fx360f)`,
        }}
        alt="background"
      />
      <StatsOverlay
        className="text-white absolute bottom-0 left-2 p-2
            transform rounded
            flex-row flex items-center whitespace-nowrap"
      >
        {!!item.views && (
          <div className="mx-2 flex-row flex items-center">
            <EyeIcon className="mr-1" />
            <span className="">{item.views}</span>
          </div>
        )}
        {!!item.votes && (
          <div className="mx-2 flex-row flex items-center">
            <StarIcon className="mr-1" />
            <span className="">{item.votes}</span>
          </div>
        )}
      </StatsOverlay>
    </Link>
  )
}
