import Head from 'next/head'
import Link from 'next/link';

import Header from '../components/Header'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
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

const SortButtonViolet = styled.div`
  ${tw`p-2 rounded mx-2 cursor-pointer`}
  background: #aa076b;
  background: linear-gradient(45deg,#61045f,#aa076b);
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
  margin-left: 510px;
  ${tw`
    bg-gray-900 rounded text-white overflow-hidden w-16
  `}

  @media (min-width: 1536px) {
    margin-left: 650px;
  }
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
  // const [rows, setRows] = useState([])
  let rows = []

  // console.log('top changed')
  // 
  // useEffect(() => {
  // console.log('call use effect', data, sort)
  const r = []
  let j = 0;

  const sortFunction = sort === 0
    ? (a, b) => b.goodness - a.goodness
    : sort === 1
      ? (a, b) => b.votes - a.votes
      : (a, b) => b.views - a.views

  const sortedData = data.sort(sortFunction)

  const itemsPerRow = typeof window !== 'undefined'
    ? window.innerWidth < 560
      ? 2
      : 4 // default 4
    : 4

  for (let i = 0; i < sortedData.length; i++) {
    if (i % itemsPerRow === 0) {
      r[j] = []
      j++
    }

    r[j - 1].push(sortedData[i])
  }

  // setRows(r)
  rows = r
  // const totalHeight = 192 * rows.length
  // const pagesCount = typeof window !== 'undefined' && totalHeight > 0 ? Math.floor(totalHeight / window.innerHeight) : 8

  //   console.log('totalHeight', totalHeight, window.innerHeight)
  //   setPages([1, 2, 3, 4, 5, '...', pagesCount - 1])
  // if (typeof window !== 'undefined') {
  //   console.log('pagesCount', totalHeight, pagesCount, window && window.innerHeight)
  // }
  const [pages, setPages] = useState([1, 2, 3, 4, 5, '...', 300])
  // console.log('pages:', pagesCount, pages)
  // setPages([1, 2, 3])
  // setRows(r)
  // }, [data, sort])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (rows.length < 1) {
      return
    }

    const totalHeight = 192 * rows.length
    const pagesCount = Math.floor(totalHeight / window.innerHeight)

    // console.log('totalHeight', totalHeight, window.innerHeight)
    // const newPages = [1, 2, 3, 4, 5, '...', pagesCount - 1]

    const cr = currentPage
    let newPages = cr < 5
      ? [1, 2, 3, 4, 5, '...', pagesCount - 1]
      : cr > pagesCount - 5
        ? [1, '...', pagesCount - 6, pagesCount - 5, pagesCount - 4, pagesCount - 3, pagesCount - 2, pagesCount - 1]
        : [1, '...', cr - 1, cr, cr + 1, '...', pagesCount - 1]

    if (JSON.stringify(pages) !== JSON.stringify(newPages)) {
      setPages(newPages)
      // console.log('set pages on effect')
    }
  }, [rows.length, pages, currentPage])

  // let pages = [1, 2, 3, 4, 5, 6]

  useScrollPosition(
    ({ currPos }) => {
      // setElementPosition(currPos)
      // console.log('scroll to', currPos)
      const totalHeight = document.body.clientHeight

      const pagesCount = Math.floor(totalHeight / window.innerHeight)
      const cr = Math.floor(((-currPos.y) / totalHeight) * pagesCount) + 1

      if (cr === currentPage) {
        return
      }

      setCurrentPage(cr)
      return
      // console.log('current page', currentPage)

      // let newPages = cr < 5
      //   ? [1, 2, 3, 4, 5, '...', pagesCount - 1]
      //   : cr > pagesCount - 5
      //     ? [1, '...', pagesCount - 6, pagesCount - 5, pagesCount - 4, pagesCount - 3, pagesCount - 2, pagesCount - 1]
      //     : [1, '...', cr - 1, cr, cr + 1, '...', pagesCount - 1]

      // // console.log('cr', cr, currentPage)
      // // if (cr !== currentPage) {
      // setCurrentPage(cr)
      // setPages(newPages)
      // console.log('set pages on scroll')
      // }
    }, [currentPage]
  )

  // console.log("rows", rows)

  const Row = ({ index, style }) => (
    <RowContainer className="flex" style={style} key={index}>
      {rows[index].map(item => (<ImageContainer key={item.url} className="group">
        <MiniImage src={item.steamUrl} alt='background'></MiniImage>
        <StatsContainer>
          <div>Views: {item.views} Votes: {item.votes}</div>
          <div className="-mx-2">
            <a
              href={`https://steamcommunity.com/market/listings/${item.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2 hover:text-blue-300"
            >
              Steam
            </a>
            <a
              href={`https://steam.design/#${item.steamUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2 hover:text-blue-300"
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
        <title>Backgrounds.Steam.Design | Best Steam Backgrounds | Top</title>
      </Head>

      <Header />

      <div className="w-full flex pt-16 max-w-screen-lg 2xl:max-w-screen-xl mx-auto flex-col relative">
        {/* {JSON.stringify(data)} */}
        <div class="bg-gray-900 py-2 px-4 rounded mt-2">
          <h1 class="text-white">Find best background for Your Steam Profile based on community votes! Or vote yourself!</h1>
        </div>

        <div className="bg-gray-900 flex rounded py-4 px-2 text-white my-2">
          <SortButton onClick={() => setSort(0)} className={sort === 0 && 'bg-gray-500'}>Rating</SortButton>
          <SortButton onClick={() => setSort(1)} className={sort === 1 && 'bg-gray-500'}>Votes</SortButton>
          <SortButton onClick={() => setSort(2)} className={sort === 2 && 'bg-gray-500'}>Views</SortButton>
          <Link href="/battle">
            <SortButtonViolet>Vote</SortButtonViolet>
          </Link>
          
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
              key={i + '' + index}
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