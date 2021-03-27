import Head from 'next/head'

import Header from '../components/Header'
import styled from 'styled-components'
import { useState } from 'react'
import tw from "twin.macro"

import useFetch from 'use-http'
import { FixedSizeList as List } from 'react-window';
// import AutoSizer from 'react-virtualized-auto-sizer'

import { ReactWindowScroller } from 'react-window-scroller'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'


const MiniImage = styled.img`
  width: 100%;
  height: 256px;
  object-fit: contain;
`

// const BodyContainer = styled.div`
//   margin: 0 auto;
// `

const RowContainer = styled.div`
  height: 192px;
`

const ImageContainer = styled.div`
  width: 100%;
  height: 192px;
  ${tw`relative`}
`

const SortButton = styled.div`
  ${tw`p-2 rounded mx-2 cursor-pointer`}
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

const PaginationContainer = styled.div`
  position: fixed;
  top: 72px;
  left: 50%;
  margin-left: 650px;
  ${tw`
    bg-gray-900 rounded text-white overflow-hidden w-16
  `}
`

const PageNumberContainer = styled.div`
  ${tw`
    px-4 py-2 cursor-pointer select-none text-center
  `}
`

function Top() {
  const options = {} // these options accept all native `fetch` options
  const { data = [] } = useFetch('/weightedWithInfo.json', options, [])

  const [sort, setSort] = useState(0)

  const [currentPage, setCurrentPage] = useState(1)
  const [pages, setPages] = useState([1, 2, 3, 4, 5, 6, 7])

  //document.body.clientHeight

  const sortFunction = sort === 0
    ? (a, b) => b.goodness - a.goodness
    : sort === 1
      ? (a, b) => b.votes - a.votes
      : (a, b) => b.views - a.views

  // console.log('sort function', sortFunction)

  const sortedData = data.sort(sortFunction)

  const rows = []
  let j = 0;
  for (let i = 0; i < sortedData.length; i++) {
    if (i % 4 === 0) {
      rows[j] = []
      j++
    }

    rows[j - 1].push(sortedData[i])
  }

  // let pages = [1, 2, 3, 4, 5, 6]

  useScrollPosition(
    ({ currPos }) => {
      // setElementPosition(currPos)
      // console.log('scroll to', currPos)
      const totalHeight = document.body.clientHeight

      const pagesCount = Math.floor(totalHeight / window.innerHeight)
      const currentPage = Math.floor(((-currPos.y) / totalHeight) * pagesCount) + 1
      // console.log('current page', currentPage)

      let newPages = currentPage < 5
        ? [1, 2, 3, 4, 5, '...', pagesCount - 1]
        : currentPage > pagesCount - 5
          ? [1, '...', pagesCount - 6, pagesCount - 5, pagesCount - 4, pagesCount - 3, pagesCount - 2, pagesCount - 1]
          : [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', pagesCount - 1]

      setCurrentPage(currentPage)
      setPages(newPages)
    }, [rows]
  )

  // console.log("rows", rows)

  const Row = ({ index, style }) => (
    <RowContainer className="flex" style={style} key={index}>
      {rows[index].map(item => (<ImageContainer key={item.url} className="group">
        <MiniImage src={item.steamUrl} alt='background'></MiniImage>
        <StatsContainer>
          <div>Views: {item.views} Votes: {item.votes}</div>
          <div>
            <a
              href={`https://steamcommunity.com/market/listings/${item.url}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Steam
            </a>
            <a
              href={`https://steam.design/#${item.steamUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2"
            >
              Sapic
            </a>
          </div>
        </StatsContainer>
      </ImageContainer>))}
      {/* { JSON.stringify(rows[index])} */}
    </RowContainer>
  );

  return (
    <div className="bg-black">
      <Head>
        <title>Steam.Design BG Battle</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#12151a" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-title" content="Steam.Design" />
        <meta name="description" content="A small tool to crop Steam profile backgrounds to showcases. Make your profile awesome today!" />
        <meta name="application-name" content="Steam.Design" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#12151a" />
        <meta name="theme-color" content="#12151a" />
        <meta property="og:title" content="Steam.Design" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/SocialBanner.png" />
        <meta property="og:url" content="https://steam.design/" />
        <meta property="og:description" content="A small tool to crop Steam profile backgrounds to showcases." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Steam.Design" />
        <meta name="twitter:description" content="A small tool to crop Steam profile backgrounds to showcases." />
        <meta name="twitter:image" content="/SocialBanner.png" />
        <meta name="twitter:url" content="https://steam.design/" />
      </Head>

      <Header />

      <div className="w-full flex pt-16 max-w-screen-xl mx-auto flex-col relative">
        {/* {JSON.stringify(data)} */}
        <div className="bg-gray-900 flex rounded py-4 px-2 text-white my-2">
          <SortButton onClick={() => setSort(0)} className={sort === 0 && 'bg-gray-500'}>Rating</SortButton>
          <SortButton onClick={() => setSort(1)} className={sort === 1 && 'bg-gray-500'}>Votes</SortButton>
          <SortButton onClick={() => setSort(2)} className={sort === 2 && 'bg-gray-500'}>Views</SortButton>
        </div>

        <ReactWindowScroller>
          {({ ref, outerRef, style, onScroll }) => (
            <List
              ref={ref}
              outerRef={outerRef}
              style={style}
              onScroll={onScroll}

              className="List"
              height={typeof width !== 'undefined' ? window.innerHeight : 500}
              itemCount={rows.length}
              itemSize={192}
            // width={width}
            >
              {Row}
            </List>
          )}
        </ReactWindowScroller>

        <PaginationContainer>
          {pages.map((i, index) => (
            <PageNumberContainer
              className={i === currentPage && 'bg-gray-500'}
              onClick={() => window.scrollTo(0, i * window.innerHeight)}
              key={i + index}
            >
              {i}
            </PageNumberContainer>
          ))}
        </PaginationContainer>
      </div>
    </div>
  )
}

export default Top