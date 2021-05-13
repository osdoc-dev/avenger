/*
 * 获取babel 配置
 * @Author: ahwgs
 * @Date: 2021-04-08 22:02:11
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-05-13 15:14:47
 */
import { IGetBabelConfigProps } from '@osdoc-dev/avenger-shared'

export const getBabelConfig = (opt: IGetBabelConfigProps) => {
  const { target, nodeVersion = 6, type, typescript, runtimeHelpers } = opt || {}

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
    ...(isBrowser ? [require.resolve('@babel/preset-react')] : []),
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
    ...(runtimeHelpers
      ? [
          [
            require.resolve('@babel/plugin-transform-runtime'),
            {
              useESModules: isBrowser && type === 'esm',
              // 需要用户dependencies 必须有@babel/runtime
              // eslint-disable-next-line import/no-extraneous-dependencies
              version: require('@babel/runtime/package.json').version,
            },
          ],
        ]
      : []),
  ]

  return {
    config: {
      presets,
      plugins,
    },
  }
}
