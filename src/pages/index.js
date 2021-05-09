import Head from 'next/head'
import Link from 'next/link';

import Header from '@/components/Header'
import ImagePreview from '@/components/ImagePreviewVirtuoso'
import styled from 'styled-components'
import { useState, useEffect, useMemo, useRef } from 'react'
import tw from "twin.macro"
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import useFetch from 'use-http'
// import { useScrollPosition } from '@n8tb1t/use-scroll-position'

import { apiUrl } from '@/lib/getApiUrl'

// import TopList from '@/components/TopList'
import { useRouter } from 'next/router'
import { Virtuoso } from 'react-virtuoso'

// const BodyContainer = styled.div`
//   margin: 0 auto;
// `

// const RowContainer = styled.div`
//   height: 192px;
// `

const SortButton = styled.div`
  ${tw`p-2 rounded mx-2 cursor-pointer`}
`

const SortButtonViolet = styled.div`
  ${tw`p-2 rounded mx-2 cursor-pointer`}
  background: #aa076b;
  background: linear-gradient(45deg,#61045f,#aa076b);
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

const PageNumberContainer = styled.a`
  ${tw`
    flex px-4 py-2 cursor-pointer select-none text-center items-center justify-center
  `}
`

const ImagePlaceholder = styled.div`
  width: 25%;
  height: 192px;
  ${tw`p-1`}

  @media (max-width: 560px) {
    width: 50%;
  }
`

const ImagePlaceholderInside = styled.div`
  width: 100%;
  height: 100%;
  ${tw`bg-gray-500`}
`

const ItemContainer = styled.div`
    /* padding: 0.5rem; */
    width: 100%;
    display: flex;
    flex: none;
    align-content: stretch;

    @media (max-width: 1024px) {
      width: 50%;
    }

    @media (max-width: 480px) {
      width: 100%;
    }
  `

// const ItemWrapper = styled.div`
//     flex: 1;
//     text-align: center;
//     font-size: 80%;
//     padding: 1rem 1rem;
//     border: 1px solid var(--ifm-hr-border-color);
//     white-space: nowrap;
//   `

const ListContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
  `


function Row({ item, ...props }) {
  return item
    ? <ImagePreview
      key={item.url}
      item={item}
    />
    : <ImagePlaceholder>
      <ImagePlaceholderInside></ImagePlaceholderInside>
    </ImagePlaceholder>
}

function Top({ startTop }) {
  const router = useRouter()
  const { page: spageFromQuery } = router.query
  const virtuosoRef = useRef(null)
  const { t } = useTranslation()
  const [visibleRange, setVisibleRange] = useState({
    startIndex: 0,
    endIndex: 0,
  })

  const pageFromQuery = parseInt(spageFromQuery)

  const [currentPage, setCurrentPage] = useState(pageFromQuery || 1)
  const [sort, setSort] = useState(0)
  const [initialScrollHappened, setInitialScrollHappened] = useState(false)

  const itemsPerRow = typeof window !== 'undefined'
    ? window.innerWidth < 560
      ? 2
      : 4 // default 4
    : 4

  const rowsCount = Math.floor(startTop.meta.count / itemsPerRow)

  const itemsPerPage = 32
  const rowsPerPage = itemsPerPage / itemsPerRow
  const pagesCount = Math.floor(startTop.meta.count / itemsPerPage)

  useEffect(() => {
    if (!initialScrollHappened && pageFromQuery) {
      setInitialScrollHappened(true)
      setTimeout(() => {
        const indexToSroll = pageFromQuery === 1 ? 0 : ((pageFromQuery - 1) * rowsPerPage)
        const scrollOfset = (192 * indexToSroll) - 65

        virtuosoRef.current.scrollTo({ top: scrollOfset })
      }, 64)
    }
  }, [initialScrollHappened, pageFromQuery, rowsPerPage])

  // const [allData, setAllData] = useState([startTop])
  const { data: allData } = useFetch(`${apiUrl}/api/top?offset=${0}&limit=${startTop.meta.count}&sort=${sort}`, {
    onNewData: (_, newData) => {
      return [newData]
    },
    data: [startTop]
  }, [startTop, sort])

  const filledArray = useMemo(() => {
    const res = new Array(startTop.meta.count)
    for (const response of allData) {
      const { items, meta } = response
      if (items.length < 1) {
        continue
      }

      const { offset } = meta
      for (let i = 0; i < items.length; i++) {
        res[offset + i] = items[i]
      }
    }

    return res
  }, [allData, startTop.meta.count])

  const rows = useMemo(() => {
    const r = []
    let j = 0;

    for (let i = 0; i < filledArray.length; i++) {
      if (i % itemsPerRow === 0) {
        r[j] = []
        j++
      }

      r[j - 1].push(filledArray[i])
    }
    return r
  }, [filledArray, itemsPerRow])

  const [pages, setPages] = useState([1, 2, 3, 4, 5, '...', pagesCount + 1])
  useEffect(() => {
    const newPageStart = ((visibleRange.startIndex + 1) / rowsPerPage) + 1
    const newPageEnd = ((visibleRange.endIndex + 1) / rowsPerPage) + 1
    const avg = Math.floor((newPageStart + newPageEnd) / 2)

    if (avg !== currentPage) {
      setCurrentPage(avg)
      router.push(`/?page=${avg}`, `/?page=${avg}`, {
        scroll: false,
        shallow: true,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleRange, currentPage, rowsPerPage])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (rowsCount < 1) {
      return
    }

    const cr = currentPage
    let newPages = cr < 5
      ? [1, 2, 3, 4, 5, '...', pagesCount]
      : cr > pagesCount - 5
        ? [1, '...', pagesCount - 5, pagesCount - 4, pagesCount - 3, pagesCount - 2, pagesCount - 1, pagesCount]
        : [1, '...', cr - 1, cr, cr + 1, '...', pagesCount]

    if (JSON.stringify(pages) !== JSON.stringify(newPages)) {
      setPages(newPages)
    }
  }, [currentPage, pages, rowsCount, startTop, pagesCount])

  return (
    <div className="bg-black">
      <Head>
        <title>Backgrounds.Steam.Design | Best Steam Backgrounds | Top</title>

        <meta name="twitter:url" key="twitterurl" content="https://bgs.steam.design/" />
        <meta name="twitter:title" key="twittertitle" content="Backgrounds.Steam.Design | Top" />

        <meta property="og:title" key="ogtitle" content="Backgrounds.Steam.Design | Top" />
        <meta property="og:url" key="ogurl" content="https://bgs.steam.design/" />

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

        <Virtuoso
          ref={virtuosoRef}
          useWindowScroll
          rangeChanged={setVisibleRange}
          totalCount={rows.length}
          overscan={0}
          // initialTopMostItemIndex={40}
          fixedItemHeight={192}
          initialItemCount={16}
          components={{
            Item: ItemContainer,
            List: ListContainer,
            ScrollSeekPlaceholder: ({ height, index }) => (
              <ItemContainer className="flex">
                <ImagePlaceholder />
              </ItemContainer>
            ),
          }}

          itemContent={index => <div className="flex w-full">
            {rows[index].map((item, i) => <Row item={item} key={i} />)}
          </div>}
        />

        <PaginationContainer>
          {pages.map((i, index) => (
            <PageNumberContainer
              href={`/?page=${i}`}
              className={i === currentPage && 'bg-gray-500'}
              onClick={(e) => {
                e.preventDefault()

                const indexToSroll = i === 1 ? 0 : ((i - 1) * rowsPerPage)
                const scrollOfset = (192 * indexToSroll) - 65
                virtuosoRef.current.scrollTo({ top: scrollOfset })

                router.push(`/?page=${i}`, `/?page=${i}`, {
                  scroll: false,
                  shallow: true,
                })
              }}
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

export async function getServerSideProps({ locale, query }) {
  let top = {}
  let offset = 0

  if (query.page) {
    offset = 32 * (query.page - 1)
  }

  try {
    top = await fetch(`${apiUrl}/api/top?limit=32&offset=${offset}`).then(r => r.json())
  } catch (e) {
    console.log('get bgs server side error', e)
  }

  return {
    props: {
      startTop: top,

      ...await serverSideTranslations(locale, ['common']),
    }, // will be passed to the page component as props
  }
}

export default Top