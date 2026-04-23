// src/utils/formatters.js
import { format, isToday, isYesterday, parseISO } from 'date-fns';

export const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount);

export const formatCompactCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency, 
    notation: 'compact', 
    maximumFractionDigits: 1 
  }).format(amount);

export const formatDate = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isToday(d))     return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d, yyyy');
};

export const formatMonthYear = (month, year) =>
  format(new Date(year, month - 1, 1), 'MMMM yyyy');

export const groupExpensesByDate = (expenses) => {
  const groups = {};
  for (const expense of expenses) {
    const key = formatDate(expense.date);
    if (!groups[key]) groups[key] = [];
    groups[key].push(expense);
  }
  return Object.entries(groups).map(([date, items]) => ({ date, items }));
};

export const exportToCSV = (expenses) => {
  const headers = ['Date', 'Category', 'Amount', 'Note'];
  const rows = expenses.map((e) => [
    format(parseISO(e.date), 'yyyy-MM-dd'),
    e.categoryId?.name || 'Unknown',
    e.amount.toFixed(2),
    `"${(e.note || '').replace(/"/g, '""')}"`,
  ]);
  return [headers, ...rows].map((r) => r.join(',')).join('\n');
};

export const exportToJSON = (expenses) =>
  JSON.stringify(
    expenses.map((e) => ({
      date:     e.date,
      category: e.categoryId?.name,
      amount:   e.amount,
      note:     e.note,
    })),
    null,
    2
  );
