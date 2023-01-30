import styled from 'styled-components'
import clsx from 'clsx'
import { useState } from 'react'
// import Cookies from 'universal-cookie';

const CenterDiv = styled.div`
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
`

export default function Tutorial() {
  const [showTutorial, setShowTutorial] = useState(true)
  function closeTutorial() {
    setShowTutorial(false)
    document.cookie = 'disable_hello=1;max-age=31557600'
  }

  if (!showTutorial) {
    return <></>
  }

  return (
    <CenterDiv className="absolute">
      <div
        className={clsx(
          'w-80 h-80 p-4 shadow-md rounded flex justify-between flex-col',
          'text-center bg-gray-900 text-white shadow-xl',
          'transition-all duration-300 1hover:bg-green-500',
          'select-none'
        )}
      >
        <div className="mt-2 text-lg font-bold">Steam BG Battle</div>
        <div>
          <div>
            This tool was made to find the best backgrounds on steam! Vote for the best background
            by clicking on it.
          </div>
          <div className="mt-4">
            You can also login with your Steam account to save your votes history.
          </div>
        </div>
        <div
          className="mt-6 rounded bg-green-500 py-2 cursor-pointer hover:bg-green-400"
          onClick={() => {
            closeTutorial()
          }}
        >
          Ok!
        </div>

        <div
          className="absolute top-2 right-4 cursor-pointer text-gray-300 hover:text-gray-50"
          onClick={() => {
            closeTutorial()
          }}
        >
          ✖
        </div>
      </div>
    </CenterDiv>
  )
}
