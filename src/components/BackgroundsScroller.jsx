import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import clsx from 'clsx';
import styled from 'styled-components'

const VerticalCenterDiv = styled.div`
  top: 50%;
  transform: translateY(-50%);
`

function ImageContainer(props) {
  const { item, clickOnImage, ...restProps } = props

  return (
    <CSSTransition
      key={props.item.steamUrl}
      timeout={600}
      classNames="item"
      {...restProps}
    >
      <div className={clsx(
        "w-full flex flex-col justify-center",
        "absolute h-full select-none cursor-pointer",
        // "transform scale-105 hover:scale-110 transition-all duration-500"
      )} onClick={() => { clickOnImage(item) }}>
        <VerticalCenterDiv className="absolute w-full">
          <img alt="" className="w-full user-drag-none vote-container__image" src={props.item.steamUrl}></img>
        </VerticalCenterDiv>
        <a
          className={clsx(
            'bg-gray-900 text-white p-4 rounded',
            'shadow-xl absolute bottom-12 md:bottom-48 left-1/2 w-64 md:w-128',
            'transform', '-translate-x-1/2',
            'transition-color duration-300 ease-out hover:bg-gray-800',
            'hidden md:block'
          )}
          onClick={(e) => {
            // e.preventDefault()
            e.stopPropagation()
            // console.log('click info')
          }}
          href={`https://steamcommunity.com/market/listings/${item.url}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex">
            <div className="leading-6 align-middle">{item.name} </div>
            <div className="ml-2 text-gray-500 text-sm leading-6 align-middle">${item.price}</div>
          </div>
          <div className="text-gray-500 text-sm">
            {item.game}
          </div>
        </a>
      </div>
    </CSSTransition>
  )
}

function BackgroundsScroller(props) {
  const { bgs, clickOnImage } = props
  const leftBgs = bgs.filter((_, i) => i % 2 === 0)
  const rightBgs = bgs.filter((_, i) => i % 2 === 1)

  return (
    <>
      <TransitionGroup
        className="w-full h-full overflow-hidden relative vote-container"
      >
        {leftBgs.map((item) => (
          <ImageContainer clickOnImage={clickOnImage} item={item} key={item.steamUrl}></ImageContainer>
        ))}
      </TransitionGroup>
      <TransitionGroup className="w-full h-full overflow-hidden relative vote-container">
        {rightBgs.map((item) => (
          <ImageContainer clickOnImage={clickOnImage} item={item} key={item.steamUrl}></ImageContainer>
        ))}
      </TransitionGroup>
    </>
  )
}

export {
  BackgroundsScroller
}