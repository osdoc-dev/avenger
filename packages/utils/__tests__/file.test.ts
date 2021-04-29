import { getExistFile } from '../src'

describe('test avenger utils:file', () => {
  it('test getExistFile function', () => {
    expect(getExistFile({ cwd: process.cwd(), files: ['tsconfig.json'], returnRelative: true })).toBe('tsconfig.json')
    expect(getExistFile({ cwd: process.cwd(), files: ['tsconfig.json'], returnRelative: false })).toBe(
      `${process.cwd()}/tsconfig.json`
    )
    expect(getExistFile({ cwd: process.cwd(), files: [], returnRelative: false })).toBe(undefined)
  })
})
