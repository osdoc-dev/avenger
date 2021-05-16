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
})
