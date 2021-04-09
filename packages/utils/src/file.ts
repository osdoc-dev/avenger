import { existsSync } from 'fs'
import path from 'path'

// 获取文件
export function getExistFile({ cwd, files, returnRelative }) {
  for (const file of files) {
    const absFilePath = path.join(cwd, file)
    if (existsSync(absFilePath)) return returnRelative ? file : absFilePath
  }
}
