import useFetch from 'use-http'
import AnimatedPreview from './AnimatedPreview'
import Link from 'next/link'

import styled from 'styled-components'
import tw from "twin.macro"

const SortButtonViolet = styled.div`
  ${tw`p-2 rounded mx-2 cursor-pointer w-64 mx-auto mt-2 mb-4 text-white text-center`}
  background: #aa076b;
  background: linear-gradient(45deg,#61045f,#aa076b);
`

function Preview() {
  let { data = [] } = useFetch(`/api/animated`, {}, [])

  if (data.length < 4) {
    return <></>
  }

  return <div className="bg-gray-900 my-4 rounded ">
    <div className="py-2 px-4 mt-2">
      <h1 className="text-white">Animated bacgkrounds</h1>
    </div>
    <div className="py-2 px-4 grid grid-cols-2 gap-4 md:grid-cols-4">
      {data.slice(0, 4).map((item, i) => <div className="flex w-full overflow-hidden" key={item.i}>
        <AnimatedPreview item={item} />
      </div>
      )}
    </div>

    <Link href="/animated">
      <SortButtonViolet>See all animated backgrounds</SortButtonViolet>
    </Link>
  </div>
}

export default Preview