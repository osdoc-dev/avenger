/*
 * 创建脚本
 * @Author: ahwgs
 * @Date: 2021-05-13 21:18:50
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-05-14 17:00:55
 */

import path from 'path'
import fs from 'fs-extra'
import { ICreateOpt, IPackageJsonData, IPackageJson } from '@osdoc-dev/avenger-shared'
import validateProjectName from 'validate-npm-package-name'
import {
  error,
  warn as warnLog,
  lodash,
  deleteFolder,
  clearConsole,
  info,
  inquirer,
  shelljs,
  prettier,
} from '@osdoc-dev/avenger-utils'

interface IValidateProject {
  validForNewPackages: boolean
  errors?: any[]
  warnings?: any[]
}

const UserConfig = {
  Eslint_Prettier: 'ESLint / Prettier',
  Jest: 'Jest',
  Commitlint: 'Commitlint',
}

const getCzConfig = () => ({
  types: [
    {
      value: 'feat',
      name: '✨  feat:     新功能',
    },
    {
      value: 'fix',
      name: '🐛  fix:      修复bug',
    },
    {
      value: 'refactor',
      name: '♻️  refactor: 代码重构（既不是新功能也不是改bug）',
    },
    {
      value: 'chore',
      name: '🎫  chore:    修改流程配置',
    },
    {
      value: 'docs',
      name: '📝  docs:     修改了文档',
    },
    {
      value: 'test',
      name: '✅  test:     更新了测试用例',
    },
    {
      value: 'style',
      name: '💄  style:    修改了样式文件',
    },
    {
      value: 'perf',
      name: '⚡️  perf:     新能优化',
    },
    {
      value: 'revert',
      name: '⏪  revert:   回退提交',
    },
    {
      value: 'ci',
      name: '⏪  ci:   持续集成',
    },
    {
      value: 'build',
      name: '⏪  build:   打包',
    },
  ],
  scopes: [],
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  subjectLimit: 50,
  messages: {
    type: '请选择你本次改动的修改类型',
    customScope: '\n请明确本次改动的范围（可填）:',
    subject: '简短描述本次改动:\n',
    body: '详细描述本次改动 (可填). 使用 "|" 换行:\n',
    breaking: '请列出任何 BREAKING CHANGES (可填):\n',
    footer: '请列出本次改动关闭的ISSUE (可填). 比如: #31, #34:\n',
    confirmCommit: '你确定提交本次改动吗?',
  },
})

const createFolder = (filePath: string) => {
  if (!fs.existsSync(filePath)) fs.mkdir(filePath)
}

const setLintConfig = async (
  choose: string[],
  targetDir: string,
  deps: string[],
  packageJsonData: IPackageJsonData
) => {
  if (choose.includes(UserConfig.Eslint_Prettier)) {
    const prettierData = prettier.format(`
      const prettier = require('@osdoc-dev/eslint-config-preset-prettier')
      module.exports = {
        ...prettier,
      }
    `)

    const eslintData = {
      extends: '@osdoc-dev/eslint-config-preset-ts',
      env: {
        node: true,
      },
      rules: {
        '@typescript-eslint/no-var-requires': 0,
        'brace-style': 0,
        'comma-dangle': 0,
        'arrow-parens': 0,
        'unicorn/prevent-abbreviations': 0,
        'space-before-function-paren': 0,
        'global-require': 0,
        'import/no-dynamic-require': 0,
        '@typescript-eslint/indent': 0,
        indent: 0,
        'no-await-in-loop': 0,
        'unicorn/no-array-for-each': 0,
      },
    }

    // @ts-ignore
    if (choose.includes(UserConfig.Jest)) eslintData.env.jest = true

    packageJsonData.husky = {
      ...packageJsonData.husky,
      hooks: {
        'pre-commit': 'lint-staged',
      },
    }

    packageJsonData['lint-staged'] = {
      '*.{js,json,md,tsx,ts}': ['prettier --write', 'git add'],
      '*.ts?(x)': ['prettier --write', 'eslint --fix', 'git add'],
    }

    const prettierIgnore = '/dist\r\n/node_modules'
    const eslintIgnore = '/dist\r\n/node_modules'

    await fs.writeFile(`${targetDir}/.eslintrc.js`, `module.exports = ${JSON.stringify(eslintData, null, 2)}`)
    await fs.writeFile(`${targetDir}/.prettierrc.js`, prettierData)
    await fs.writeFile(`${targetDir}/.prettierignore`, prettierIgnore)
    await fs.writeFile(`${targetDir}/.eslintignore`, eslintIgnore)

    deps.push(
      ...['@osdoc-dev/eslint-config-preset-prettier', 'lint-staged', '@osdoc-dev/eslint-config-preset-ts', 'prettier']
    )
  }
}

const getUserConfig = async () =>
  inquirer.prompt<{ choose }>([
    {
      name: 'choose',
      type: 'checkbox',
      message: '选择预设配置',
      choices: [
        { name: 'ESLint / Prettier', value: UserConfig.Eslint_Prettier },
        { name: 'Jest', value: UserConfig.Jest },
        { name: 'Commitlint', value: UserConfig.Commitlint },
      ],
    },
  ])

const setJestConfig = async (choose: string[], targetDir: string, deps: string[]) => {
  if (choose.includes(UserConfig.Jest)) {
    const jestData = {
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['**/__tests__/**/*.test.ts?(x)'],
      testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/', '(.*).d.ts'],
    }
    await fs.writeFile(`${targetDir}/jest.config.js`, `module.exports = ${JSON.stringify(jestData, null, 2)}`)
    deps.push(...['jest', 'ts-jest', '@types/jest'])
  }
}

const setAvenger = async (targetDir: string, deps: string[]) => {
  const configData = {
    esm: 'rollup',
  }
  await fs.writeFile(`${targetDir}/.avengerrc.ts`, `export default ${JSON.stringify(configData, null, 2)}`)
  deps.push(...['@osdoc-dev/avenger-cli'])
}

const setCommitlintConfig = async (
  choose: string[],
  targetDir: string,
  deps: string[],
  packageJsonData: IPackageJsonData
) => {
  if (choose.includes(UserConfig.Commitlint)) {
    const lintData = { extends: ['@commitlint/config-conventional'] }

    await fs.writeFile(`${targetDir}/commitlint.config.js`, `module.exports = ${JSON.stringify(lintData, null, 2)}`)
    const czData = await getCzConfig()

    await fs.writeFile(`${targetDir}/.cz-config.js`, `module.exports = ${JSON.stringify(czData, null, 2)}`)

    packageJsonData.husky = {
      ...packageJsonData.husky,
      hooks: {
        'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
      },
    }
    packageJsonData.config = {
      commitizen: {
        path: 'node_modules/cz-customizable',
      },
    }
    deps.push(...['@commitlint/cli', '@commitlint/config-conventional', 'husky', 'commitizen', 'cz-customizable'])
  }
}

// 配置ts
const setTypescriptConfig = async (targetDir: string, deps: string[]) => {
  const filePath = `${targetDir}/tsconfig.json`
  await fs.writeJSON(
    filePath,
    {
      compilerOptions: {
        target: 'es5',
        module: 'commonjs',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        baseUrl: '.',
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
        outDir: './dist',
      },
    },
    { spaces: 2 }
  )
  deps.push('typescript')
}

const setPackageJsonFile = async (
  currentName: string,
  choose: string[],
  targetDir: string,
  packageJsonData: IPackageJsonData,
  deps: string[]
) => {
  info('开始安装开发依赖...! ')
  info(`执行：yarn add  ${deps.join(' ')} -D`)

  shelljs.exec(`yarn add ${deps.join(' ')} -D`, { cwd: targetDir })

  const filePath = `${targetDir}/package.json`
  const json = (await fs.readJSON(filePath)) as IPackageJson
  const data: IPackageJsonData = {
    test: 'jest',
    clean: 'rm -rf ./dist',
    build: 'yarn clean && avenger build',
    'check-types': 'tsc --noEmit',
  }
  // eslint-disable-next-line quotes
  if (choose.includes(UserConfig.Eslint_Prettier)) data.lint = "prettier --check '**/*.{js,json,md,tsx,ts}'"
  json.scripts = data
  await fs.writeJSON(filePath, { ...json, ...packageJsonData }, { spaces: 2 })
  info('项目初始化成功!')
  info(`请进入项目内进行操作 cd ${currentName} && yarn install`)
}

export const create = async (opt: ICreateOpt) => {
  const { name, options } = opt || {}
  const { force } = options || {}
  const cwd = process.cwd()
  const inCurrent = !name || name === '.'
  const currentName = inCurrent ? path.relative('../', cwd) : name
  const targetDir = path.resolve(cwd, inCurrent ? '' : currentName || '.')

  const result: IValidateProject = await validateProjectName(currentName)

  if (!result.validForNewPackages) {
    error(`Invalid project name: "${name}"`)

    lodash.forEach(result.errors, (err: any) => {
      error(`Error: ${err}`)
    })

    lodash.forEach(result.warnings, (warn: any) => {
      warnLog(`Error: ${warn}`)
    })

    process.exit(1)
  }

  // 直接删掉
  if (force) deleteFolder(targetDir)

  // 文件夹存在
  if (fs.existsSync(targetDir) && !force) {
    clearConsole()
    if (inCurrent) {
      const { ok } = await inquirer.prompt([
        {
          name: 'ok',
          type: 'confirm',
          message: `是否在当前 ${targetDir} 文件夹中创建项目`,
        },
      ])
      if (!ok) return
    } else {
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: `当前文件夹 ${targetDir} 已存在, 是否覆盖重写`,
          choices: [
            { name: '确定', value: true },
            { name: '取消', value: false },
          ],
        },
      ])
      if (action) {
        info(`Removing  ${targetDir}...`)
        await fs.remove(targetDir)
      } else {
        process.exit(1)
      }
    }
  }

  const deps = [] as string[]
  const packageJsonData = {} as IPackageJsonData

  await createFolder(targetDir)

  const { choose } = await getUserConfig()

  shelljs.exec('yarn init -y', { cwd: targetDir })

  await setTypescriptConfig(targetDir, deps)
  await setCommitlintConfig(choose, targetDir, deps, packageJsonData)
  await setLintConfig(choose, targetDir, deps, packageJsonData)
  await setJestConfig(choose, targetDir, deps)
  await setAvenger(targetDir, deps)
  await setPackageJsonFile(currentName, choose, targetDir, packageJsonData, deps)
}
