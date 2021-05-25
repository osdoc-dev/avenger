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
      title: '更新日志',
      path: 'https://github.com/osdoc-dev/avenger/blob/master/CHANGELOG.md',
    },
    {
      title: 'GitHub',
      path: 'https://github.com/osdoc-dev/avenger',
    },
  ],
  hash: true,
  history: {
    type: 'hash',
  },
  base: '/avenger',
  publicPath: '/avenger/',
  outputPath: './dist-website',
  analytics: {
    baidu: 'dba8543d4e8693b1be1fef2ab85e33eb',
  },
})
