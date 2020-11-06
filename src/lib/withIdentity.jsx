import React, { useContext } from 'react'
import nextCookie from 'next-cookies'
import redirect from './redirect'
import NextApp from 'next/app'


// export interface UserIdentity {
//   id: number
//   name: string
//   email: string
// }
// type IdentityProviderProps = Readonly<AppInitialProps> & {
//   session: UserIdentity
// }
const IdentityContext = React.createContext(
  null
)

const loginPage = '/auth/login'

export const redirectToLogin = (ctx) => {
  if (
    (ctx && ctx.pathname === loginPage) ||
    (typeof window !== 'undefined' && window.location.pathname === loginPage)
  ) {
    return
  }

  redirect(ctx, loginPage)
}

// any is needed to use as JSX element
const withIdentity = (App) => {
  return class IdentityProvider extends React.Component {
    static displayName = `IdentityProvider(MyApp)`
    static async getInitialProps(
      ctx
    ) {
      // Get inner app's props
      let appProps
      if (NextApp.getInitialProps) {
        appProps = await NextApp.getInitialProps(ctx)
      } else {
        appProps = { pageProps: {} }
      }

      const { passportSession } = nextCookie(ctx.ctx)

      // Redirect to login if page is protected but no session exists
      // if (!passportSession) {
      //   redirectToLogin(ctx.ctx)
      //   return Promise.resolve({
      //     pageProps: null,
      //     session: null,
      //   })
      // }

      let session
      if (passportSession) {
        const serializedCookie = Buffer.from(passportSession, 'base64').toString()

        const {
          passport: { user },
        } = JSON.parse(serializedCookie)
        session = user
      }

      // redirect to login if cookie exists but is empty
      // if (!user) {
      //   redirectToLogin(ctx.ctx)
      // }

      // const session = user

      return {
        ...appProps,
        session,
      }
    }

    render() {
      const { session, ...appProps } = this.props

      return (
        <IdentityContext.Provider value={session}>
          <App {...appProps} />
        </IdentityContext.Provider>
      )
    }
  }
}

export default withIdentity

export const useIdentity = () => useContext(IdentityContext)
