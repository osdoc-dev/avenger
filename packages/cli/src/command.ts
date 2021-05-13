/*
 * @Author: ahwgs
 * @Date: 2021-04-02 00:22:55
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-05-13 15:57:15
 */

import path from 'path'
import program from 'commander'
import { getPackageJson, chalk } from '@osdoc-dev/avenger-utils'
import { build } from '@osdoc-dev/avenger-core'
import envinfo from 'envinfo'
import { getBuildArguments } from './common'
// 注册命令
export const registerCommand = () => {
  const packageJson = getPackageJson(path.join(__dirname, '..'))
  // version
  program.version(`${packageJson.name} v${packageJson.version}`)

  program
    .command('build')
    .description('打包')
    .option('--file', '打包输出文件名')
    .option('--entry', '打包主入口')
    .option('--watch', 'watch 模式')
    .option('--esm', '打包esm')
    .option('--cjs', '打包cjs')
    .option('--umd', '打包umd')

    .allowUnknownOption()
    .action(() => build(getBuildArguments()))

  // debug info
  program
    .command('info')
    .description('环境信息')
    .action(() => {
      console.log(chalk.bold('\nEnvironment Info:'))
      envinfo
        .run(
          {
            System: ['OS', 'CPU'],
            Binaries: ['Node', 'Yarn', 'npm'],
            Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
            npmPackages: '/**/{typescript,*@osdoc-dev*,@osdoc-dev/*/}',
            npmGlobalPackages: [packageJson.name],
          },
          {
            showNotFound: true,
            duplicates: true,
            fullTree: true,
          }
        )
        .then(console.log)
    })

  program.parse(process.argv)
}
