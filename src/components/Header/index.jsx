import Link from 'next/link';
import { useIdentity } from '@/lib/withIdentity'

// const loginUrl = () => {
//   const returnUrl = encodeURIComponent(
//     process.env.NODE_ENV === 'production'
//       ? 'https://steam.design'
//       : 'http://localhost:3000',
//   ) + '/api/auth/callback/steam'
//   const realm = encodeURIComponent(
//     process.env.NODE_ENV === 'production'
//       ? 'https://steam.design'
//       : 'http://localhost:3000',
//   )
//   return `https://steamcommunity.com/openid/login?openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.mode=checkid_setup&openid.return_to=${returnUrl}&openid.realm=${realm}&openid.ns.sreg=http%3A%2F%2Fopenid.net%2Fextensions%2Fsreg%2F1.1&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select`
// }

export default function Header() {
  const identity = useIdentity()
  return <header className="flex bg-gray-900 border-b border-gray-800 fixed top-0 inset-x-0 z-100 h-16 items-center text-white">
    <div className="w-full max-w-screen-xl relative mx-auto flex justify-between">
      <div className="flex">
        <div>
          <Link href="/">
            <a className="flex items-center">
              <img className="w-12 h-12" src={require('@/assets/images/logo.svg')} alt=""></img>
            </a>
          </Link>
        </div>
        <div className="flex mx-8">
          <Link href="/">
            <a className="flex items-center">
              Backgrounds battle
            </a>
          </Link>
        </div>
      </div>


      {identity && identity.id
        ? (
          <div className="flex items-center">
            <img className="w-12 h-12 rounded-full" alt="" src={identity.photos[0].value} ></img>
            <a className="ml-4 h-6 align-middle" href="/api/logout"> Logout </a>
          </div>
        )
        : <div className="flex flex-col justify-center">
          <a className="h-6" href="/api/auth/steam">Login through Steam</a>
        </div>
      }
    </div>
  </header>
}