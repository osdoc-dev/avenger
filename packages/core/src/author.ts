/*
 * @Description: 获取项目作者
 * @Author: ahwgs
 * @Date: 2021-05-28 20:17:27
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-05-28 20:19:36
 */
import { shelljs } from '@osdoc-dev/avenger-utils'

export const setAuthorName = (author: string) => {
  shelljs.exec(`npm config set init-author-name "${author}"`, { silent: true })
}

export const getAuthorName = (): string => {
  let author = ''

  author = shelljs.exec('npm config get init-author-name', { silent: true }).stdout.trim()
  if (author) return author

  author = shelljs.exec('git config --global user.name', { silent: true }).stdout.trim()
  if (author) {
    setAuthorName(author)
    return author
  }

  author = shelljs.exec('npm config get init-author-email', { silent: true }).stdout.trim()
  if (author) return author

  author = shelljs.exec('git config --global user.email', { silent: true }).stdout.trim()
  if (author) return author

  return author
}
