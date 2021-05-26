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

* Type: `string`
* Default: `index.esm.js`

配置 `esm` 输出文件

## esm.minify

* Type: `boolean`
* Default: `false`

是否压缩代码，一般没必要压缩

## esm.sourcemap

* Type: `boolean`
* Default: `false`

是否输出 `sourcemap` 文件
## cjs

* Type: `string ｜ boolean | Object`
* Default: `false`
* Enum: `rollup` | `false` | `type, outFile, ...其他子项目}`

打包 `CommonJs` 相关配置

对于 `cjs` 的配置，也可使用对象的形式，如下

## cjs.type

* Type: `string`
* Default: `rollup`
* Enum: `rollup` | `babel`

配置 `cjs` 使用 `rollup` 还是 `babel`

## cjs.outFile

* Type: `string`
* Default: `index.js`

配置 `cjs` 输出文件

## cjs.minify

* Type: `boolean`
* Default: `false`

是否压缩代码，一般没必要压缩
## cjs.sourcemap

* Type: `boolean`
* Default: `false`

是否输出 `sourcemap` 文件
## umd

* Type: `string ｜ boolean | Object`
* Default: `false`
* Enum: `rollup` | `false` | `type, outFile, ...其他子项目}`

打包 `umd` 相关配置

对于 `umd` 的配置，也可使用对象的形式，如下

## umd.outFile

* Type: `string`
* Default: `index.umd.js`

配置 `umd` 输出文件

## umd.minFile

* Type: `boolean`
* Default: `false`

是否同步输出 `index.umd.min.js` 文件

## umd.globals

* Type: `Object`
* Default: `undefined`


配置 [rollup globals](https://www.rollupjs.com/guide/big-list-of-options#%E5%85%A8%E5%B1%80%E6%A8%A1%E5%9D%97globals--g--globals)

## umd.name

* Type: `Object`
* Default: `pkg.name ｜ path.basename(pkg.name)`

配置 [rollup name](https://www.rollupjs.com/guide/big-list-of-options#%E7%94%9F%E6%88%90%E5%8C%85%E5%90%8D%E7%A7%B0name--n--name)

## umd.sourcemap

* Type: `boolean`
* Default: `false`

是否输出 `sourcemap` 文件

## disableTypeCheck

* Type: `boolean`
* Default: `false`

是否进行 `typescript` 类型检查，用于 `rollup-plugin-typescript2` 插件

## extraTypescriptPluginOpt

* Type: `Object`
* Default: `undefined`

拓展 `rollup-plugin-typescript2` 插件配置

## extraNodeResolvePluginOpt

* Type: `Object`
* Default: `undefined`

拓展 `@rollup/plugin-node-resolve2` 插件配置

## extraRollupPlugins

* Type: `Array`
* Default: `[]`


拓展 `rollup` 插件

> 对于 `Avenger`，内部默认引入了 `@rollup/plugin-url` `@svgr/rollup` `rollup-plugin-typescript2` `@rollup/plugin-json` `@rollup/plugin-babel` `@rollup/plugin-commonjs` `@rollup/plugin-node-resolve` `@rollup/plugin-replace` `@rollup/plugin-inject` `rollup-plugin-postcss`
## include

* Type: `string`
* Default: ``

配置 rollup-plugin-commonjs 的 [include](https://github.com/rollup/rollup-plugin-commonjs#usage)。

## extraReplacePluginOpts

* Type: `Object`
* Default: `undefined`

拓展 `@rollup/plugin-replace` 插件配置

## extraInjectPluginOpts

* Type: `Object`
* Default: `undefined`

拓展 `@rollup/plugin-inject` 插件配置
## extractCSS

* Type: `boolean`
* Default: `false`

配置 `rollup-plugin-postcss` 的 `extract`，配置是否提取 `css` 为单独文件

## cssModule

* Type: `boolean | Record<string, any>`
* Default: `false`

配置 `rollup-plugin-postcss` 的 `modules`

默认文件中 `xxx.module.css` 文件走 `css module`，如果配置了该项，所有样式文件都走 `css module`

如果配置为 `Object`, 则会将配置传给 [https://github.com/madyankin/postcss-modules](https://github.com/madyankin/postcss-modules)


## injectCSS

* Type: `boolean`
* Default: `true`

配置 `rollup-plugin-postcss` 的 `inject`

## extraPostCssOpt

* Type: `Object`
* Default: `undefined`

拓展 `rollup-plugin-postcss` 插件都其他配置

## rollupLessOpt

* Type: `Object`
* Default: `undefined`

拓展 `rollup-plugin-postcss` `less` 的配置

## rollupSassOpt

* Type: `Object`
* Default: `undefined`


拓展 `rollup-plugin-postcss` `sass` 的配置


## extraExternal

* Type: `Array<string>`
* Default: `[]`

拓展 `rollup` 的 [外链(external)](https://www.rollupjs.com/guide/big-list-of-options#%E5%A4%96%E9%93%BEexternal--e--external)

默认会读取 `dependencies` `peerDependencies`，可自行拓展该配置
