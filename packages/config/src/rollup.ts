/*
 * @Author: ahwgs
 * @Date: 2021-04-02 21:35:08
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-07-21 18:05:33
 */
import path from 'path'
import { readFileSync, existsSync } from 'fs'
import { lodash, getExistFile, error, getPackageJson } from '@osdoc-dev/avenger-utils'
import {
  IRollupBuildOpt,
  IBuildConfigOpt,
  BundleOutTypeMap,
  IEsmOpt,
  ICjsOpt,
  IUmdOpt,
  TBundleOutType,
  IPackageJson,
} from '@osdoc-dev/avenger-shared'
import { RollupOptions, OutputOptions } from 'rollup'
import { terser, Options } from 'rollup-plugin-terser'
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
import NpmImport from 'less-plugin-npm-import'
import { getBabelConfig } from './babel'

interface IGetPluginOpt {
  minimizeCss?: boolean
}

export function getExternal(opts: { cwd: string; formatType: TBundleOutType }): string[] {
  const pkgFile = path.join(opts.cwd, 'package.json')
  if (!existsSync(pkgFile)) return []
  const pkg = JSON.parse(readFileSync(pkgFile, 'utf-8'))
  return [
    ...(opts.formatType !== BundleOutTypeMap.umd ? Object.keys(pkg.dependencies || {}) : []),
    ...Object.keys(pkg.peerDependencies || {}),
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
    extraPostCssPluginOpt = [],
    nodeVersion,
    extractCSS = false,
    injectCSS = true,
    cssModule,
    extraPostCssOpt,
    autoprefixerOpts,
    rollupSassOpt,
    rollupLessOpt,
    runtimeHelpers,
    extraBabelPlugins,
    extraBabelPresets,
    extraExternal = [],
  } = buildConfig as IBuildConfigOpt

  const external = [...getExternal({ cwd, formatType: type }), ...extraExternal]

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
  const terserOpts: Options = {
    compress: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
    },
    output: { comments: false },
    ecma: 5,
  }

  /** 获取插件配置 */
  function getPlugin(getPluginOpt?: IGetPluginOpt) {
    const { minimizeCss = false } = getPluginOpt || {}
    const runtimeH = type === BundleOutTypeMap.cjs ? false : runtimeHelpers

    // babel plugin opt 使用内置获取 babel 配置
    const getBablePluginOpt = () => {
      const { config } = getBabelConfig({
        target: type === 'esm' ? 'browser' : target,
        type,
        nodeVersion,
        typescript: true,
        runtimeHelpers: runtimeH,
      })

      if (extraBabelPlugins && extraBabelPlugins.length > 0) config.plugins.push(...extraBabelPlugins)
      if (extraBabelPresets && extraBabelPresets.length > 0) config.presets.push(...extraBabelPresets)

      const ret = {
        ...config,
        babelHelpers: runtimeH ? 'runtime' : ('bundled' as RollupBabelInputPluginOptions['babelHelpers']),
        exclude: /\/node_modules\//,
        babelrc: false,
        extensions,
      }
      return ret
    }

    // 获取 @rollup/plugin-babel 配置
    const babelPluOpt = getBablePluginOpt()

    // rollup-plugin-typescript2
    const tsPlugin = isTypeScript
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

    // https://www.npmjs.com/package/rollup-plugin-postcss
    const postCssPluOpt = {
      extract: extractCSS,
      inject: injectCSS,
      modules: cssModule,
      minimize: minimizeCss,
      ...(cssModule ? { autoModules: false } : {}),
      use: {
        less: {
          plugins: [new NpmImport({ prefix: '~' })],
          javascriptEnabled: true,
          ...rollupLessOpt,
        },
        sass: {
          ...rollupSassOpt,
        },
        stylus: false,
      },
      // extraPostCssPluginOpt postcss plugin 拓展配置
      plugins: [autoprefixer({ remove: false, ...autoprefixerOpts }), ...extraPostCssPluginOpt],
      ...extraPostCssOpt,
    } as PostCSSPluginConf

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

  // umd 基础配置
  const umdOutput = {
    format: type,
    sourcemap: umd && (umd as IUmdOpt).sourcemap,
    file: path.join(cwd, `dist/${(umd && (umd as IUmdOpt).outFile) || `${outFileName}`}.umd.js`),
    name: (umd && umd.name) || (pkg.name && lodash.camelCase(path.basename(pkg.name))),
    globals: umd && (umd as IUmdOpt).globals,
  }

  const treeshakeOpt = {
    propertyReadSideEffects: false,
  }

  switch (type) {
    case BundleOutTypeMap.umd:
      return [
        {
          input,
          output: { ...umdOutput },
          treeshake: treeshakeOpt,
          plugins: [
            ...getPlugin(),
            replace({
              'process.env.NODE_ENV': JSON.stringify('development'),
            }),
          ],
          external,
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
                  ...getPlugin({ minimizeCss: true }),
                  replace({
                    'process.env.NODE_ENV': JSON.stringify('production'),
                  }),
                  terser(terserOpts),
                ],
                external,
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
      plugins = [
        ...getPlugin({ minimizeCss: (cjs as ICjsOpt)?.minify }),
        ...((cjs as ICjsOpt)?.minify ? [terser(terserOpts)] : []),
      ]
      return [{ output, input, plugins, external, treeshake: treeshakeOpt }]
    case BundleOutTypeMap.esm:
      output = {
        format: type,
        sourcemap: esm && (esm as IEsmOpt).sourcemap,
        file: path.join(cwd, `dist/${(esm && (esm as IEsmOpt).outFile) || `${outFileName}.esm`}.js`),
      }
      // 压缩
      plugins = [
        ...getPlugin({ minimizeCss: (esm as IEsmOpt)?.minify }),
        ...(esm && (esm as IEsmOpt)?.minify ? [terser(terserOpts)] : []),
      ]
      return [{ output, input, plugins, external, treeshake: treeshakeOpt }]

    default:
      throw new Error(`Unsupported type ${type}`)
  }
}
