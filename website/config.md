---
nav:
  title: 配置
  order: 2
toc: menu
---

# 配置

在项目根目录创建 `.avengerrc.js, .avengerrc.ts, .avenger.config.js, .avenger.config.ts`，都可对 `avenger` 进行配置：

```ts
export default {
  esm:'rollup'
}
```

## entry

* Type: `string`
* Default: `src/index.js` `src/index.ts`

文件打包入口，当前仅支持单文件入口

## outFile

* Type: `string`
* Default: 与 `entry` 相同的文件名，`esm` 会加 `.esm.js` 后缀，`umd` 会加 `.umd[.min].js` 后缀

指定输出文件

## nodeVersion

* Type: `number`
* Default: `6`

当前要兼容的 `Node` 版本

## target

* Type: `string`
* Default: `node`
* Enum: `node` | `browser`

配置当前打包类库的使用环境

## esm

* Type: `string ｜ boolean | Object`
* Default: `false`
* Enum: `rollup` | `false` | `type, outFile, ...其他子项目}`

打包 `Es Module` 相关配置

对于 `esm` 的配置，也可使用对象的形式，如下

## esm.type

* Type: `string`
* Default: `rollup`
* Enum: `rollup` | `babel`

配置 `esm` 使用 `rollup` 还是 `babel`

## esm.outFile

## esm.minify

## esm.sourcemap

## cjs

## cjs.type

## cjs.outFile

## cjs.minify

## cjs.sourcemap

## umd

## umd.outFile

## umd.minify

## umd.globals

## umd.name

## umd.sourcemap

## disableTypeCheck

## extraTypescriptPluginOpt

## extraNodeResolvePluginOpt

## extraRollupPlugins

## include

## extraReplacePluginOpts

## extraInjectPluginOpts

## extractCSS

## cssModule

## injectCSS

## extraPostCssOpt

## rollupLessOpt

## rollupSassOpt


