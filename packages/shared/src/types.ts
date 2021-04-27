/*
 * @Author: ahwgs
 * @Date: 2021-04-02 09:42:11
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-04-27 23:06:01
 */

export type TBundleType = 'rollup' | 'babel'

export type TBundleOutType = 'esm' | 'cjs'

export interface IBundleOutTypeMapProps {
  [propName: string]: TBundleOutType
}

export interface IBundleOutType {
  type: TBundleType
  file?: string
}

export interface IEsmOpt extends IBundleOutType {
  importLibToEs?: boolean
  minify?: boolean
}

// 用户配置
export interface IBuildConfigOpt {
  entry?: string // 输入
  outFile?: string // 输出
  esm?: TBundleType | IEsmOpt | false // 支持配置 'esm' | {type:'esm'} | false
  extraBabelPlugins?: any[]
  extraBabelPresets?: any[]
  disableTypeCheck?: boolean
  typescriptOpts?: Object
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
}

export interface IObjectProps {
  [propName: string]: string
}
