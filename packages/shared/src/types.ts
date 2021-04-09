/*
 * @Author: ahwgs
 * @Date: 2021-04-02 09:42:11
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-04-09 15:08:41
 */

import { ModuleFormat } from 'rollup'

export type BundleType = 'rollup' | 'babel'

export interface IEsmOpt {}

export interface IBuildConfigOpt {
  entry?: string | string[] // 输入
  outFile?: string // 输出
  esm?: string
  extraBabelPlugins?: any[]
  extraBabelPresets?: any[]
}

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
  type?: ModuleFormat
  typescript?: boolean
}
