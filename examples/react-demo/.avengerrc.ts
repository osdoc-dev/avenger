import { defineConfig } from '../../packages/cli/lib'

export default defineConfig({
  esm: 'rollup',
  cjs: 'rollup',
  umd: {
    name: 'aaaa',
  },
  cssModule: true,
})
