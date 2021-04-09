# avenger 复仇者

集成打包工具

## 愿景

- 我想把一个 `React`/`Vue` 组件打成 `umd/cjs/esm` 去使用
- 我想把一堆函数封装成一个公共包，在 `node/brower` 使用

## 知识普及

### umd

同时兼容 `CJS` `AMD` ，支持直接在浏览器使用 `<script src="lib.umd.js"></script>` 加载 

### cjs

`CommonJS` , 只能在 `Nodejs` 使用，使用 `require("module")` 加载模块
### esm
`ECMAScript Module` 使用 `import export` 管理依赖
，可以被依赖分析以及 `Tree-Shaking`。支持动态加载 `import()`

## 开发

```
lerna add module-1 --scope=@avenger/cli
```


