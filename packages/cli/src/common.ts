/*
 * @Author: ahwgs
 * @Date: 2021-04-01 00:06:20
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-05-13 17:10:22
 */
import { semver, error } from '@osdoc-dev/avenger-utils'
import minimist, { ParsedArgs } from 'minimist'
import { ICliOpt } from '@osdoc-dev/avenger-shared'
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
