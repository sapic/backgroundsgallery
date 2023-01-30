import Link from 'next/link'
import { useIdentity } from '../../lib/withIdentity'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { useTranslation } from 'next-i18next'
import { useCookies } from 'react-cookie'

import LogoSvg from '../../assets/images/logo.svg'

export default function Header() {
  const identity = useIdentity()
  const { pathname } = useRouter()
  const { t } = useTranslation()
  const [cookies] = useCookies(['bgsspid'])

  return (
    <header
      className={clsx([
        'flex fixed top-0 inset-x-0 z-100 h-16 items-center text-white',
        'bg-gray-900 border-b border-gray-800',
        'px-4 md:px-0',
      ])}
    >
      <div
        className={clsx([
          'w-full relative mx-auto flex justify-between',
          'max-w-screen-sm sm:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl',
        ])}
      >
        <div className="flex">
          {/* <div> */}
          <Link href="/" className="flex items-center">
            <LogoSvg className="w-12 h-12" />
            {/* <img className="w-12 h-12" src={require('@/assets/images/logo-asset.svg')} alt=""></img> */}
          </Link>
          {/* </div> */}
          <div className="flex mx-4">
            <Link
              href="/"
              className={clsx([
                'flex items-center font-medium text-sm md:text-lg mx-2 md:mx-4',
                pathname === '/' && 'text-blue-300',
              ])}
            >
              {t('header.top')}
            </Link>
            <Link
              href="/animated"
              className={clsx([
                'flex items-center font-medium text-sm md:text-lg mx-2 md:mx-4',
                pathname === '/animated' && 'text-blue-300',
              ])}
            >
              {t('header.animated')}
            </Link>

            <Link
              href="/battle"
              className={clsx([
                'flex items-center font-medium text-sm md:text-lg mx-2 md:mx-4',
                pathname === '/battle' && 'text-blue-300',
              ])}
            >
              {t('header.battle')}
            </Link>
            {(identity || cookies.bgsspid) && (
              <Link
                href="/history"
                className={clsx([
                  'flex items-center font-medium text-sm md:text-lg mx-2 md:mx-4',
                  pathname === '/history' && 'text-blue-300',
                ])}
              >
                {t('header.history')}
              </Link>
            )}
          </div>
        </div>

        {identity && identity.id ? (
          <div className="flex items-center">
            <img className="w-12 h-12 rounded-full" alt="" src={identity.photos[0].value}></img>
            <a className="ml-4 align-middle text-sm md:text-lg" href="/api/logout">
              {t('header.logout')}
            </a>
          </div>
        ) : (
          <div className="flex flex-col justify-center text-sm md:text-lg">
            <a href="/api/auth/steam">{t('header.login')}</a>
          </div>
        )}
      </div>
    </header>
  )
}
