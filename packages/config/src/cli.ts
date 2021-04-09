/*
 * 获取用户配置，如avengerrc.ts
 * @Author: ahwgs
 * @Date: 2021-04-01 00:19:05
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-04-09 15:18:42
 */

import { IBuildConfigOpt, ICliOpt, DEFAULT_FILES, CLI_CONFIG_FILES } from '@avenger/shared'
import { getExistFile, info } from '@avenger/utils'

const getConfigModule = (filePath: string) => {
  const module = require(filePath)
  return module.default || module
}

// 获取配置文件配置
const getConfigByFile = ({ cwd }): IBuildConfigOpt => {
  try {
    const configFile = getExistFile({
      cwd,
      files: CLI_CONFIG_FILES,
      returnRelative: false,
    })
    if (!configFile) return {}
    const config = getConfigModule(configFile)
    info(JSON.stringify(config))
    // 校验配置文件格式

    return config
  } catch (error) {
    console.log(error)
    return {}
  }
}

// 获取用户配置
export const getBundleOpts = (opt: ICliOpt) => {
  const { cwd, inlineConfig } = opt
  // 获取默认入口
  const entry = getExistFile({ cwd, files: DEFAULT_FILES, returnRelative: true })
  console.log('entry', entry)

  const config = getConfigByFile({ cwd })
  console.log('config', config, inlineConfig)
  // 将配置文件与行内配置合并
}
