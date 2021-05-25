---
nav:
  title: 快速上手
  order: 1
---

# 快速上手


## 环境准备

首先得有 [node](https://nodejs.org/en/)，并确保 node 版本是 10.13 或以上。（mac 下推荐使用 [nvm](https://github.com/creationix/nvm) 来管理 node 版本）

```bash
$ node -v
v10.13.0
```

推荐使用 `yarn` 管理 `npm` 依赖

## 脚手架

`avenger` 目前支持创建项目与打包项目

如果我们想使用 `avenger` 创建项目的话，我们可以全局安装

```bash
yarn global add @osdoc-dev/avenger-cli 
```

```bash
root@macpro / % avenger -h
Usage: avenger [options] [command]

Options:
  -V, --version            output the version number
  -h, --help               display help for command

Commands:
  build [options]          打包
  create [options] [name]  创建一个新项目
  info                     环境信息
  help [command]           display help for command
```

## 创建项目

```bash
avenger create <project name> --force
# or
avenger create . # 在当前文件夹下创建
```

- `--force` 该参数代表如果项目下已存在同名文件夹，则强制覆盖

执行创建命令

```bash
ahwgs@ahwgsdeMacBook-Pro Desktop % avenger create test


? 当前文件夹 /xxx/test 已存在, 是否覆盖重写 确定
 INFO  🌈 Removing  /xxxx/test...
? 选择预设配置 (Press <space> to select, <a> to toggle all, <i> to invert select? 选择预设配置 
 ◯ ESLint / Prettier
 ◯ Jest
 ◯ Commitlint
 ◯ Lerna
 ◯ Avenger

...

 INFO  🌈 开始安装开发依赖...! 
 INFO  🌈 执行：yarn add  typescript @commitlint/cli @commitlint/config-conventional husky commitizen cz-customizable @osdoc-dev/eslint-config-preset-prettier lint-staged @osdoc-dev/eslint-config-preset-ts prettier jest ts-jest @types/jest @osdoc-dev/avenger-cli -D

...

 INFO  🌈 项目初始化成功!
 INFO  🌈 请进入项目内进行操作 cd test && yarn install
```

新创建的项目默认为 `Typescript` ， 并且内置了打包命令

```bash
yarn build # -> avenger build
```

## 打包

对于一个类库或者一个组件库的打包，使用 `avenger` 我们只需要新建一个配置文件执行对应打包命令即可

如果全局没有安装过脚手架，我们这里可以在本地项目中安装，即

```bash
yarn add @osdoc-dev/avenger-cli -D
```

### 配置文件

在项目根目录下新建如下文件：`.avengerrc.js, .avengerrc.ts, .avenger.config.js, .avenger.config.ts` 脚手架默认支持这些文件格式

> 注意：如果配置文件为 `.ts` 格式，则该项目下需要 `tsconfig.json`

```typescript
export default {
  esm:'rollup'
}
```

### 配置打包脚本

在项目 `package.json` 中新增一条 `script`,即：

```json
{
  "script":{
    "build":"avenger build"
  }
}
```

执行命令，开始打包，默认输出至项目下 `./dist` 文件夹

更多配置项在 [config](./config)