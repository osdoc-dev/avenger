/*
 * @Author: ahwgs
 * @Date: 2021-04-02 21:35:08
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-04-29 21:57:08
 */
import path from 'path'
import { IRollupBuildOpt, IBuildConfigOpt, BundleOutTypeMap, IEsmOpt, ICjsOpt } from '@osdoc-dev/avenger-shared'
import { RollupOptions, OutputOptions } from 'rollup'
import { terser } from 'rollup-plugin-terser'
import url from '@rollup/plugin-url'
import svgr from '@svgr/rollup'
import typescript2 from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import babel, { RollupBabelInputPluginOptions } from '@rollup/plugin-babel'
import tempDir from 'temp-dir'
import { getExistFile, error } from '@osdoc-dev/avenger-utils'

interface IGetPluginOpt {
  isTs: boolean
  cwd: string
  disableTypeCheck?: boolean
  typescriptOpts: Object
}

function getBablePluginOpt() {
  const ret = {
    babelHelpers: 'bundled' as RollupBabelInputPluginOptions['babelHelpers'],
  }
  return ret
}

/** 获取插件配置 */
function getPlugin(opt?: IGetPluginOpt) {
  const { isTs, cwd, disableTypeCheck, typescriptOpts } = opt || {}

  // 获取 @rollup/plugin-babel 配置
  const babelPluOpt = getBablePluginOpt()

  // rollup-plugin-typescript2
  const tsPlugin = isTs
    ? [
        typescript2({
          cwd,
          clean: true,
          tsconfig: path.join(cwd, 'tsconfig.json'),
          cacheRoot: `${tempDir}/.rollup_plugin_typescript2_cache`,
          tsconfigDefaults: {
            compilerOptions: {
              declaration: true,
            },
          },
          tsconfigOverride: {
            compilerOptions: {
              module: 'ES2015',
            },
          },
          check: !disableTypeCheck,
          ...(typescriptOpts || {}),
        }),
      ]
    : []

  return [url(), svgr(), ...tsPlugin, babel(babelPluOpt), json()]
}

export const getRollupConfig = (opt: IRollupBuildOpt): RollupOptions => {
  console.log('rollup 打包配置', opt)
  const { cwd, entry, type, buildConfig } = opt || {}
  const { esm, cjs, outFile, disableTypeCheck = false, typescriptOpts = {} } = buildConfig as IBuildConfigOpt

  const entryExt = path.extname(entry)
  // 是否是ts
  const isTypeScript = entryExt === '.ts' || entryExt === '.tsx'

  if (isTypeScript) {
    const tsConfigFile = getExistFile({
      cwd,
      files: ['tsconfig.json'],
      returnRelative: false,
    })
    if (!tsConfigFile) {
      error('未找到 tsconfig.json 文件')
      process.exit(1)
    }
  }

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
      output = {
        format: type,
        sourcemap: cjs && (cjs as ICjsOpt).sourcemap,
        file: path.join(cwd, `dist/${(cjs && (cjs as ICjsOpt).outFile) || `${outFileName}`}.js`),
      }
      plugins = [...getPlugin(pluginOpt), ...(cjs && (cjs as ICjsOpt)?.minify ? [terser(terserOpts)] : [])]
      return { output, input, plugins }
    case BundleOutTypeMap.esm:
      output = {
        format: type,
        sourcemap: esm && (esm as IEsmOpt).sourcemap,
        file: path.join(cwd, `dist/${(esm && (esm as IEsmOpt).outFile) || `${outFileName}.esm`}.js`),
      }
      // 压缩
      plugins = [...getPlugin(pluginOpt), ...(esm && (esm as IEsmOpt)?.minify ? [terser(terserOpts)] : [])]
      return { output, input, plugins }

    default:
      throw new Error(`Unsupported type ${type}`)
  }
}
