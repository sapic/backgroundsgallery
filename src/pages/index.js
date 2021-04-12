import Head from 'next/head'
import Link from 'next/link';

import Header from '../components/Header'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import tw from "twin.macro"
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

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
  margin-left: 400px;
  display: none;
  ${tw`
    bg-gray-900 rounded text-white overflow-hidden w-16
  `}

  @media (min-width: 964px) {
    display: block;
  }

  @media (min-width: 1280px) {
    margin-left: 510px;
  }

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
  const { t } = useTranslation()

  const options = {} // these options accept all native `fetch` options\
  const { data = [] } = useFetch('/api/votesInfo', options, [])

  const [sort, setSort] = useState(0)

  const [currentPage, setCurrentPage] = useState(1)
  let rows = []


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


  rows = r

  const [pages, setPages] = useState([1, 2, 3, 4, 5, '...', 300])
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (rows.length < 1) {
      return
    }

    const totalHeight = 192 * rows.length
    const pagesCount = Math.floor(totalHeight / window.innerHeight)

    const cr = currentPage
    let newPages = cr < 5
      ? [1, 2, 3, 4, 5, '...', pagesCount - 1]
      : cr > pagesCount - 5
        ? [1, '...', pagesCount - 6, pagesCount - 5, pagesCount - 4, pagesCount - 3, pagesCount - 2, pagesCount - 1]
        : [1, '...', cr - 1, cr, cr + 1, '...', pagesCount - 1]

    if (JSON.stringify(pages) !== JSON.stringify(newPages)) {
      setPages(newPages)
    }
  }, [rows.length, pages, currentPage])

  useScrollPosition(
    ({ currPos }) => {
      const totalHeight = document.body.clientHeight

      const pagesCount = Math.floor(totalHeight / window.innerHeight)
      const cr = Math.floor(((-currPos.y) / totalHeight) * pagesCount) + 1

      if (cr === currentPage) {
        return
      }

      setCurrentPage(cr)
      return
    }, [currentPage]
  )

  // console.log("rows", rows)

  const Row = ({ index, style }) => (
    <RowContainer className="flex" style={style} key={index}>
      {rows[index].map(item => (<ImageContainer key={item.url} className="group">
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
  );

  return (
    <div className="bg-black">
      <Head>
        <title>Backgrounds.Steam.Design | Best Steam Backgrounds | Top</title>
        <link rel="alternate" hrefLang="en" href="https://bgs.steam.design/en/" />
        <link rel="alternate" hrefLang="ru" href="https://bgs.steam.design/ru/" />
      </Head>

      <Header />

      <div className="w-full flex pt-16 max-w-screen-sm sm:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl mx-auto flex-col relative">
        {/* {JSON.stringify(data)} */}
        <div className="bg-gray-900 py-2 px-4 rounded mt-2">
          <h1 className="text-white">{t('top.headerText')}</h1>
        </div>

        <div className="bg-gray-900 flex rounded py-4 px-2 text-white my-2">
          <SortButton onClick={() => setSort(0)} className={sort === 0 && 'bg-gray-500'}>{t('top.sortRating')}</SortButton>
          <SortButton onClick={() => setSort(1)} className={sort === 1 && 'bg-gray-500'}>{t('top.sortVotes')}</SortButton>
          <SortButton onClick={() => setSort(2)} className={sort === 2 && 'bg-gray-500'}>{t('top.sortViews')}</SortButton>
          <Link href="/battle">
            <SortButtonViolet>{t('top.sortVote')}</SortButtonViolet>
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
    </div >
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...await serverSideTranslations(locale, ['common']),
    }, // will be passed to the page component as props
  }
}

export default Top