import printLog, { log } from './utils'
import foo from './foo'

console.log('sdk-demo')

interface IProps {}

export function calc(a: number, b: number) {
  console.log('calc fun', a, b)
  log(a + b)
  return a + b
}
export const ddd = (opt: IProps) => {
  console.log('dddd fun opt', opt)
  printLog()
}

const main = () => {
  console.log('calc:', calc(1, 4))
  console.log('ddd:', ddd('ddd123'))
  console.log('foo:', foo)

  console.log('process.env.NODE_ENV', process.env.NODE_ENV)
}

export default {
  init() {
    main()
  },
}
