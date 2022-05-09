import Document, { Html, Main, Head as DocumentHead, NextScript } from 'next/document'

import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps (ctx) {
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

  render () {
    return (
      <Html>
        <DocumentHead>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="manifest" href="/manifest.webmanifest" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="apple-mobile-web-app-title" content="Backgrounds.Gallery" />
          <meta name="keywords" content="steam, profile, steam profile, gallery, backgrounds gallery, steam gallery, background, backgrounds, steamdesign, design, best backgrounds, top, backgrounds top, background top, vote, background battle"></meta>
          <meta name="application-name" content="Backgrounds.Gallery" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="msapplication-TileColor" content="#12151a" />
          <meta name="theme-color" content="#12151a" />

          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={'https://www.googletagmanager.com/gtag/js?id=G-J8E51S5C1T'}
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
          `,
            }}
          />

          {/* google ads */}
          {/* <script data-ad-client="ca-pub-1034829471687394" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script> */}

        </DocumentHead>
        <body>
          <Main />
          <NextScript />
          <div className="hidden">
            <h1>This site will help you find best background for your steam profile!</h1>
          </div>
        </body>
      </Html>
    )
  }
}
