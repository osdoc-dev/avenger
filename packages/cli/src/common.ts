/*
 * @Author: ahwgs
 * @Date: 2021-04-01 00:06:20
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-04-01 01:04:15
 */
import { semver, error } from '@avenger/utils'

// 检查node版本,避免某些 api 不适配
export const checkNodeVersion = (needVerison: string, packageName: string) => {
  if (!semver.satisfies(process.version, needVerison, { includePrerelease: true })) {
    error(
      `You are using Node ${process.version}, but ${packageName} ` +
        `requires Node ${needVerison}.\nPlease upgrade your Node version.`,
    )
    process.exit(1)
  }
}
