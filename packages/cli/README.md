<div align="center">
    <a href="#" target="_blank">
    <img src="https://static.ahwgs.cn/avenger_logo.jpeg" alt="Logo" width="80" height="80">
    </a>
    <h2>@osdoc-dev/avenger</h2>
    <p align="center">一键 📦 打包工具</p>

[![NPM version](https://img.shields.io/npm/v/@osdoc-dev/avenger-cli.svg?style=flat)](https://npmjs.org/package/@osdoc-dev/avenger-cli)
[![NPM downloads](https://img.shields.io/npm/dm/@osdoc-dev/avenger-cli.svg?style=flat)](https://www.npmjs.com/package/@osdoc-dev/avenger-cli)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)
[![Code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![GitHub last commit](https://img.shields.io/github/last-commit/osdoc-dev/avenger.svg?style=flat-square)](https://github.com/osdoc-dev/avenger/commits/master)
</div>

## 如何使用

### 安装

```TypeScript
yarn add @osdoc-dev/avenger-cli 
```

### 增加配置文件

在根目录下新建 `.avengerrc.js, .avengerrc.ts, .avenger.config.js, .avenger.config.ts`

```typescript
export default {
  esm: {
    type: "rollup",
    sourcemap: true,
  },
  outFile: "demo",
}
```


同时，`avenger` 支持导出 `defineConfig` 函数辅助我们进行配置，如；

```typescript
import { defineConfig } from '@osdoc-dev/avenger-cli'

export default defineConfig({
  esm: 'rollup',
  cjs: 'rollup',
  outFile: 'sdk',
  umd: {
    name: 'SDK',
    sourcemap: true,
  },
})

```

### 增加脚本

在 `package.json` 中新增

```json
{
  "script":{
    "build":"avenger build"
  }
}
```

### 打包
```bash
yarn build
```
### 创建新项目

新版本支持新建二方包模版

```bash
avenger create <project name> --force
```

- `force` 强制覆盖本地已存在文件夹


## 配置项

更多配置内容可参考官网