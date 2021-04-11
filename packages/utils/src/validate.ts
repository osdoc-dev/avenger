import joi from 'joi'

export const createSchema = (fn: Function) => {
  let schema = fn(joi)
  if (typeof schema === 'object' && typeof schema.validate !== 'function') schema = joi.object(schema)
  return schema
}

export const validateSchema = (obj: Object, schema: any, cb: Function) => {
  if (!schema) cb('schema not found')
  const { error } = schema && schema.validate(obj)
  if (error) {
    cb(error.details[0].message)
    process.exit(1)
  }
}

export const validateSchemaSync = (obj: Object, schema: any) => {
  if (!schema) throw new Error('schema not found')
  const { error } = schema && schema.validate(obj)
  if (error) throw error
}
