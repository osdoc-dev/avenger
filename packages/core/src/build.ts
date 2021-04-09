/*
 * build fils
 * @Author: ahwgs
 * @Date: 2021-04-02 09:45:43
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-04-09 15:08:55
 */
import { ICliOpt, CLI_CONFIG_FILES } from '@avenger/shared'
import { getBundleOpts } from '@avenger/config'
import registerBabel from './register-babel'

export const build = (opt?: ICliOpt) => {
  const { cwd } = opt

  // 配置文件 babel 转一下，不然export default 报错
  registerBabel({ cwd, only: CLI_CONFIG_FILES })

  // 获取打包配置
  getBundleOpts(opt)
}
