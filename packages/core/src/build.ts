/*
 * build fils
 * @Author: ahwgs
 * @Date: 2021-04-02 09:45:43
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-04-27 19:43:21
 */
import path from 'path'
import { ICliOpt, CLI_CONFIG_FILES, IBuildConfigOpt, IEsmOpt, BundleTypeMap, BundleOutTypeMap } from '@avenger/shared'
import { getBundleOpts } from '@avenger/config'
import { info, rimraf } from '@avenger/utils'
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

  const { esm, entry } = buildConfig || ({} as IBuildConfigOpt)

  // build esm
  if (esm) {
    const esmOpt = esm as IEsmOpt
    const { importLibToEs = true } = esmOpt || {}
    if (esmOpt.type === BundleTypeMap.rollup)
      rollupBuild({ cwd, type: BundleOutTypeMap.esm, entry, watch, buildConfig, importLibToEs })
  }
}
