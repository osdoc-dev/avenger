import path from 'path'
import shell from 'shelljs'
import { fs } from './index'
// 获取文件
export function getExistFile({ cwd, files, returnRelative }) {
  for (const file of files) {
    const absFilePath = path.join(cwd, file)
    if (fs.existsSync(absFilePath)) return returnRelative ? file : absFilePath
  }
}

// 删除文件夹
export function deleteFolder(filePath: string) {
  if (fs.existsSync(filePath)) {
    const files = fs.readdirSync(filePath)
    for (const file of files) {
      const nextFilePath = `${filePath}/${file}`
      shell.exec(`rm -rf ${nextFilePath}`)
    }
  }
}

// 创建文件夹
export const createFolder = (filePath: string) => {
  if (!fs.existsSync(filePath)) fs.mkdir(filePath)
}
