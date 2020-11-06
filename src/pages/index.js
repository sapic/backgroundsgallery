import Head from 'next/head'
import styles from '../styles/Home.module.css'
import clsx from 'clsx';
import styled from 'styled-components'
import useFetch from 'use-http'
import { useState, useEffect } from 'react'

import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import { useIdentity } from '../lib/withIdentity'

import Header from '../components/Header'

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

export default function Home() {
  const identity = useIdentity()
  // const { loading, error, data = [] } = useFetch('/api/get_random_bgs', {}, [])
  const [bgs, setBgs] = useState([])
  const { get, post, response, loading, error } = useFetch()

  useEffect(() => { loadBgs() }, [])

  async function loadBgs() {
    console.log('loadbgs')
    // const initialTodos = await get('/api/get_random_bgs')
    const bgs = await fetch('/api/random').then(r => r.json())
    console.log('bgs', bgs)

    let loadAwait = []
    for (const bg of bgs) {
      loadAwait.push(preloadImage(bg.steamUrl))
    }

    await Promise.all(loadAwait)

    setBgs(bgs)
  }

  async function trackVote(item) {
    console.log('trackVote')
    await fetch('/api/vote', {
      method: 'POST',
      body: JSON.stringify({
        item,
      })
    })
  }

  async function clickOnImage(item) {
    trackVote(item)
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
        <div className="w-full flex flex-col justify-center absolute h-full select-none cursor-pointer" onClick={() => { clickOnImage(item) }}>
          <VerticalCenterDiv className="absolute w-full">
            <img className="w-full transform scale-105 hover:scale-110 transition-all duration-500 user-drag-none" src={props.item.steamUrl}></img>
          </VerticalCenterDiv>
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
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="w-full h-screen flex pt-16">
        <TransitionGroup className="w-full h-full overflow-hidden relative">
          {leftBgs.map((item) => (
            <ImageContainer item={item} key={item.steamUrl}></ImageContainer>
          ))}
        </TransitionGroup>
        <TransitionGroup className="w-full h-full overflow-hidden relative">
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

        <CenterDiv className="absolute left-8 text-white">
          <div className="w-16 h-16 rounded-full bg-white leading-16 text-black text-center">
            VS
          </div>
        </CenterDiv>
      </div>
    </div>
  )
}
