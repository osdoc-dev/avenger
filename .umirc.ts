import { defineConfig } from 'dumi'

export default defineConfig({
  title: '@osdoc-dev/avenger',
  mode: 'site',
  resolve: {
    includes: ['./website'],
    previewLangs: [],
  },
  locales: [['zh-CN', '中文']],
  logo: 'https://static.ahwgs.cn/avenger_logo.jpeg',
  navs: [
    null,
    {
      title: 'GitHub',
      path: 'https://github.com/osdoc-dev/avenger',
    },
  ],
})
