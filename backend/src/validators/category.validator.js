// src/validators/category.validator.js
const { z } = require('zod');

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(40),
  icon: z.string().emoji('Icon must be a single emoji').optional().default('📦'),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex code')
    .optional()
    .default('#AED6F1'),
});

const categoryUpdateSchema = categorySchema.partial();

module.exports = { categorySchema, categoryUpdateSchema };
