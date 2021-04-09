/*
 * @Author: ahwgs
 * @Date: 2021-04-02 00:27:10
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-04-02 00:33:39
 */
import fs from 'fs'
import path from 'path'

// 获取package.json
export const getPackageJson = (projectPath: string) => {
  const packagePath = path.join(projectPath, 'package.json')

  let packageJson: any
  try {
    packageJson = fs.readFileSync(packagePath, 'utf-8')
  } catch {
    throw new Error(`The package.json file at '${packagePath}' does not exist`)
  }

  try {
    packageJson = JSON.parse(packageJson)
  } catch {
    throw new Error('The package.json is malformed')
  }

  return packageJson
}
