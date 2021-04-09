/*
 * @Author: ahwgs
 * @Date: 2021-04-08 20:11:52
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-04-09 15:04:02
 */
import path from 'path'
import { slash } from '@avenger/utils'
import { getBabelConfig } from '@avenger/config'

interface IRegisterBabelProps {
  cwd: string
  only: string[]
}

export default ({ cwd, only }: IRegisterBabelProps) => {
  const { config } = getBabelConfig({
    target: 'node',
    typescript: true,
  })
  require('@babel/register')({
    ...config,
    extensions: ['.es6', '.es', '.jsx', '.js', '.mjs', '.ts', '.tsx'],
    only: only.map(file => slash(path.join(cwd, file))),
    babelrc: false,
    cache: false,
  })
}
