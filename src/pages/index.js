import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import clsx from 'clsx';
import styled from 'styled-components'
// import useFetch from 'use-http'
import { useState } from 'react'
import { parseCookies } from 'nookies'

import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import { useIdentity } from '../lib/withIdentity'

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

function preloadImage(url) {
  return new Promise((resolve, reject) => {
    console.log('preload', url)
    let img = new Image()
    img.onload = () => {
      console.log('loaded')
      resolve()
    }
    img.src = url
  })
}

function Home({ origin, cookies }) {
  const identity = useIdentity()
  // const { loading, error, data = [] } = useFetch('/api/get_random_bgs', {}, [])
  const [bgs, setBgs] = useState([])

  // const [enableEnter, setEnableEnter] = useState(false)
  // const { get, post, response, loading, error } = useFetch()

  // console.log('home')
  // useEffect(() => {
  if (bgs.length === 0 && process.browser) loadBgs()
  // }, [])

  async function loadBgs() {
    console.log('loadbgs')
    // const initialTodos = await get('/api/get_random_bgs')
    const bgs = await fetch('https://random.bgb.workers.dev/').then(r => r.json())
    console.log('bgs', bgs)

    let loadAwait = []
    for (const bg of bgs) {
      loadAwait.push(preloadImage(bg.steamUrl))
    }

    await Promise.all(loadAwait)

    setBgs(bgs)
    // if (!enableEnter) {
    //   setTimeout(() => setEnableEnter(true), 500)
    // }
    // setEnableEnter(true)
  }

  async function trackVote(item) {
    console.log('trackVote')
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
              'shadow-xl absolute bottom-48 left-1/2 w-128',
              'transform', '-translate-x-1/2',
              'transition-color duration-300 hover:bg-gray-800'
            )}
            onClick={(e) => {
              // e.preventDefault()
              e.stopPropagation()
              console.log('click info')
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

  console.log('identity', identity)
  // const bgKeys = Object.keys(bgs)
  // const randomBg1 = bgs[bgKeys[Math.floor(Math.random() * bgKeys.length)]]
  // const randomBg2 = bgs[bgKeys[Math.floor(Math.random() * bgKeys.length)]]

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

      <div className="w-full h-screen flex pt-16">
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
          <div className="w-16 h-16 rounded-full bg-white leading-16 text-center bg-gray-900 text-white shadow-xl">
            VS
          </div>
        </CenterDiv>
        <CenterDiv className="absolute">
          <div className={clsx(
            "mt-48 w-24 h-24 rounded-full",
            "bg-white leading-24 text-center bg-gray-900 text-white shadow-xl",
            "transition-all duration-300 hover:bg-green-500 cursor-pointer",
            'select-none'
          )}
            onClick={() => { clickOnSkip() }}
          >
            Skip
          </div>
        </CenterDiv>

        {/* Popup with instructions */}
        {!cookies?.disable_hello && <Tutorial />}
      </div>
    </div >
  )
}

export async function getServerSideProps(ctx) {
  // Parse
  const cookies = parseCookies(ctx)

  return {
    props: {
      cookies
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
