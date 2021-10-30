// import useFetch from 'use-http'
import AnimatedPreview from './AnimatedPreview'
import Link from 'next/link'

import styled from 'styled-components'
import tw from "tailwind-styled-components"

const SortButtonViolet = tw.div`
  p-2 rounded mx-2 cursor-pointer w-64 mx-auto mt-2 mb-4 text-white text-center
  bg-[#aa076b] bg-gradient-to-tr from-[#61045f] to-[#aa076b]
`

const VideoRow = styled.div`
  height: 180px;
  box-sizing: border-box;
`

function Preview({ animatedBgs }) {
  // let { data = [] } = useFetch(`/api/animated`, {}, [])

  if (animatedBgs.length < 4) {
    return <></>
  }

  return <div className="bg-gray-900 my-4 rounded ">
    <div className="py-2 px-4 mt-2">
      <h1 className="text-white">Animated bacgkrounds</h1>
    </div>
    <VideoRow className="py-2 px-4 grid grid-cols-2 gap-4 md:grid-cols-4">
      {animatedBgs.slice(0, 4).map((item, i) =>
        <div className="flex w-full overflow-hidden" key={i}>
          <AnimatedPreview item={item} />
        </div>
      )}
    </VideoRow>

    <Link href="/animated">
      <SortButtonViolet>See all animated backgrounds</SortButtonViolet>
    </Link>
  </div>
}

export default Preview