import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import clsx from 'clsx';
import styled from 'styled-components'
// import useFetch from 'use-http'
import { useState, useEffect } from 'react'
import { parseCookies } from 'nookies'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import tw from "twin.macro"

import Header from '../components/Header'
import Tutorial from '../components/Tutorial'
import { BackgroundsScroller } from '../components/BackgroundsScroller'

// const bgs = require('../assets/bgs.json')

const CenterDiv = styled.div`
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
`

const BackgroundsContainer = styled.div`
  ${tw`w-full flex pt-16 flex-col md:flex-row`}
  height: 100vh;

  @media (max-width: 964px) {
    max-height: -webkit-fill-available;
  }
`

function preloadImage(url) {
  return new Promise((resolve, reject) => {
    // console.log('preload', url)
    let img = new Image()
    img.onload = () => {
      // console.log('loaded')
      resolve()
    }
    img.src = url
  })
}

function Home({ origin, cookies, startBgs }) {
  // const identity = useIdentity()
  // const { loading, error, data = [] } = useFetch('/api/get_random_bgs', {}, [])
  const { t } = useTranslation('common')
  const [bgs, setBgs] = useState(startBgs)
  const [bgsQueue, setBgsQueue] = useState([])

  async function loadBgs() {
    if (window && window.gtag) {
      window.gtag('event', 'loadbg', {
        'image': 'true'
      });
    }

    const bgs = await getNextBgs()
    setBgs(bgs)
  }

  useEffect(() => {
    if (bgs.length === 0 && process.browser) {
      // console.log('render and len 0')
      loadBgs()
    }
  })


  async function getNextBgs() {
    if (bgsQueue.length > 0) {
      const bgs = bgsQueue.shift()
      setBgsQueue([...bgsQueue])
      populateQueue()

      return bgs
    }

    let bgs
    try {
      bgs = await fetch('/api/random').then(r => r.json())
    } catch (e) {
      console.log('bgs fetch error', e)
      return []
    }
    populateQueue()

    return bgs
  }

  async function populateQueue() {
    if (bgsQueue.length < 3) {
      let queue = []
      for (let i = 0; i < 3; i++) {
        const bgs = await fetch('/api/random').then(r => r.json())
        queue.push(bgs)
        bgs.map(bg => preloadImage(bg.steamUrl))
      }

      for (const bgs of queue) {
        bgsQueue.push(bgs)
      }

      setBgsQueue([...bgsQueue])
    }
  }

  async function trackVote(item) {
    // console.log('trackVote')

    if (window && window.gtag) {
      window.gtag('event', 'vote', {
        'image': item ? 'true' : 'false'
      });
    }

    await fetch('/api/vote', {
      method: 'POST',
      body: JSON.stringify({
        item,
        views: bgs
      })
    })
  }

  async function clickOnImage(item) {
    trackVote(item)
    loadBgs()
  }

  async function clickOnSkip() {
    trackVote()
    loadBgs()
  }

  return (
    <div className="bg-black">
      <Head>
        <title>Backgrounds.Steam.Design | Best Steam Backgrounds | Battle</title>
        <link rel="alternate" hrefLang="en" href="https://bgs.steam.design/en/battle" />
        <link rel="alternate" hrefLang="ru" href="https://bgs.steam.design/ru/battle" />
      </Head>

      <Header />

      <BackgroundsContainer>
        <BackgroundsScroller
          bgs={bgs}
          clickOnImage={clickOnImage}
        />

        <CenterDiv className="absolute">
          <div className={clsx([
            'w-16 h-16 rounded-full bg-white leading-16 text-center bg-gray-900 text-white shadow-xl',
            'mr-28 md:mr-0 mt-0 md:mt-0'
          ])}>
            VS
          </div>
        </CenterDiv>
        <CenterDiv className="absolute">
          <div className={clsx(
            "ml-20 mt-0 md:ml-0 md:mt-48 w-24 h-24 rounded-full",
            "bg-white leading-24 text-center bg-gray-900 text-white shadow-xl",
            "transition-all duration-300 hover:bg-green-500 cursor-pointer",
            'select-none'
          )}
            onClick={() => { clickOnSkip() }}
          >
            {t('skipImages')}
          </div>
        </CenterDiv>

        {/* Popup with instructions */}
        {!cookies?.disable_hello && <Tutorial />}
      </BackgroundsContainer>
    </div >
  )
}

export async function getServerSideProps(ctx) {
  const cookies = parseCookies(ctx)

  let bgs = []
  try {
    bgs = await fetch('http://localhost:3000/api/random').then(r => r.json())
  } catch (e) {
    console.log('get bgs server side error', e)
  }

  return {
    props: {
      cookies,
      startBgs: bgs,
      ...await serverSideTranslations(ctx.locale, ['common']),
    }
  }
}

export default Home
