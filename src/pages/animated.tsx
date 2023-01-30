import Head from 'next/head'
import styled from 'styled-components'
import { useMemo, useRef, useState } from 'react'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Virtuoso } from 'react-virtuoso'

import AnimatedPreview from '../components/AnimatedPreview'
import { apiUrl } from '../lib/getApiUrl'
import Header from '../components/Header'
import { AnimatedBg } from '@/types'
import clsx from 'clsx'

const ImagePlaceholder = styled.div`
  width: 25%;
  height: 384px;
  padding: 0.25rem;

  @media (max-width: 560px) {
    width: 50%;
  }
`

const ImagePlaceholderInside = styled.div`
  width: 100%;
  height: 100%;
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

const RowContainer = styled.div`
  height: 384px;
`

const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const SortButton = styled.div``

function Row({ item, still }) {
  return item ? (
    <AnimatedPreview key={item.defid} item={item} big={true} still={still} />
  ) : (
    <ImagePlaceholder>
      <ImagePlaceholderInside className="bg-gray-500" />
    </ImagePlaceholder>
  )
}

function Animated({ animatedBgs }: { animatedBgs: AnimatedBg[] }) {
  const virtuosoRef = useRef(null)
  const { t } = useTranslation()
  const [still, setStill] = useState(false)

  const itemsPerRow = 2

  const rows = useMemo(() => {
    const r: AnimatedBg[][] = []
    let j = 0

    for (let i = 0; i < animatedBgs.length; i++) {
      if (i % itemsPerRow === 0) {
        r[j] = []
        j++
      }

      r[j - 1].push(animatedBgs[i])
    }
    return r
  }, [animatedBgs, itemsPerRow])

  const description = t('seo.description.animated')
  const title = t('seo.title.animated')

  return (
    <div className="bg-black">
      <Head>
        <title>{title}</title>
        <meta name="description" key="description" content={description} />

        <meta name="twitter:url" key="twitterurl" content="https://backgrounds.gallery/animated" />
        <meta name="twitter:title" key="twittertitle" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="/SocialBanner.png" />
        <meta name="twitter:card" content="summary_large_image" />

        <meta property="og:title" key="ogtitle" content={title} />
        <meta property="og:url" key="ogurl" content="https://backgrounds.gallery/animated" />
        <meta property="og:description" key="ogdescription" content={description} />
        <meta property="og:type" key="ogtype" content="website" />
        <meta property="og:image" key="ogimage" content="/SocialBanner.png" />

        <link rel="alternate" hrefLang="en" href="https://backgrounds.gallery/en/animated" />
        <link rel="alternate" hrefLang="ru" href="https://backgrounds.gallery/ru/animated" />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://backgrounds.gallery/animated"
        ></link>
      </Head>

      <Header />

      <div className="w-full flex pt-16 max-w-screen-sm sm:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl mx-auto flex-col relative">
        <div className="bg-gray-900 py-2 px-4 rounded mt-2 mb-2">
          <h1 className="text-white font-bold">{t('top.headerText')}</h1>

          <div className="text-white">{t('animated.animationHelpText')}</div>
        </div>

        <div className="bg-gray-900 flex rounded py-4 px-2 text-white my-2">
          <SortButton
            onClick={() => setStill(false)}
            className={clsx('p-2 rounded mx-2 cursor-pointer', !still && 'bg-gray-500')}
          >
            {t('animated.enableAnimation')}
          </SortButton>
          <SortButton
            onClick={() => setStill(true)}
            className={clsx('p-2 rounded mx-2 cursor-pointer', !still && 'bg-gray-500')}
          >
            {t('animated.disableAnimation')}
          </SortButton>
        </div>

        <Virtuoso
          ref={virtuosoRef}
          useWindowScroll
          totalCount={rows.length}
          overscan={0}
          fixedItemHeight={384}
          initialItemCount={16}
          components={{
            Item: ItemContainer,
            List: ListContainer,
            ScrollSeekPlaceholder: () => (
              <ItemContainer className="flex">
                <ImagePlaceholder />
              </ItemContainer>
            ),
          }}
          itemContent={(index) => (
            <RowContainer className="flex w-full">
              {rows[index].map((item, i) => (
                <Row item={item} key={i} still={still} />
              ))}
            </RowContainer>
          )}
        />
      </div>
    </div>
  )
}

export async function getServerSideProps({ locale }) {
  let animated = {}

  try {
    animated = await fetch(`${apiUrl}/api/animated`).then((r) => r.json())
  } catch (e) {
    console.log('get bgs server side error', e)
  }

  return {
    props: {
      animatedBgs: animated,

      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default Animated
