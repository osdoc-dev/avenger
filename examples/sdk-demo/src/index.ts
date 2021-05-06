import { log } from './utils'

console.log('sdk-demo')

interface IProps {}

export function calc(a: number, b: number) {
  log('print log')
  return a + b
}

export default function (opt: IProps) {
  console.log('123123', opt)
}
