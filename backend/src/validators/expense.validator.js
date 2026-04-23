// src/validators/expense.validator.js
const { z } = require('zod');

const expenseSchema = z.object({
  categoryId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid category ID'),
  amount: z
    .number({ required_error: 'Amount is required', invalid_type_error: 'Amount must be a number' })
    .positive('Amount must be greater than 0'),
  note: z.string().max(300, 'Note must be 300 characters or less').optional().default(''),
  date: z.coerce.date({ required_error: 'Date is required' }),
});

const expenseUpdateSchema = expenseSchema.partial();

const expenseQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  categoryId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  search: z.string().max(100).optional(),
  sortBy: z.enum(['date', 'amount']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

module.exports = { expenseSchema, expenseUpdateSchema, expenseQuerySchema };
