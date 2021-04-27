/*
 * @Author: ahwgs
 * @Date: 2021-04-02 21:35:08
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-04-27 23:10:55
 */
import path from 'path'
import { IRollupBuildOpt, IBuildConfigOpt, BundleOutTypeMap, IEsmOpt } from '@avenger/shared'
import { RollupOptions, OutputOptions } from 'rollup'
import { terser } from 'rollup-plugin-terser'
import url from '@rollup/plugin-url'
import svgr from '@svgr/rollup'
import typescript2 from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'

interface IGetPluginOpt {
  isTs: boolean
  cwd: string
  disableTypeCheck?: boolean
  typescriptOpts: Object
}

/** 获取插件配置 */
function getPlugin(opt?: IGetPluginOpt) {
  const { isTs, cwd, disableTypeCheck, typescriptOpts } = opt || {}

  // rollup-plugin-typescript2
  const tsPlugin = isTs
    ? [
        typescript2({
          cwd,
          clean: true,
          tsconfig: path.join(cwd, 'tsconfig.json'),
          tsconfigDefaults: {
            compilerOptions: {
              declaration: true,
            },
          },
          tsconfigOverride: {
            compilerOptions: {
              target: 'esnext',
              module: 'esnext',
            },
          },
          check: !disableTypeCheck,
          ...(typescriptOpts || {}),
        }),
      ]
    : []

  return [url(), svgr(), ...tsPlugin, babel(), json()]
}

export const getRollupConfig = (opt: IRollupBuildOpt): RollupOptions => {
  console.log('rollup 打包配置', opt)
  const { cwd, entry, type, buildConfig } = opt || {}
  const { esm, outFile, disableTypeCheck = false, typescriptOpts = {} } = buildConfig as IBuildConfigOpt

  const entryExt = path.extname(entry)
  // 是否是ts
  const isTypeScript = entryExt === '.ts' || entryExt === '.tsx'

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

  const pluginOpt = {
    isTs: isTypeScript,
    cwd,
    disableTypeCheck,
    typescriptOpts,
  }

  switch (type) {
    case BundleOutTypeMap.cjs:
    case BundleOutTypeMap.esm:
      output = {
        format: type,
        file: path.join(cwd, `dist/${(esm && (esm as IEsmOpt).file) || `${outFileName}.esm`}.js`),
      }
      // 压缩
      plugins = [...getPlugin(pluginOpt), ...(esm && (esm as IEsmOpt)?.minify ? [terser(terserOpts)] : [])]
      return { output, input, plugins }

    default:
      throw new Error(`Unsupported type ${type}`)
  }
}
