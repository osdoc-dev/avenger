import { createSchema } from '@avenger/utils'
import { BundleTypeMap } from '@avenger/shared'

const schema = createSchema(joi =>
  joi.object({
    esm: [
      joi.string(),
      joi.object({
        type: joi.string().valid(BundleTypeMap.babel, BundleTypeMap.rollup).required(),
        file: joi.string(),
        importLibToEs: joi.boolean(),
        minify: joi.boolean(),
      }),
    ],
    cjs: joi.string(),
    outFile: joi.string(),
    entry: [joi.string()],
  })
)

export default schema
