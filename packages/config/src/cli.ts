/*
 * 获取用户配置，如avengerrc.ts
 * @Author: ahwgs
 * @Date: 2021-04-01 00:19:05
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-05-13 17:36:19
 */

import { IBuildConfigOpt, ICliOpt, DEFAULT_FILES, CLI_CONFIG_FILES } from '@osdoc-dev/avenger-shared'
import { getExistFile, validateSchema, error as errorLog, lodash, log } from '@osdoc-dev/avenger-utils'
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

    if (!configFile) {
      errorLog(`未找到配置文件,请检查是否包含${CLI_CONFIG_FILES.toString()}文件`)
      process.exit(1)
    }
    const config = getConfigModule(configFile)
    // 校验配置文件格式
    validateConfig(config)
    return config
  } catch (error) {
    log(`get config with file error:${error.message}`)
    return {}
  }
}

// 获取用户配置
export const getBundleOpts = (opt: ICliOpt): IBuildConfigOpt => {
  const { cwd, inlineConfig } = opt
  // 获取默认入口
  const entry = getExistFile({ cwd, files: DEFAULT_FILES, returnRelative: true })

  if (!entry) {
    errorLog(`未找到文件入口，entry url：${entry}`)
    process.exit(1)
  }

  const config = getConfigByFile({ cwd })
  // 将配置文件与行内配置合并
  const configRet = lodash.merge(inlineConfig, config) as IBuildConfigOpt

  if (!configRet.esm && !configRet.cjs && !configRet.umd) {
    errorLog('未找到要输出的格式，请检查配置')
    process.exit(1)
  }

  if (configRet.esm && typeof configRet.esm === 'string') configRet.esm = { type: configRet.esm }
  if (configRet.cjs && typeof configRet.cjs === 'string') configRet.cjs = { type: configRet.cjs }

  return { ...configRet, entry: configRet.entry || entry }
}
