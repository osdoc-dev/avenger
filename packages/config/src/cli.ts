/*
 * 获取用户配置，如avengerrc.ts
 * @Author: ahwgs
 * @Date: 2021-04-01 00:19:05
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-04-09 15:46:14
 */

import { IBuildConfigOpt, ICliOpt, DEFAULT_FILES, CLI_CONFIG_FILES } from '@avenger/shared'
import { getExistFile, validateSchema, error as errorLog } from '@avenger/utils'
import schema from './config-schema'

const validateConfig = config =>
  new Promise<void>((resolve, reject) => {
    validateSchema(config, schema, (msg: string) => {
      errorLog(`invalid preset options: ${msg}`)
      reject(msg)
    })
    resolve()
  })

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
    // 校验配置文件格式
    validateConfig(config)
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
