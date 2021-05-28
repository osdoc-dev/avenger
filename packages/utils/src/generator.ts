/*
 * 从模版生成文件
 * @Author: ahwgs
 * @Date: 2021-05-28 17:00:40
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-05-28 22:23:41
 */

import path from 'path'
import { createFolder } from './file'
import { glob, Mustache, fs, log } from './index'

// 复制tpl 并且转义
const copyTpl = async (opts: { templatePath: string; target: string; context: object }) => {
  const tpl = fs.readFileSync(opts.templatePath, 'utf-8')
  const content = Mustache.render(tpl, opts.context)
  await createFolder(path.dirname(opts.target))
  log(`${opts.target} 写入成功！`)
  fs.writeFileSync(opts.target, content, 'utf-8')
}

export const fileGenerator = (opt: { target: string; source: string; context: Object; ignores: string[] }) => {
  const { target, source, context, ignores = [] } = opt || {}
  const files = glob.sync('**/*', {
    cwd: source,
    dot: true,
    ignore: ['**/node_modules/**'],
  })

  files.forEach(file => {
    if (ignores.includes(file)) return
    const absFile = path.join(source, file)
    if (fs.statSync(absFile).isDirectory()) return
    if (file.endsWith('.tpl')) {
      copyTpl({
        templatePath: absFile,
        target: path.join(target, file.replace(/\.tpl$/, '')),
        context,
      })
    } else {
      const absTarget = path.join(target, file)
      createFolder(path.dirname(absTarget))
      log(`${absTarget} 写入成功！`)
      fs.copyFileSync(absFile, absTarget)
    }
  })
}
