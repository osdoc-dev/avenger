import { defineConfig } from '@osdoc-dev/avenger-cli'

export default defineConfig({
  esm: 'rollup',
  cjs: 'rollup',
  cssModule: true,
})
