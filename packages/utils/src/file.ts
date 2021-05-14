import { existsSync, readdirSync } from 'fs'
import path from 'path'
import shell from 'shelljs'
// 获取文件
export function getExistFile({ cwd, files, returnRelative }) {
  for (const file of files) {
    const absFilePath = path.join(cwd, file)
    if (existsSync(absFilePath)) return returnRelative ? file : absFilePath
  }
}

// 删除文件夹
export function deleteFolder(filePath: string) {
  if (existsSync(filePath)) {
    const files = readdirSync(filePath)
    for (const file of files) {
      const nextFilePath = `${filePath}/${file}`
      shell.exec(`rm -rf ${nextFilePath}`)
    }
  }
}
