/*
 * build fils
 * @Author: ahwgs
 * @Date: 2021-04-02 09:45:43
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-04-27 22:41:59
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
import { info, rimraf } from '@osdoc-dev/avenger-utils'
import registerBabel from './register-babel'
import { rollupBuild } from './rollup'

export const build = (opt?: ICliOpt) => {
  const { cwd, watch = true } = opt

  // 配置文件 babel 转一下，不然export default 报错
  registerBabel({ cwd, only: CLI_CONFIG_FILES })

  // 获取打包配置
  const buildConfig = getBundleOpts(opt)
  info(`build config ===> ${JSON.stringify(buildConfig)}`)

  // 删除编译产物
  rimraf.sync(path.join(cwd, 'dist'))

  const { esm, entry, cjs } = buildConfig as IBuildConfigOpt

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
}
