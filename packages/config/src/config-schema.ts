import { createSchema } from '@osdoc-dev/avenger-utils'
import { BundleTypeMap } from '@osdoc-dev/avenger-shared'

const schema = createSchema(joi =>
  joi.object({
    esm: [
      joi.boolean(),
      joi.string(),
      joi.object({
        type: joi.string().valid(BundleTypeMap.babel, BundleTypeMap.rollup).required(),
        outFile: joi.string(),
        minify: joi.boolean(),
        sourcemap: joi.boolean(),
      }),
    ],
    cjs: [
      joi.boolean(),
      joi.string(),
      joi.object({
        type: joi.string().valid(BundleTypeMap.babel, BundleTypeMap.rollup).required(),
        outFile: joi.string(),
        minify: joi.boolean(),
        sourcemap: joi.boolean(),
      }),
    ],
    umd: [
      joi.boolean(),
      joi.object({
        outFile: joi.string(),
        minify: joi.boolean(),
        sourcemap: joi.boolean(),
        minFile: joi.boolean(),
        name: joi.string(),
        globals: joi.object(),
      }),
    ],
    outFile: joi.string(),
    entry: [joi.string()],
    disableTypeCheck: joi.boolean(),
    typescriptOpts: joi.object(),
    include: joi.string(),
    cssModule: [joi.boolean(), joi.object()],
    extraReplacePluginOpts: joi.object(),
    extraInjectPluginOpts: joi.object(),
    extraPostCssPluginOpt: joi.object(),
    extraPostCssOpt: joi.object(),
    autoprefixerOpts: joi.object(),
    extractCSS: joi.boolean(),
    injectCSS: joi.boolean(),
    rollupSassOpt: joi.object(),
    rollupLessOpt: joi.object(),
    runtimeHelpers: joi.boolean(),
    extraBabelPlugins: joi.object(),
    extraBabelPresets: joi.object(),
  })
)

export default schema
