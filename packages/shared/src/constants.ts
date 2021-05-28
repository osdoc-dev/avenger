/*
 * @Author: ahwgs
 * @Date: 2021-04-01 00:20:14
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-05-28 14:10:40
 */
import { IBundleOutTypeMapProps } from './types'

// 支持的配置文件名称
export const CLI_CONFIG_FILES = ['.avengerrc.js', '.avengerrc.ts', '.avenger.config.js', '.avenger.config.ts']

// 默认读取文件
export const DEFAULT_FILES = ['src/index.tsx', 'src/index.ts', 'src/index.jsx', 'src/index.js']

export const BundleTypeMap = {
  babel: 'babel',
  rollup: 'rollup',
}

export const BundleOutTypeMap = {
  esm: 'esm',
  cjs: 'cjs',
  umd: 'umd',
} as IBundleOutTypeMapProps

export const CreateProjectType = {
  basic: 'basic',
  react: 'react',
}
