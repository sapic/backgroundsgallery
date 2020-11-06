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
    webpack(config, options) {
      config.module.rules.push({
        test: /\.(png|jpe?g|gif|svg)$/i,
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
      return config
    },
  })
