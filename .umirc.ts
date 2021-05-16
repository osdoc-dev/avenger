import { defineConfig } from 'dumi'
const assetDir = 'static'
export default defineConfig({
  title: '@osdoc-dev/avenger',
  mode: 'site',
  resolve: {
    includes: ['./website'],
    previewLangs: [],
  },
  locales: [['zh-CN', '中文']],
  logo: 'https://static.ahwgs.cn/avenger_logo.jpeg',
  favicon: 'https://static.ahwgs.cn/avenger_logo.jpeg',
  navs: [
    null,
    {
      title: 'GitHub',
      path: 'https://github.com/osdoc-dev/avenger',
    },
  ],
  hash: true,
  outputPath: './dist-website',
  base: '/avenger/',
  chainWebpack(config, { env, webpack, createCSSRule }) {
    config.output
      .filename(assetDir + '/js/[name].[hash:8].js')
      .chunkFilename(assetDir + '/js/[name].[contenthash:8].chunk.js')

    // 修改css输出目录
    config.plugin('extract-css').tap(() => [
      {
        filename: `${assetDir}/css/[name].[contenthash:8].css`,
        chunkFilename: `${assetDir}/css/[name].[contenthash:8].chunk.css`,
        ignoreOrder: true,
      },
    ])
  },
})
