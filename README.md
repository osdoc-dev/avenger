# avenger 复仇者

集成打包工具

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

- **disableTypeCheck**

打包时禁用 `typescript` 类型检查

- **extraTypescriptPluginOpt**

透传给 `rollup-plugin-typescript2` 插件的配置

注意：`declarationDir` 默认开启,并且默认输出到文件夹 `dist/types` 下

- **extraNodeResolvePluginOpt**

透传给 `@rollup/plugin-node-resolve` 插件的配置

- **extraRollupPlugins**

拓展 `rollup plugins` 