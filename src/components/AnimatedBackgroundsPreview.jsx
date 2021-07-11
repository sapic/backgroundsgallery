import useFetch from 'use-http'
import AnimatedPreview from './AnimatedPreview'

function Preview() {
  let { data = [] } = useFetch(`/api/animated`, {}, [])

  if (data.length < 4) {
    return <></>
  }

  return <>
    <div className="bg-gray-900 py-2 px-4 rounded mt-2">
      <h1 className="text-white">Animated bacgkrounds</h1>
    </div>
    <div className="flex flex-wrap">
      {data.slice(0, 999).map((item, i) => <AnimatedPreview item={item} key={item.i} />)}
    </div>
  </>
}

export default Preview