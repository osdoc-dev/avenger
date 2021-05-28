/*
 * 创建脚本
 * @Author: ahwgs
 * @Date: 2021-05-13 21:18:50
 * @Last Modified by: ahwgs
 * @Last Modified time: 2021-05-28 21:51:04
 */

import path from 'path'
import { ICreateOpt, IPackageJsonData, IPackageJson, CreateProjectType } from '@osdoc-dev/avenger-shared'
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
  fs,
  createFolder,
  fileGenerator,
} from '@osdoc-dev/avenger-utils'
import { getAuthorName, setAuthorName } from './author'

interface IValidateProject {
  validForNewPackages: boolean
  errors?: any[]
  warnings?: any[]
}

const UserConfig = {
  Jest: 'Jest',
  Lerna: 'Lerna',
  CommitLint: 'CommitLint',
}

const setLintConfig = async (deps: string[], packageJsonData: IPackageJsonData, currentTemplate: string) => {
  packageJsonData.husky = {
    hooks: {
      ...packageJsonData?.husky?.hooks,
      'pre-commit': 'lint-staged',
    },
  }

  packageJsonData['lint-staged'] = {
    '*.{js,json,md,tsx,ts}': ['prettier --write', 'git add'],
    '*.ts?(x)': ['prettier --write', 'eslint --fix', 'git add'],
  }

  deps.push(...['@osdoc-dev/eslint-config-preset-prettier', 'lint-staged', 'prettier'])

  if (currentTemplate === CreateProjectType.basic) deps.push(...['@osdoc-dev/eslint-config-preset-ts'])
  if (currentTemplate === CreateProjectType.react) deps.push(...['@osdoc-dev/eslint-config-preset-react'])
}

const getTemplate = async (template: string) => {
  if (template) return { currentTemplate: template }
  return inquirer.prompt<{ currentTemplate }>({
    type: 'list',
    message: '请选择项目模版:',
    name: 'currentTemplate',
    choices: Object.keys(CreateProjectType).map(v => v) || [],
  })
}

const getUserAuthor = () =>
  inquirer.prompt<{ name }>({
    type: 'input',
    message: '请输入项目作者名:',
    name: 'name',
  })

// 获取用户配置
const getUserConfig = async () =>
  inquirer.prompt<{ choose }>([
    {
      name: 'choose',
      type: 'checkbox',
      message: '选择拓展预设配置',
      choices: [
        { name: 'Jest', value: UserConfig.Jest },
        { name: 'Lerna', value: UserConfig.Lerna },
        { name: 'CommitLint', value: UserConfig.CommitLint },
      ],
    },
  ])

const setJestConfig = async (choose: string[], ignores: string[], deps: string[]) => {
  if (choose.includes(UserConfig.Jest)) deps.push(...['jest', 'ts-jest', '@types/jest'])
  else ignores.push(...['jest.config.js'])
}

const setCommitLintConfig = async (
  choose: string[],
  deps: string[],
  packageJsonData: IPackageJsonData,
  ignores: string[]
) => {
  if (choose.includes(UserConfig.CommitLint)) {
    packageJsonData.husky = {
      ...packageJsonData?.husky,
      hooks: {
        'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
      },
    }
    packageJsonData.config = {
      commitizen: {
        path: 'node_modules/cz-customizable',
      },
    }
    deps.push(
      ...[
        '@commitlint/cli',
        '@commitlint/config-conventional',
        'husky',
        'commitizen',
        'cz-customizable',
        'conventional-changelog-cli',
      ]
    )
  } else {
    ignores.push(...['commitlint.config.js', '.cz-config.js'])
  }
}

const setPackageJsonFile = async (
  currentName: string,
  choose: string[],
  targetDir: string,
  packageJsonData: IPackageJsonData,
  deps: string[],
  author: string
) => {
  info('初始化package.json...')
  const filePath = `${targetDir}/package.json`

  const initJson = {
    name: currentName,
    version: '0.0.1',
    license: 'MIT',
    author,
    main: 'dist/index.js',
    files: ['dist', 'src'],
  }

  await fs.writeJSON(filePath, { ...initJson }, { spaces: 2 })

  info('开始安装开发依赖...! ')
  info(`执行：yarn add  ${deps.join(' ')} -D`)

  shelljs.exec(`yarn add ${deps.join(' ')} -D`, { cwd: targetDir })

  info('开发依赖安装完成')

  const json = (await fs.readJSON(filePath)) as IPackageJson
  const data: IPackageJsonData = {
    test: 'jest',
    clean: 'rm -rf ./dist',
    build: 'yarn clean && avenger build',
    'check-types': 'tsc --noEmit',
    commit: 'git cz',
    // eslint-disable-next-line quotes
    lint: "prettier --check '**/*.{js,json,md,tsx,ts}'",
  }
  if (choose.includes(UserConfig.Lerna)) data.bootstrap = 'lerna bootstrap'
  if (choose.includes(UserConfig.CommitLint))
    data.changelog = 'conventional-changelog -p angular -i CHANGELOG.md -s -r 0'

  json.scripts = data
  await fs.writeJSON(filePath, { ...json, ...packageJsonData }, { spaces: 2 })

  if (choose.includes(UserConfig.Lerna)) {
    info('检测到启动lerna')
    await shelljs.exec('npx lerna init', { cwd: targetDir })
    info('lerna 初始化完成')
  }

  info('项目初始化成功!')
  info(`请进入项目内进行操作 cd ${currentName} && yarn install`)
}

const setLernaConfig = async (choose: string[], deps: string[]) => {
  if (choose.includes(UserConfig.Lerna)) deps.push(...['lerna'])
}

export const create = async (opt: ICreateOpt) => {
  const { name, options } = opt || {}
  const { force, template } = options || {}
  const cwd = process.cwd()
  const inCurrent = !name || name === '.'
  const currentName = inCurrent ? path.relative('../', cwd) : name
  const targetDir = path.resolve(cwd, inCurrent ? '' : currentName || '.')

  const result: IValidateProject = await validateProjectName(currentName)

  if (!result.validForNewPackages) {
    error(`无效项目名称: "${name}"`)

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
        info(`删除中  ${targetDir}...`)
        await fs.remove(targetDir)
      } else {
        process.exit(1)
      }
    }
  }

  const deps = ['typescript', '@osdoc-dev/avenger-cli'] as string[]
  const packageJsonData = {} as IPackageJsonData
  const ignores = [] as string[]

  await createFolder(targetDir)

  const { currentTemplate } = await getTemplate(template)

  let author = getAuthorName()

  if (!author) {
    const { name: authorName } = await getUserAuthor()
    author = authorName
    setAuthorName(authorName)
  }

  const { choose = [] } = await getUserConfig()

  await setCommitLintConfig(choose, deps, packageJsonData, ignores)
  await setLintConfig(deps, packageJsonData, currentTemplate)
  await setJestConfig(choose, ignores, deps)
  await setLernaConfig(choose, deps)
  // 复制公共模版文件
  await fileGenerator({
    target: targetDir,
    source: path.join(__dirname, '../templates/common'),
    context: {
      year: new Date().getFullYear(),
      author,
    },
    ignores,
  })
  // 复制特定模版文件
  await fileGenerator({
    target: targetDir,
    source: path.join(__dirname, `../templates/${currentTemplate}`),
    context: {
      currentName,
      enableJest: choose.includes(UserConfig.Jest),
    },
    ignores,
  })
  await setPackageJsonFile(currentName, choose, targetDir, packageJsonData, deps, author)
}
