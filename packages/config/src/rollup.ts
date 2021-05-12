/*
 * @Author: ahwgs
 * @Date: 2021-04-02 21:35:08
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-05-12 19:50:33
 */
import path from 'path'
import { lodash, getExistFile, error, getPackageJson } from '@osdoc-dev/avenger-utils'
import {
  IRollupBuildOpt,
  IBuildConfigOpt,
  BundleOutTypeMap,
  IEsmOpt,
  ICjsOpt,
  IUmdOpt,
  IPackageJson,
} from '@osdoc-dev/avenger-shared'
import { RollupOptions, OutputOptions } from 'rollup'
import { terser } from 'rollup-plugin-terser'
import url from '@rollup/plugin-url'
import svgr from '@svgr/rollup'
import typescript2 from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import babel, { RollupBabelInputPluginOptions } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import tempDir from 'temp-dir'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace, { RollupReplaceOptions } from '@rollup/plugin-replace'
import inject, { RollupInjectOptions } from '@rollup/plugin-inject'
import postcss, { PostCSSPluginConf } from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import { getBabelConfig } from './babel'

interface IGetPluginOpt {
  isTs: boolean
  cwd: string
  disableTypeCheck?: boolean
  extraTypescriptPluginOpt: Object
  extraRollupPlugins?: any[]
  extensions?: string[]
  extraNodeResolvePluginOpt: Object
  include?: string
  extraReplacePluginOpts?: Object
  extraInjectPluginOpts?: Object
  target?: 'node' | 'browser'
  type: string
}

function getBablePluginOpt({ target, type, extensions }) {
  const { config } = getBabelConfig({
    target: type === 'esm' ? 'browser' : target,
    type,
    typescript: true,
  })

  const ret = {
    ...config,
    babelHelpers: 'bundled' as RollupBabelInputPluginOptions['babelHelpers'],
    exclude: /\/node_modules\//,
    babelrc: false,
    extensions,
  }
  return ret
}

/** 获取插件配置 */
function getPlugin(opt?: IGetPluginOpt) {
  const {
    isTs,
    cwd,
    disableTypeCheck,
    extraTypescriptPluginOpt,
    extraRollupPlugins,
    extensions,
    extraNodeResolvePluginOpt,
    include = /node_modules/,
    extraReplacePluginOpts,
    extraInjectPluginOpts,
    target,
    type,
  } = opt || {}

  // 获取 @rollup/plugin-babel 配置
  const babelPluOpt = getBablePluginOpt({ target, type, extensions })

  // rollup-plugin-typescript2
  const tsPlugin = isTs
    ? [
        typescript2({
          cwd,
          clean: true,
          tsconfig: path.join(cwd, 'tsconfig.json'),
          cacheRoot: `${tempDir}/.rollup_plugin_typescript2_cache`,
          useTsconfigDeclarationDir: true,
          tsconfigDefaults: {
            compilerOptions: {
              declaration: true,
              declarationDir: 'dist/types',
            },
          },
          tsconfigOverride: {
            compilerOptions: {
              module: 'ES2015',
            },
          },
          check: !disableTypeCheck,
          ...(extraTypescriptPluginOpt || {}),
        }),
      ]
    : []

  const hasReplace = extraReplacePluginOpts && Object.keys(extraReplacePluginOpts || {}).length > 0

  const hasInject = extraInjectPluginOpts && Object.keys(extraInjectPluginOpts || {}).length > 0

  const postCssPluOpt = { plugins: [autoprefixer()] } as PostCSSPluginConf

  return [
    url(),
    svgr(),
    postcss(postCssPluOpt),
    commonjs({ include }),
    nodeResolve({ mainFields: ['module', 'jsnext:main', 'main'], extensions, ...extraNodeResolvePluginOpt }),
    ...tsPlugin,
    babel(babelPluOpt),
    json(),
    ...(hasReplace ? [replace({ ...extraReplacePluginOpts } as RollupReplaceOptions)] : []),
    ...(hasInject ? [inject({ ...extraInjectPluginOpts } as RollupInjectOptions)] : []),
    ...extraRollupPlugins,
  ]
}

export const getRollupConfig = (opt: IRollupBuildOpt): RollupOptions[] => {
  const { cwd, entry, type, buildConfig } = opt || {}
  const {
    esm,
    cjs,
    umd,
    outFile,
    disableTypeCheck = false,
    extraTypescriptPluginOpt = {},
    extraRollupPlugins = [],
    extraNodeResolvePluginOpt,
    extraReplacePluginOpts,
    extraInjectPluginOpts,
    include,
    target = 'browser',
  } = buildConfig as IBuildConfigOpt

  const extensions = ['.js', '.jsx', '.ts', '.tsx', '.es6', '.es', '.mjs']

  const entryExt = path.extname(entry)
  // 是否是ts
  const isTypeScript = entryExt === '.ts' || entryExt === '.tsx'

  const pkg = getPackageJson(cwd) as IPackageJson

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
    extraTypescriptPluginOpt,
    extraRollupPlugins,
    extensions,
    extraNodeResolvePluginOpt,
    include,
    extraReplacePluginOpts,
    extraInjectPluginOpts,
    target,
    type,
  }

  // umd 基础配置
  const umdOutput = {
    format: type,
    sourcemap: umd && (umd as IUmdOpt).sourcemap,
    file: path.join(cwd, `dist/${(umd && (umd as IUmdOpt).outFile) || `${outFileName}`}.umd.js`),
    name: (umd && umd.name) || (pkg.name && lodash.camelCase(path.basename(pkg.name))),
    globals: umd && (umd as IUmdOpt).globals,
  }

  switch (type) {
    case BundleOutTypeMap.umd:
      return [
        {
          input,
          output: { ...umdOutput },
          plugins: [
            ...getPlugin(pluginOpt),
            replace({
              'process.env.NODE_ENV': JSON.stringify('development'),
            }),
          ],
        },
        // xx.umd.min.js
        ...(umd && (umd as IUmdOpt).minFile
          ? [
              {
                input,
                output: {
                  ...umdOutput,
                  file: path.join(cwd, `dist/${(umd && (umd as IUmdOpt).outFile) || `${outFileName}`}.umd.min.js`),
                },
                plugins: [
                  ...getPlugin(pluginOpt),
                  replace({
                    'process.env.NODE_ENV': JSON.stringify('production'),
                  }),
                  terser(terserOpts),
                ],
              },
            ]
          : []),
      ]
    case BundleOutTypeMap.cjs:
      output = {
        format: type,
        sourcemap: cjs && (cjs as ICjsOpt).sourcemap,
        file: path.join(cwd, `dist/${(cjs && (cjs as ICjsOpt).outFile) || `${outFileName}`}.js`),
      }
      plugins = [...getPlugin(pluginOpt), ...(cjs && (cjs as ICjsOpt)?.minify ? [terser(terserOpts)] : [])]
      return [{ output, input, plugins }]
    case BundleOutTypeMap.esm:
      output = {
        format: type,
        sourcemap: esm && (esm as IEsmOpt).sourcemap,
        file: path.join(cwd, `dist/${(esm && (esm as IEsmOpt).outFile) || `${outFileName}.esm`}.js`),
      }
      // 压缩
      plugins = [...getPlugin(pluginOpt), ...(esm && (esm as IEsmOpt)?.minify ? [terser(terserOpts)] : [])]
      return [{ output, input, plugins }]

    default:
      throw new Error(`Unsupported type ${type}`)
  }
}
