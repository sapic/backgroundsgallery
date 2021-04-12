import React, { } from 'react'
// import nextCookie from 'next-cookies'
// import redirect from './redirect'
import NextApp from 'next/app'
import { CookiesProvider, Cookies } from "react-cookie";

const isBrowser = () => typeof window !== "undefined";

// any is needed to use as JSX element
const withCookies = (App) => {
  return class CookieProvider extends React.Component {
    static getCookies(ctx) {
      if (ctx && ctx.req && ctx.req.headers.cookie) {
        return new Cookies(ctx.req.headers.cookie);
      }

      return new Cookies();
    }

    static displayName = `CookieProvider(MyApp)`

    static async getInitialProps(ctx) {
      console.log("with cookiew get initial props")
      // let pageProps = {};

      // if (Component.getInitialProps) {
      //   pageProps = await Component.getInitialProps(ctx);
      // }
      let appProps
      if (NextApp.getInitialProps) {
        appProps = await NextApp.getInitialProps(ctx)
      } else {
        appProps = { pageProps: {} }
      }


      const cookies = this.getCookies(ctx.ctx);

      return { ...appProps, cookies };
    }

    // static async getInitialProps(
    //   ctx
    // ) {
    //   // Get inner app's props
    //   let appProps
    //   if (NextApp.getInitialProps) {
    //     appProps = await NextApp.getInitialProps(ctx)
    //   } else {
    //     appProps = { pageProps: {} }
    //   }

    //   const { passportSession } = nextCookie(ctx.ctx)
    //   // console.log('passport session', passportSession)

    //   // Redirect to login if page is protected but no session exists
    //   // if (!passportSession) {
    //   //   redirectToLogin(ctx.ctx)
    //   //   return Promise.resolve({
    //   //     pageProps: null,
    //   //     session: null,
    //   //   })
    //   // }

    //   let session
    //   if (passportSession) {
    //     const serializedCookie = Buffer.from(passportSession, 'base64').toString()

    //     const {
    //       passport: { user },
    //     } = JSON.parse(serializedCookie)
    //     session = user
    //   }

    //   // redirect to login if cookie exists but is empty
    //   // if (!user) {
    //   //   redirectToLogin(ctx.ctx)
    //   // }

    //   // const session = user

    //   return {
    //     ...appProps,
    //     session,
    //   }
    // }

    render() {
      const { cookies, ...appProps } = this.props
      // const { Component, pageProps, cookies } = this.props;

      return (
        <CookiesProvider cookies={isBrowser() ? undefined : cookies}>
          <div>Cookies</div>
          <App {...appProps} />
        </CookiesProvider >
      )
    }
  }
}

export default withCookies

// export const useIdentity = () => useContext(IdentityContext)