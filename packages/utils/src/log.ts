/*
 * @Author: ahwgs
 * @Date: 2021-03-31 23:52:11
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-04-28 17:30:07
 */

import readline from 'readline'
import stripAnsi from 'strip-ansi'
import chalk from 'chalk'
import { stopSpinner } from './spinner'

const format = (label: string, message: string) =>
  message
    .split('\n')
    .map((line, index) => (index === 0 ? `${label} ${line}` : line.padStart(stripAnsi(label).length + line.length + 1)))
    .join('\n')

const chalkTag = message => chalk.bgBlackBright.white.dim(` ${message} `)

export const log = (message = '', tag = null) => {
  tag ? console.log(format(chalkTag(tag), message)) : console.log(` 🌀${message}`)
}

export const info = (message: string, tag = null) => {
  console.log(format(chalk.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ' 🌈'), message))
}

export const done = (message: string, tag = null) => {
  console.log(format(chalk.bgGreen.black(' DONE ') + (tag ? chalkTag(tag) : ' 🎉'), message))
}

export const warn = (message: string, tag = null) => {
  console.warn(format(chalk.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ' ☔'), chalk.yellow(message)))
}

export const error = (message, tag = null) => {
  stopSpinner()
  console.error(format(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ' 🔥'), chalk.red(message)))
  if (message instanceof Error) console.error(message.stack)
}

export const clearConsole = (title: string) => {
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    if (title) console.log(title)
  }
}
