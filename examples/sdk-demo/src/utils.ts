import answer from 'the-answer'

export const log = data => {
  console.log('log', data)
}

export default function () {
  console.log(`the answer is ${answer}`)
}
