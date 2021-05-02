const { i18n } = require('./next-i18next.config')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports =
  // withImages({
  withBundleAnalyzer({
    inlineImageLimit: 1024,

    pageExtensions: ['js', 'jsx', 'mdx'],
    experimental: {
      modern: true,
    },

    i18n,

    webpack(config, options) {
      // config.module.rules.push({
      //   test: /\.(png|jpe?g|gif|svg)$/i,
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         publicPath: '/_next',
      //         name: 'static/media/[name].[hash].[ext]',
      //         esModule: false
      //       },
      //     },
      //   ],
      // })

      config.module.rules.push({
        test: /-asset\.svg$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: '/_next',
              name: 'static/media/[name].[hash].[ext]',
              esModule: false
            },
          },
        ],
      })

      config.module.rules.unshift({
        test: /\.svg$/,
        exclude: /(node_modules)|(asset\.svg)/,
        // issuer: {
        //   // test: /\.(js|ts)x?$/,
        // },
        use: ['@svgr/webpack'],
      })
      // config.module.rules.push({
      //   test: /\.svg$/,
      //   use: ["@svgr/webpack"]
      // });

      console.log(config.module.rules)



      return config
    },

    images: {
      domains: ['google.com']
    }
  })
