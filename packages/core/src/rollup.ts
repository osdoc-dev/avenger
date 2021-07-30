/*
 * rollup build
 * @Author: ahwgs
 * @Date: 2021-04-02 20:23:14
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-05-13 19:07:44
 */
import { IRollupBuildOpt } from '@osdoc-dev/avenger-shared'
import { getRollupConfig } from '@osdoc-dev/avenger-config'
import { info, error as errLog, done } from '@osdoc-dev/avenger-utils'
import { rollup, watch as rollupWatch } from 'rollup'

export const rollupBuild = async (opt: IRollupBuildOpt) => {
  const { type, watch } = opt

  info(`获取 ${type} rollup配置`)

  // 配置输出数组 方便一下子打包多个格式
  const rollupConfigs = await getRollupConfig(opt)

  if (!rollupConfigs || rollupConfigs.length === 0) {
    errLog('获取 rollup 配置失败')
    process.exit(1)
  }

  for (const rollupConfig of rollupConfigs) {
    if (watch) {
      const watcher = rollupWatch([
        {
          ...rollupConfig,
          watch: {},
        },
      ])
      watcher.on('event', event => {
        if (event.code === 'START') info(`[${type}] Rebuild since file changed`)
        if (event.code === 'END') info(`[${type}] Rebuild file end`)
        if (event.code === 'ERROR') errLog(event.error)
      })
    } else {
      try {
        const { output, ...input } = rollupConfig as any
        const bundle = await rollup(input)
        await bundle.write(output)
        done(`${output.format} =>>> 编译成功`)
      } catch (error) {
        errLog(error)
        errLog('编译失败')
      }
    }
  }
}
