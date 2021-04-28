import Head from 'next/head'
import Link from 'next/link';

import Header from '@/components/Header'
import ImagePreview from '@/components/ImagePreview'
import styled from 'styled-components'
import { useState, useEffect, useMemo } from 'react'
import tw from "twin.macro"
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import useFetch from 'use-http'
import { FixedSizeList as List } from 'react-window';
// import AutoSizer from 'react-virtualized-auto-sizer'

import { ReactWindowScroller } from 'react-window-scroller'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'

import { apiUrl } from '@/lib/getApiUrl'

// const BodyContainer = styled.div`
//   margin: 0 auto;
// `

const RowContainer = styled.div`
  height: 192px;
`

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

const PageNumberContainer = styled.div`
  ${tw`
    px-4 py-2 cursor-pointer select-none text-center
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

function Top({ startTop }) {
  // console.log('start top', startTop.meta)
  const rowsCount = Math.floor(startTop.meta.count / 4)
  // let users = startTop.items

  // const allItems = [startTop]

  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const [sort, setSort] = useState(0)

  // const options = {} // these options accept all native `fetch` options\
  // const { data = [] } = useFetch(`${apiUrl}/api/votesInfo`, options, [])

  const wHeight = typeof window !== 'undefined' ? window.innerHeight : 1000
  // const itemsPerPage = Math.ceil(4 * ((wHeight / 192)))
  const totalHeight = 192 * rowsCount
  const pagesCount = Math.floor(totalHeight / wHeight)
  const itemsPerPage = startTop.meta.count / pagesCount
  const currentOffset = Math.floor(itemsPerPage * (currentPage - 2)) - 1
  const currentLimit = Math.ceil(itemsPerPage) * 3
  console.log("limit, offset, screen", currentLimit, currentOffset, wHeight)


  // console.log('itemsPerPage', startTop.meta.count / pagesCount)

  let { data: allData } = useFetch(`${apiUrl}/api/top?offset=${currentOffset}&limit=${currentLimit}&sort=${sort}`, {
    onNewData: (currUsers, newUsers) => {
      let resultArray = []
      console.log("got new users", newUsers)

      // Return new because no old exists
      if (currUsers.length === 0) {
        return [newUsers]
      }

      // Return new because old has different sort
      if (currUsers[0].meta.sort !== newUsers.meta.sort) {
        return [newUsers]
      }

      let newUsersMerged = false
      for (const currentResponse of currUsers) {
        if (newUsersMerged) {
          resultArray.push(currentResponse)
          continue
        }

        const isNewInsideOld = (newUsers.meta.offset >= currentResponse.meta.offset) &&
          (newUsers.meta.offset + newUsers.meta.limit <= currentResponse.meta.offset + currentResponse.meta.limit)

        if (isNewInsideOld) {
          // console.log('isNewInsideOld', newUsers, currentResponse)
          return currUsers
        }

        const isNewResponseIntersectingAfter = (newUsers.meta.offset < currentResponse.meta.offset + currentResponse.meta.limit) &&
          (newUsers.meta.offset + newUsers.meta.limit > currentResponse.meta.offset + currentResponse.meta.limit)

        const isNewResponseIntersectingBefore = (newUsers.meta.offset < currentResponse.meta.offset) &&
          (newUsers.meta.offset + newUsers.meta.limit > currentResponse.meta.offset)

        if (!isNewResponseIntersectingAfter && !isNewResponseIntersectingBefore) {
          resultArray.push(currentResponse)
          continue
        }

        const mergeBeforeAndAfter = (before, after, isAfter) => {
          const newItems = isAfter
            ? [
              ...before.items,
              ...after.items.slice((before.meta.offset + before.meta.limit) - after.meta.offset)
            ]
            : [
              ...before.items.slice(0, after.meta.offset - before.meta.offset),
              ...after.items
              // .slice((before.meta.offset + before.meta.limit) - after.meta.offset)
            ]

          const newResponse = {
            items: newItems,
            meta: {
              ...before.meta,
              limit: newItems.length,
            }
          }

          // console.log('merged', before, after, newResponse)
          return newResponse
        }

        // we have intersection
        if (isNewResponseIntersectingAfter) {
          const newResponse = mergeBeforeAndAfter(currentResponse, newUsers, true)
          resultArray.push(newResponse)
          newUsersMerged = true
          // console.log('merged after', currentResponse, newUsers, newResponse)
          continue
          // const newItems = [
          //   ...currentResponse.items,
          //   ...newUsers.items.slice((currentResponse.meta.offset + currentResponse.meta.limit) - newUsers.meta.offset)
          // ]
          // const newResponse = {
          //   items: newItems,
          //   meta: {
          //     ...currentResponse.meta,
          //     limit: newItems.length,
          //   }
          // }
          // resultArray.push(newResponse)
          // newUsersMerged = true
        }

        if (isNewResponseIntersectingBefore) {
          // console.log('isNewResponseIntersectingBefore', currentResponse, newUsers)
          const newResponse = mergeBeforeAndAfter(newUsers, currentResponse, false)
          resultArray.push(newResponse)
          newUsersMerged = true
          // console.log('merged before', currentResponse, newUsers, newResponse)
          continue
        }
      }

      if (!newUsersMerged) {
        resultArray.push(newUsers)
        // console.log("users not merged", resultArray)
      }

      return resultArray
      //[...currUsers, newUsers]
    },
    data: [startTop]
  }, [currentPage, sort]) // onMount AND onUpdate whenever `page` changes

  // console.log('allData', allData)

  const filledArray = useMemo(() => {
    console.log('calculate filledArray')
    const res = []
    for (const response of allData) {
      const { items, meta } = response
      if (items.length < 1) {
        continue
      }

      const { offset } = meta

      if (res.length < offset + items.length) {
        const diff = (offset + items.length) - res.length
        for (let i = 0; i < diff; i++) {
          res.push(null)
        }
      }

      let i = 0;
      for (const item of items) {
        // if (i === 0) {
        //   console.log('i0', item, i, offset, meta, filledArray)
        // }
        if (!res[offset + i]) {
          res[offset + i] = item
        }
        i++
      }
    }

    return res
  }, [allData])


  // console.log('filledArray', filledArray)



  const rows = useMemo(() => {
    console.log('calculate rows')
    const r = []
    let j = 0;

    // const sortFunction = sort === 0
    //   ? (a, b) => b.goodness - a.goodness
    //   : sort === 1
    //     ? (a, b) => b.votes - a.votes
    //     : (a, b) => b.views - a.views

    // const sortedData = data.sort(sortFunction)

    const itemsPerRow = typeof window !== 'undefined'
      ? window.innerWidth < 560
        ? 2
        : 4 // default 4
      : 4

    for (let i = 0; i < filledArray.length; i++) {
      if (i % itemsPerRow === 0) {
        r[j] = []
        j++
      }

      r[j - 1].push(filledArray[i])
    }

    // console.log('filledArray', filledArray, r)


    // rows = r
    return r
  }, [filledArray])

  const [pages, setPages] = useState([1, 2, 3, 4, 5, '...', 300])
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (rowsCount < 1) {
      return
    }

    const totalHeight = 192 * rowsCount
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
  }, [rowsCount, pages, currentPage])

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

  const Row = ({ data, index, style }) => {
    // console.log('render row &', index, data[index], index * 4)
    // useEffect(() => {
    //   console.log('row effect', rows)
    // }, [currentPage])

    if (!data[index]) {
      return <RowContainer className="flex" style={style} key={index}>
        {[0, 1, 2, 3].map((i) => <ImagePlaceholder key={i}>
          <ImagePlaceholderInside />
        </ImagePlaceholder>
        )
        }
      </RowContainer>
    }
    return (
      <RowContainer className="flex" style={style} key={index}>
        {data[index].map((item, i) => {
          if (!item) {
            return <ImagePlaceholder key={i}>
              <ImagePlaceholderInside />
            </ImagePlaceholder>
          }
          return <ImagePreview
            key={i + item.url}
            item={item}
          />
        })}
        {/* { JSON.stringify(rows[index])} */}
      </RowContainer>
    )
  }

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

        <ReactWindowScroller>
          {({ ref, outerRef, style, onScroll }) => (
            <List
              ref={ref}
              outerRef={outerRef}
              style={style}
              onScroll={onScroll}

              className="List"
              height={typeof width !== 'undefined' ? window.innerHeight : 500}
              itemCount={rowsCount}
              itemSize={192}
              itemData={rows}
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

export async function getServerSideProps({ locale }) {
  let top = {}
  try {
    top = await fetch(`${apiUrl}/api/top`).then(r => r.json())
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