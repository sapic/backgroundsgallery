import { CSSTransition, TransitionGroup } from 'react-transition-group'
import clsx from 'clsx'
import styled from 'styled-components'

const VerticalCenterDiv = styled.div`
  top: 50%;
  transform: translateY(-50%);
`

function VideoForBg({ item, big }) {
  const wembmSrc = big
    ? `https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/${item.appid}/${item.communityItemData.itemMovieWebm}`
    : `https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/${item.appid}/${item.communityItemData.itemMovieWebmSmall}`

  const mp4Src = big
    ? `https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/${item.appid}/${item.communityItemData.itemMovieMp4}`
    : `https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/${item.appid}/${item.communityItemData.itemMovieMp4Small}`

  return (
    <video muted loop playsInline autoPlay className="w-full user-drag-none vote-container__image">
      <source src={mp4Src} type="video/mp4" />
      <source src={wembmSrc} type="video/webm" />
    </video>
  )
}

function ImageContainer(props) {
  const { item, clickOnImage, isAnimated, ...restProps } = props

  return (
    <CSSTransition key={props.item.steamUrl} timeout={600} classNames="item" {...restProps}>
      <div
        className={clsx(
          'w-full flex flex-col justify-center',
          'absolute h-full select-none cursor-pointer'
          // "transform scale-105 hover:scale-110 transition-all duration-500"
        )}
        onClick={() => {
          clickOnImage(item)
        }}
      >
        <VerticalCenterDiv className="absolute w-full">
          {isAnimated ? (
            <VideoForBg item={item} big={true} />
          ) : (
            <img
              alt=""
              className="w-full user-drag-none vote-container__image"
              src={props.item.steamUrl}
            ></img>
          )}
        </VerticalCenterDiv>
        <a
          className={clsx(
            'bg-gray-900 text-white p-4 rounded',
            'shadow-xl absolute bottom-12 md:bottom-48 left-1/2 w-64 md:w-128',
            'transform',
            '-translate-x-1/2',
            'transition-color duration-300 ease-out hover:bg-gray-800',
            'hidden md:block'
          )}
          onClick={(e) => {
            // e.preventDefault()
            e.stopPropagation()
            // console.log('click info')
          }}
          href={
            isAnimated
              ? `https://store.steampowered.com/points/shop/c/backgrounds/reward/${item.defid}`
              : `https://steamcommunity.com/market/listings/${item.url}`
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex">
            <div className="leading-6 align-middle">
              {isAnimated ? item.internalDescription : item.name}
            </div>
            <div className="ml-2 text-gray-500 text-sm leading-6 align-middle">
              {isAnimated ? item.pointCost + ' SP' : '$' + item.price}
            </div>
          </div>
          <div className="text-gray-500 text-sm">{item.game}</div>
        </a>
      </div>
    </CSSTransition>
  )
}

function BackgroundsScroller(props) {
  const { bgs, clickOnImage } = props

  const [leftBg, rightBg, info] = bgs

  const isAnimated = info && info.type && info.type === 'animated'

  return (
    <>
      <TransitionGroup className="w-full h-full overflow-hidden relative vote-container">
        <ImageContainer
          isAnimated={isAnimated}
          clickOnImage={clickOnImage}
          item={leftBg}
          key={leftBg.steamUrl || leftBg.defid}
        />
      </TransitionGroup>
      <TransitionGroup className="w-full h-full overflow-hidden relative vote-container">
        <ImageContainer
          isAnimated={isAnimated}
          clickOnImage={clickOnImage}
          item={rightBg}
          key={rightBg.steamUrl || rightBg.defid}
        />
      </TransitionGroup>
    </>
  )
}

export { BackgroundsScroller }
