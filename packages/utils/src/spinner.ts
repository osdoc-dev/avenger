/*
 * @Author: ahwgs
 * @Date: 2021-03-31 23:52:11
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-05-06 23:49:28
 */

import chalk from 'chalk'
import ora from 'ora'

const spinner = ora()

interface IMessage {
  symbol: string
  text: string
}

let lastMessage: IMessage | null = null
let isPaused = false

export const logWithSpinner = (symbol: string, message?: string) => {
  if (!message) {
    message = symbol
    symbol = chalk.green('✔')
  }
  if (lastMessage) {
    spinner.stopAndPersist({
      symbol: lastMessage.symbol,
      text: lastMessage.text,
    })
  }
  spinner.text = ` ${message}`
  lastMessage = {
    symbol: `${symbol} `,
    text: message,
  }
  spinner.start()
}

export const stopSpinner = (persist?: boolean) => {
  if (!spinner.isSpinning) return

  if (lastMessage && persist !== false) {
    spinner.stopAndPersist({
      symbol: lastMessage.symbol,
      text: lastMessage.text,
    })
  } else {
    spinner.stop()
  }
  lastMessage = null
}

export const pauseSpinner = () => {
  if (spinner.isSpinning) {
    spinner.stop()
    isPaused = true
  }
}

export const resumeSpinner = () => {
  if (isPaused) {
    spinner.start()
    isPaused = false
  }
}

export const failSpinner = (text: string) => {
  spinner.fail(text)
}
