/*
 * rollup build
 * @Author: ahwgs
 * @Date: 2021-04-02 20:23:14
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-04-27 22:48:39
 */
import { IRollupBuildOpt } from '@osdoc-dev/avenger-shared'
import { getRollupConfig } from '@osdoc-dev/avenger-config'
import { info } from '@osdoc-dev/avenger-utils'
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
    watcher.on('event', event => {
      if (event.code === 'START') info(`[${type}] Rebuild since file changed`)
    })
  } else {
    const { output, ...input } = rollupConfig as any
    const bundle = await rollup(input)
    await bundle.write(output)
  }
}
