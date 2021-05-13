# avenger 

一键 📦 打包工具

[![NPM version](https://img.shields.io/npm/v/@osdoc-dev/avenger-cli.svg?style=flat)](https://npmjs.org/package/@osdoc-dev/avenger-cli)
[![NPM downloads](https://img.shields.io/npm/dm/@osdoc-dev/avenger-cli.svg?style=flat)](https://www.npmjs.com/package/@osdoc-dev/avenger-cli)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)


## 如何使用

```TypeScript
yarn add @osdoc-dev/avenger-cli 
```

## 配置

新建配置文件 `'.avengerrc.js', '.avengerrc.ts', '.avenger.config.js', '.avenger.config.ts'`

```typescript
export default {
  esm: {
    type: "rollup",
    sourcemap: true,
  },
  outFile: "demo",
};
```

### 配置项

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