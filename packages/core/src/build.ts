/*
 * build fils
 * @Author: ahwgs
 * @Date: 2021-04-02 09:45:43
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-05-07 00:15:09
 */
import path from 'path'
import {
  ICliOpt,
  CLI_CONFIG_FILES,
  IBuildConfigOpt,
  IEsmOpt,
  ICjsOpt,
  BundleTypeMap,
  BundleOutTypeMap,
} from '@osdoc-dev/avenger-shared'
import { getBundleOpts } from '@osdoc-dev/avenger-config'
import { logWithSpinner, rimraf } from '@osdoc-dev/avenger-utils'
import registerBabel from './register-babel'
import { rollupBuild } from './rollup'

export const build = (opt?: ICliOpt) => {
  const { cwd, watch = true } = opt

  // 配置文件 babel 转一下，不然export default 报错
  registerBabel({ cwd, only: CLI_CONFIG_FILES })

  // 获取打包配置
  const buildConfig = getBundleOpts(opt)
  logWithSpinner('获取打包配置', '')
  logWithSpinner('', JSON.stringify(buildConfig))
  logWithSpinner('删除编译产物', '')

  // 删除编译产物
  rimraf.sync(path.join(cwd, 'dist'))

  const { esm, entry, cjs, umd } = buildConfig as IBuildConfigOpt

  logWithSpinner('执行打包 📦', '')

  // build esm
  if (esm) {
    const esmOpt = esm as IEsmOpt
    if (esmOpt.type === BundleTypeMap.rollup)
      rollupBuild({ cwd, type: BundleOutTypeMap.esm, entry, watch, buildConfig })
  }

  // build cjs
  if (cjs) {
    const cjsOpt = cjs as ICjsOpt
    if (cjsOpt.type === BundleTypeMap.rollup)
      rollupBuild({ cwd, type: BundleOutTypeMap.cjs, entry, watch, buildConfig })
  }

  // build umd
  if (umd && umd.name) rollupBuild({ cwd, type: BundleOutTypeMap.umd, entry, watch, buildConfig })
}
