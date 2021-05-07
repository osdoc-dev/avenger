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
        name: joi.string().required(),
      }),
    ],
    outFile: joi.string(),
    entry: [joi.string()],
    disableTypeCheck: joi.boolean(),
    typescriptOpts: joi.object(),
  })
)

export default schema
