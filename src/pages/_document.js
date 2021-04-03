import Document, { Html, Head, Main, NextScript } from "next/document";

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
        <Head>
          <title>Steam.Design BG Battle</title>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="manifest" href="/manifest.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#12151a" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="apple-mobile-web-app-title" content="Steam.Design" />
          <meta name="description" content="Best steam backgrounds collection! Find your favorite!" />
          <meta name="keywords" content="steam, profile, crop, steam profile, background crop, background crop tool, background, backgrounds, valve, steamdesign, design, best backgrounds, top, backgrounds top, background top, vote, background battle"></meta>
          <meta name="application-name" content="Steam.Design" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="msapplication-TileColor" content="#12151a" />
          <meta name="theme-color" content="#12151a" />
          <meta property="og:title" content="Steam.Design" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="/SocialBanner.png" />
          <meta property="og:url" content="https://steam.design/" />
          <meta property="og:description" content="Best steam backgrounds collection! Find your favorite!" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Steam.Design" />
          <meta name="twitter:description" content="Best steam backgrounds collection! Find your favorite!" />
          <meta name="twitter:image" content="/SocialBanner.png" />
          <meta name="twitter:url" content="https://steam.design/" />

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
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}