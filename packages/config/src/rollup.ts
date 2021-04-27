/*
 * @Author: ahwgs
 * @Date: 2021-04-02 21:35:08
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-04-27 20:30:14
 */
import path from 'path'
import { IRollupBuildOpt, IBuildConfigOpt, BundleOutTypeMap, IEsmOpt } from '@avenger/shared'
import { RollupOptions, OutputOptions } from 'rollup'
import { terser } from 'rollup-plugin-terser'

export const getRollupConfig = (opt: IRollupBuildOpt): RollupOptions => {
  const { cwd, entry, type, buildConfig } = opt || {}
  console.log('getRollupConfig opt', opt)
  const { esm, outFile } = buildConfig as IBuildConfigOpt
  const entryExt = path.extname(entry)
  // 打包输出的文件名
  const outFileName = outFile || path.basename(entry, entryExt)

  let output: OutputOptions = {}
  let plugins: any[] = []

  const input = path.join(cwd, entry)

  // rollup-plugin-terser 插件配置
  const terserOpts = {
    compress: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      warnings: false,
    },
  }

  switch (type) {
    case BundleOutTypeMap.cjs:
    case BundleOutTypeMap.esm:
      output = {
        format: type,
        file: path.join(cwd, `dist/${(esm && (esm as IEsmOpt).file) || `${outFileName}.esm`}.js`),
      }
      // 压缩
      plugins = [...(esm && (esm as IEsmOpt)?.minify ? [terser(terserOpts)] : [])]
      return { output, input, plugins }

    default:
      throw new Error(`Unsupported type ${type}`)
  }
}
