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

import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

// import { useIdentity } from '../lib/withIdentity'

import Header from '../components/Header'
import Tutorial from '../components/Tutorial'

// const bgs = require('../assets/bgs.json')

const CenterDiv = styled.div`
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
`

const VerticalCenterDiv = styled.div`
  top: 50%;
  transform: translateY(-50%);
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

  // const [enableEnter, setEnableEnter] = useState(false)
  // const { get, post, response, loading, error } = useFetch()

  // console.log('home')
  async function loadBgs() {
    // console.log('loadbgs')

    if (window && window.gtag) {
      window.gtag('event', 'loadbg', {
        'image': 'true'
      });
    }

    // const initialTodos = await get('/api/get_random_bgs')
    // const bgs = await fetch('https://random.bgb.workers.dev/').then(r => r.json())
    const bgs = await getNextBgs()
    // console.log('bgs', bgs)

    // let loadAwait = []
    // for (const bg of bgs) {
    //   loadAwait.push(preloadImage(bg.steamUrl))
    // }

    // await Promise.all(loadAwait)

    setBgs(bgs)
    // if (!enableEnter) {
    //   setTimeout(() => setEnableEnter(true), 500)
    // }
    // setEnableEnter(true)
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
      setBgsQueue(bgsQueue)
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

      setBgsQueue(bgsQueue)
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

  function ImageContainer(props) {
    const { item, ...restProps } = props
    return (
      <CSSTransition
        key={props.item.steamUrl}
        timeout={500}
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
              'transition-color duration-300 hover:bg-gray-800',
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

  // const [randomBg1, randomBg2] = bgs
  const leftBgs = bgs.filter((_, i) => i % 2 === 0)
  const rightBgs = bgs.filter((_, i) => i % 2 === 1)

  // console.log('identity', identity)
  // const bgKeys = Object.keys(bgs)
  // const randomBg1 = bgs[bgKeys[Math.floor(Math.random() * bgKeys.length)]]
  // const randomBg2 = bgs[bgKeys[Math.floor(Math.random() * bgKeys.length)]]

  return (
    <div className="bg-black">
      <Head>
        <title>Backgrounds.Steam.Design | Best Steam Backgrounds | Battle</title>
        <link rel="alternate" hrefLang="en" href="https://bgs.steam.design/en/battle" />
        <link rel="alternate" hrefLang="ru" href="https://bgs.steam.design/ru/battle" />
      </Head>

      <Header />

      <BackgroundsContainer>
        <TransitionGroup
          className="w-full h-full overflow-hidden relative vote-container"
        >
          {leftBgs.map((item) => (
            <ImageContainer item={item} key={item.steamUrl}></ImageContainer>
          ))}
        </TransitionGroup>
        <TransitionGroup className="w-full h-full overflow-hidden relative vote-container">
          {rightBgs.map((item) => (
            <ImageContainer item={item} key={item.steamUrl}></ImageContainer>
          ))}
        </TransitionGroup>
        {/* <TinyCrossfade className="w-1/2 flex flex-col justify-center"> */}
        {/* <div className="" onClick={() => { loadBgs() }} key={randomBg1.steamUrl}> */}
        {/* <img className="w-full" src={randomBg1.steamUrl} key={randomBg1.steamUrl} ></img> */}
        {/* </div> */}
        {/* </TinyCrossfade> */}
        {/* <div className="w-1/2 flex flex-col justify-center" onClick={() => { loadBgs() }}>
            <img className="w-full" src={randomBg2.steamUrl}></img>
          </div> */}

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
  // Parse
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
// Home.getInitialProps = ({ req }) => {
//   const { origin } = absoluteUrl(req, "localhost:3000");

//   return {
//     origin,
//   }
// }

export default Home

// function absoluteUrl(req, setLocalhost) {
//   var protocol = "https:";
//   var host = req
//     ? req.headers["x-forwarded-host"] || req.headers["host"]
//     : window.location.host;
//   if (host.indexOf("localhost") > -1) {
//     if (setLocalhost) host = setLocalhost;
//     protocol = "http:";
//   }
//   return {
//     protocol: protocol,
//     host: host,
//     origin: protocol + "//" + host,
//   };
// }
