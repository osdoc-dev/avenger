/*
 * @Author: ahwgs
 * @Date: 2021-04-02 09:42:11
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-06-23 21:38:21
 */

export type TBundleType = 'rollup' | 'babel'

export type TBundleOutType = 'esm' | 'cjs' | 'umd'

export interface IBundleOutTypeMapProps {
  [propName: string]: TBundleOutType
}

export interface IStringObject {
  [prop: string]: string
}

export interface IBundleOutType {
  type: TBundleType
  outFile?: string
}

export interface IEsmOpt extends IBundleOutType {
  minify?: boolean
  sourcemap?: boolean
}

export interface ICjsOpt extends IBundleOutType {
  minify?: boolean
  sourcemap?: boolean
}

export interface IUmdOpt {
  name: string
  sourcemap?: boolean
  minFile?: boolean
  outFile?: string
  globals?: IStringObject
}

// 用户配置
export interface IBuildConfigOpt {
  entry?: string // 输入
  outFile?: string // 输出
  esm?: TBundleType | IEsmOpt | false // 支持配置 'esm' | {type:'esm'} | false
  cjs?: TBundleType | ICjsOpt | false //
  umd?: IUmdOpt | false //
  disableTypeCheck?: boolean
  target?: 'node' | 'browser'
  nodeVersion?: number
  extraTypescriptPluginOpt?: Object
  /** 拓展 rollup plugins */
  extraRollupPlugins?: any[]
  extraNodeResolvePluginOpt?: Object
  include?: string // commonjs 插件
  extraReplacePluginOpts?: Object // replace 插件
  extraInjectPluginOpts?: Object // inject 插件
  extraPostCssPluginOpt?: Object[] // postcss plugin 额外的插件
  extraPostCssOpt?: Object // postcss 插件额外配置
  autoprefixerOpts?: Object
  extractCSS?: boolean // 抽离 css 为单独文件
  cssModule?: boolean | Record<string, any>
  injectCSS?: boolean
  rollupSassOpt?: Object
  rollupLessOpt?: Object
  runtimeHelpers?: boolean // babel runtimeHelpers
  extraBabelPlugins?: any[]
  extraBabelPresets?: any[]
  extraExternal?: string[]
}

export interface IRollupBuildOpt {
  cwd: string
  entry: string
  type: TBundleOutType
  buildConfig: IBuildConfigOpt
  watch?: boolean
}

// cli 行内配置
export interface ICliOpt {
  watch?: boolean
  cwd?: string
  inlineConfig?: IBuildConfigOpt
}

export interface IRollupOptions {
  entry?: string
}

export interface IGetBabelConfigProps {
  target: 'browser' | 'node'
  nodeVersion?: number
  type?: TBundleOutType
  typescript?: boolean
  runtimeHelpers?: boolean
}

export interface IObjectProps {
  [propName: string]: string
}

export interface IPackageJson {
  dependencies?: Object
  peerDependencies?: Object
  name?: string
  scripts: any
}

export interface ICreateOptions {
  force?: boolean
  template?: string
  git?: string
}

export interface ICreateOpt {
  name: string
  options?: ICreateOptions
}

export interface IPackageJsonData {
  [key: string]: any
}
