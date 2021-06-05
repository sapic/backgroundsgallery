import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import clsx from 'clsx';
import styled from 'styled-components'
// import useFetch from 'use-http'
import { useState, useEffect } from 'react'
// import { parseCookies } from 'nookies'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import tw from "twin.macro"
import { useCookies } from 'react-cookie'

import Header from '../components/Header'
import Tutorial from '../components/Tutorial'
import { BackgroundsScroller } from '../components/BackgroundsScroller'

import { apiUrl } from '@/lib/getApiUrl'

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

function Home({ origin, startBgs }) {
  // const identity = useIdentity()
  // const { loading, error, data = [] } = useFetch('/api/get_random_bgs', {}, [])
  const { t } = useTranslation('common')
  const [bgs, setBgs] = useState(startBgs)
  const [bgsQueue, setBgsQueue] = useState([])
  const [isChanging, setIsChanging] = useState(false)
  const [cookies, setCookie] = useCookies(['bgsspid', 'disable_hello']);

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
      bgs = await fetch(`${apiUrl}/api/random`).then(r => r.json())
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
        const bgs = await fetch(`${apiUrl}/api/random`).then(r => r.json())
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
    if (window && window.gtag) {
      window.gtag('event', 'vote', {
        'image': item ? 'true' : 'false'
      });
    }

    let deviceId
    let val = cookies.bgsspid

    if (val) {
      deviceId = val
    } else {
      deviceId = randomId()
    }

    setCookie('bgsspid', deviceId, {
      maxAge: 30 * 24 * 60 * 60,
    })

    await fetch('/api/vote', {
      method: 'POST',
      body: JSON.stringify({
        item,
        views: bgs
      }),
      headers: {
        'Device-Id': deviceId,
      }
    })
  }

  async function clickOnImage(item) {
    if (isChanging) {
      return
    }

    setIsChanging(true)
    trackVote(item)
    await loadBgs()
    await delay(500)
    setIsChanging(false)
  }

  async function clickOnSkip() {
    trackVote()
    loadBgs()
  }

  useKeypress('ArrowLeft', () => {
    if (bgs[0]) {
      clickOnImage(bgs[0])
    }
  })
  useKeypress('ArrowRight', () => {
    if (bgs[1]) {
      clickOnImage(bgs[1])
    }
  })
  useKeypress('ArrowUp', () => {
    clickOnSkip()
  })

  const description = 'Best steam backgrounds collection! Find your favorite! Vote for random backgrounds!'

  return (
    <div className="bg-black">
      <Head>
        <title>Backgrounds.Gallery | Best Steam Backgrounds | Battle</title>
        <meta name="description" key="description" content={description} />

        <meta name="twitter:url" key="twitterurl" content="https://backgrounds.gallery/battle" />
        <meta name="twitter:title" key="twittertitle" content="Backgrounds.Gallery | Battle" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="/SocialBanner.png" />
        <meta name="twitter:card" content="summary_large_image" />

        <meta property="og:title" key="ogtitle" content="Backgrounds.Gallery | Battle" />
        <meta property="og:url" key="ogurl" content="https://backgrounds.gallery/battle" />
        <meta property="og:description" key="ogdescription" content={description} />
        <meta property="og:type" key="ogtype" content="website" />
        <meta property="og:image" key="ogimage" content="/SocialBanner.png" />

        <link rel="alternate" hrefLang="en" href="https://backgrounds.gallery/en/battle" />
        <link rel="alternate" hrefLang="ru" href="https://backgrounds.gallery/ru/battle" />
        <link rel="alternate" hrefLang="x-default" href="https://backgrounds.gallery/battle"></link>
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
            "transition-all duration-300 ease-out hover:bg-green-500 cursor-pointer",
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

const delay = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms)
})

// function getCookie(name) {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(';').shift();
// }

function randomId() {
  const array = window.crypto.getRandomValues(new Uint8Array(16))
  const hash = Array.prototype.map.call(new Uint8Array(array.buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  return hash
}

export async function getServerSideProps(ctx) {
  // const cookies = parseCookies(ctx)

  let bgs = []
  try {
    bgs = await fetch(`${apiUrl}/api/random`).then(r => r.json())
  } catch (e) {
    console.log('get bgs server side error', e)
  }

  return {
    props: {
      // cookies,
      startBgs: bgs,
      ...await serverSideTranslations(ctx.locale, ['common']),
    }
  }
}

function useKeypress(key, action) {
  useEffect(() => {
    function onKeyup(e) {
      if (e.key === key) action()
    }
    window.addEventListener('keyup', onKeyup);
    return () => window.removeEventListener('keyup', onKeyup);
  })
}

export default Home
