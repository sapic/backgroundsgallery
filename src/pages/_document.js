import Document, { Html, Main, Head as DocumentHead, NextScript } from "next/document";
import Head from 'next/head'

import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html>
        <DocumentHead>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="manifest" href="/manifest.webmanifest" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="apple-mobile-web-app-title" content="Backgrounds.Steam.Design" />
          <meta name="description" content="Best steam backgrounds collection! Find your favorite!" />
          <meta name="keywords" content="steam, profile, crop, steam profile, background crop, background crop tool, background, backgrounds, steamdesign, design, best backgrounds, top, backgrounds top, background top, vote, background battle"></meta>
          <meta name="application-name" content="Backgrounds.Steam.Design" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="msapplication-TileColor" content="#12151a" />
          <meta name="theme-color" content="#12151a" />

          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=G-J8E51S5C1T`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-J8E51S5C1T', {
                page_path: window.location.pathname,
              });
          `
            }}
          />
        </DocumentHead>
        <Head>
          <meta property="og:title" key="ogtitle" content="Backgrounds.Steam.Design" />
          <meta property="og:type" key="ogtype" content="website" />
          <meta property="og:image" key="ogimage" content="/SocialBanner.png" />
          <meta property="og:url" key="ogurl" content="https://bgs.steam.design/" />
          <meta property="og:description" key="ogdescription" content="Best steam backgrounds collection! Find your favorite!" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" key="twittertitle" content="Backgrounds.Steam.Design" />
          <meta name="twitter:description" content="Best steam backgrounds collection! Find your favorite!" />
          <meta name="twitter:image" content="/SocialBanner.png" />
          <meta name="twitter:url" key="twitterurl" content="https://bgs.steam.design/" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <div className="hidden">
            <h1>This site will help you find best background for your steam profile!</h1>
          </div>
        </body>
      </Html>
    );
  }
}