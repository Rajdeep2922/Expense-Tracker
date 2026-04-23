// src/middleware/validate.middleware.js
// Generic Zod validation middleware factory.
// Usage: router.post('/', validate(mySchema), controller)

const { error } = require('../utils/response');

const validate = (schema, target = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[target]);
  if (!result.success) {
    const details = result.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return error(res, 'Validation failed', 422, details);
  }
  req[target] = result.data; // replace with coerced/defaulted values
  next();
};

module.exports = validate;
