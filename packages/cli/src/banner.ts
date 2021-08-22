/*
 * @Author: ahwgs
 * @Date: 2021-08-22 21:00:00
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-08-22 21:14:08
 */
import path from 'path'
import fs from 'fs'

export const printBanner = () => {
  const bannerPath = path.join(__dirname, '../assets/banner.txt')
  const str = fs.readFileSync(bannerPath, 'utf-8')
  console.log(str)
}
