import { createSchema } from '@avenger/utils'

const schema = createSchema(joi =>
  joi.object({
    esm: joi.string(),
    cjs: joi.string(),
    outFile: joi.string(),
    entry: [joi.string()],
  })
)

export default schema
