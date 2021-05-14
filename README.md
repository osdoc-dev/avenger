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

- **entry**

文件打包入口

- **outFile**

输出文件名

- **esm**

打包 `ESModule` 配置

可配置为："rollup" | "babel" | { type, outFile, ...其他子项目  } | false

配置为 `rollup` 则使用 `rollup` 构建

配置为 `babel` 则使用 `babel` 构建

> babel 模式暂时不支持

对于 `esm` 的配置，也可使用对象的形式，如下

- **esm.type**

配置 `esm` 使用 `rollup` 还是 `babel`

- **esm.outFile**

配置 `esm` 输出的文件名称，优先级大于上面的那个 `outFile`

- **esm.minify**

配置`esm` 是否需要压缩，一般不需要配置

- **esm.sourcemap**

配置打包文件是否需要输出 `sourcemap` 文件

- **cjs**

打包 `CommonJs` 配置

可配置为："rollup" | "babel" | { type, outFile, ...其他子项目  } | false

配置为 `rollup` 则使用 `rollup` 构建

配置为 `babel` 则使用 `babel` 构建

对于 `cjs` 的配置，也可使用对象的形式，如下

- **cjs.type**

配置 `cjs` 使用 `rollup` 还是 `babel`

- **cjs.outFile**

配置 `cjs` 输出的文件名称，优先级大于上面的那个 `outFile`

- **cjs.minify**

配置`cjs` 是否需要压缩，一般不需要配置

- **cjs.sourcemap**

配置打包文件是否需要输出 `sourcemap` 文件

- **umd**

`umd` 只能使用 `rollup` 打包

- **umd.outFile**

输出文件，优先级大于上面的那个 `outFile`

- **umd.minify**

是否输出 `umd.min.js` 一般用于正式环境


- **umd.globals**

`umd` 全局模块， 官网解释 [rollup globals](https://www.rollupjs.com/guide/big-list-of-options#%E5%85%A8%E5%B1%80%E6%A8%A1%E5%9D%97globals--g--globals) 

- **umd.name**

`umd` name 官网解释 [rollup name](hhttps://www.rollupjs.com/guide/big-list-of-options#%E7%94%9F%E6%88%90%E5%8C%85%E5%90%8D%E7%A7%B0name--n--name) 

- **umd.sourcemap**

配置打包文件是否需要输出 `sourcemap` 文件

- **disableTypeCheck**

打包时禁用 `typescript` 类型检查

- **extraTypescriptPluginOpt**

透传给 `rollup-plugin-typescript2` 插件的配置

注意：`declarationDir` 默认开启,并且默认输出到文件夹 `dist/types` 下

- **extraNodeResolvePluginOpt**

透传给 `@rollup/plugin-node-resolve` 插件的配置

- **extraRollupPlugins**

拓展 `rollup plugins` 

- **include**

配置 `@rollup/plugin-commonjs` `include` 属性

- **extraReplacePluginOpts** 

配置 `@rollup/plugin-replace` 属性

- **extraInjectPluginOpts** 

配置 `@rollup/plugin-inject`  属性

- **nodeVersion** **

- **target**

- **extractCSS**

- **cssModule**

- **injectCSS**

- **extraPostCssOpt**

- **rollupLessOpt**

- **rollupSassOpt**