/*
 * rollup build
 * @Author: ahwgs
 * @Date: 2021-04-02 20:23:14
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-05-06 23:56:04
 */
import { IRollupBuildOpt } from '@osdoc-dev/avenger-shared'
import { getRollupConfig } from '@osdoc-dev/avenger-config'
import { info, error, done, stopSpinner } from '@osdoc-dev/avenger-utils'
import { rollup, watch as rollupWatch } from 'rollup'

export const rollupBuild = async (opt: IRollupBuildOpt) => {
  const { type, watch } = opt
  const rollupConfig = getRollupConfig(opt) || {}

  if (watch) {
    const watcher = rollupWatch([
      {
        ...rollupConfig,
        watch: {},
      },
    ])
    // https://www.rollupjs.com/guide/javascript-api#rollupwatch
    watcher.on('event', event => {
      if (event.code === 'START') info(`[${type}] Rebuild since file changed`)
      if (event.code === 'END') info(`[${type}] Rebuild file end`)
      if (event.code === 'ERROR') error(event.error)
    })
  } else {
    const { output, ...input } = rollupConfig as any
    const bundle = await rollup(input)
    await bundle.write(output)
    done(`${output.format} =>>> 编译成功`)
    stopSpinner()
  }
}
