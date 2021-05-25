import { defineConfig } from '../../packages/cli/lib'

export default defineConfig({
  esm: 'rollup',
  cjs: 'rollup',
  outFile: 'sdk',
  umd: {
    name: 'SDK',
    sourcemap: true,
  },
})
