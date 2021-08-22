/*
 * @Author: ahwgs
 * @Date: 2021-04-01 00:06:20
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-08-22 22:10:59
 */
import { semver, error, log } from '@osdoc-dev/avenger-utils'
import minimist, { ParsedArgs } from 'minimist'
import { ICliOpt, ICreateOpt, CreateProjectType } from '@osdoc-dev/avenger-shared'

// 检查node版本,避免某些 api 不适配
export const checkNodeVersion = (needVerison: string, packageName: string) => {
  if (!semver.satisfies(process.version, needVerison, { includePrerelease: true })) {
    error(
      `You are using Node ${process.version}, but ${packageName} ` +
        `requires Node ${needVerison}.\nPlease upgrade your Node version.`
    )
    process.exit(1)
  }
}

export const getBuildArguments = () => {
  const opt = minimist(process.argv.slice(3))
  const { file, entry, watch, esm, cjs, umd } = opt as ParsedArgs
  return {
    cwd: process.cwd(),
    watch: watch || false,
    inlineConfig: {
      outFile: file,
      entry,
      esm: esm ? 'rollup' : false,
      cjs: cjs ? 'rollup' : false,
      umd: umd ? 'rollup' : false,
    },
  } as ICliOpt
}

const getTemplate = (template: any) => {
  // 没有输入template
  if (!template) return ''
  const temps = Object.keys(CreateProjectType).map(v => v)
  let ret = template
  if (!temps.includes(template)) {
    log(`当前 template 不在预设范围内，将默认使用 ${CreateProjectType.basic}`)
    ret = CreateProjectType.basic
  }
  return ret
}

export const getCreateArguments = () => {
  const opt = minimist(process.argv.slice(3))
  const { template, force, _, git: gitUrl } = opt as ParsedArgs
  return {
    name: _[0] || '',
    options: {
      force: force || false,
      template: getTemplate(template),
      git: gitUrl,
    },
  } as ICreateOpt
}
