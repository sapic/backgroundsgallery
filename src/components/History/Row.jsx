import styled from 'styled-components'
// import { useState, useEffect } from 'react'
import tw from "twin.macro"
import { useTranslation } from 'next-i18next'

const RowContainer = styled.div`
  height: 192px;
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

const ImageContainer = styled.div`
  width: 25%;
  height: 192px;
  ${tw`relative`}
`

const MiniImage = styled.img`
  width: 100%;
  height: 256px;
  object-fit: contain;
`

export function Row(props) {
  const { row } = props
  const { t } = useTranslation()

  return (
    <RowContainer className="flex">
      {row.map(item => (<ImageContainer key={item.url} className="group">
        <MiniImage src={item.steamUrl} alt='background'></MiniImage>
        <StatsContainer>
          <div>{t('top.imageViews')}: {item.views} {t('top.imageVotes')}: {item.votes}</div>
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
      </ImageContainer>))}
      {/* { JSON.stringify(rows[index])} */}
    </RowContainer>
  )
}