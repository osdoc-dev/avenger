/*
 * 获取babel 配置
 * @Author: ahwgs
 * @Date: 2021-04-08 22:02:11
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-04-30 10:18:37
 */
import { IGetBabelConfigProps } from '@osdoc-dev/avenger-shared'

export const getBabelConfig = (opt: IGetBabelConfigProps) => {
  const { target, nodeVersion = 6, type, typescript } = opt || {}

  const isBrowser = target === 'browser'

  // 默认兼容node 6
  const targets = isBrowser ? { browsers: ['last 2 versions', 'IE 10'] } : { node: nodeVersion }

  const presets = [
    ...(typescript ? [require.resolve('@babel/preset-typescript')] : []),
    [
      require.resolve('@babel/preset-env'),
      {
        targets,
        modules: type === 'esm' ? false : 'auto',
      },
    ],
  ]

  const plugins = [
    require.resolve('babel-plugin-react-require'),
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    require.resolve('@babel/plugin-proposal-export-default-from'),
    require.resolve('@babel/plugin-proposal-export-namespace-from'),
    require.resolve('@babel/plugin-proposal-do-expressions'),
    require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
    require.resolve('@babel/plugin-proposal-optional-chaining'),
    [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
    [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
  ]

  return {
    config: {
      presets,
      plugins,
    },
  }
}
