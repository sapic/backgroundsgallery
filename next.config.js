const { i18n } = require('./next-i18next.config')

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })

module.exports =
  // withImages({
  // withBundleAnalyzer({{
    {
      inlineImageLimit: 1024,

      pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
      experimental: {
        modern: true,
      },

      i18n,

      webpack (config) {
        config.module.rules.push({
          test: /-asset\.svg$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                publicPath: '/_next',
                name: 'static/media/[name].[hash].[ext]',
                esModule: false,
              },
            },
          ],
        })

        config.module.rules.unshift({
          test: /\.svg$/,
          exclude: /(node_modules)|(asset\.svg)/,
          use: ['@svgr/webpack'],
        })

        return config
      },

      images: {
        domains: ['google.com'],
      },
    }
// })
