/*
 * @Author: ahwgs
 * @Date: 2021-04-02 00:22:55
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-08-22 22:10:54
 */

import path from 'path'
import program from 'commander'
import { getPackageJson, chalk } from '@osdoc-dev/avenger-utils'
import { build, create } from '@osdoc-dev/avenger-core'
import envinfo from 'envinfo'
import { CreateProjectType } from '@osdoc-dev/avenger-shared'
import { getBuildArguments, getCreateArguments } from './common'

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
    .action(() => build(getBuildArguments()))

  program
    .command('create [name]')
    .description('创建一个新项目')
    .option('--force', '强制覆盖已存在文件夹')
    .option('--git', '是否初始化Git，填写Git地址')
    .option('--template', `创建模版项目,可选项：[ ${Object.keys(CreateProjectType).join(', ')} ]`)
    .action(() => create(getCreateArguments()))

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
