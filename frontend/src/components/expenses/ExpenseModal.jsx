import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { useExpenses } from '../../context/ExpenseContext';

const ExpenseModal = ({ isOpen, onClose, expense = null }) => {
  const { categories, createExpense, updateExpense } = useExpenses();
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFieldErrors({});
      if (expense) {
        setFormData({
          amount: expense.amount,
          categoryId: expense.categoryId?._id || expense.categoryId || '',
          date: new Date(expense.date).toISOString().split('T')[0],
          note: expense.note || ''
        });
      } else {
        setFormData({
          amount: '',
          categoryId: categories.length > 0 ? categories[0]._id : '',
          date: new Date().toISOString().split('T')[0],
          note: ''
        });
      }
    }
  }, [isOpen, expense, categories]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount)
      };

      if (expense) {
        await updateExpense(expense._id, payload);
      } else {
        await createExpense(payload);
      }
      onClose();
    } catch (err) {
      if (err.fieldErrors) setFieldErrors(err.fieldErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <Card 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <h2 style={{ marginBottom: 24, fontSize: 24 }}>
          {expense ? 'Edit Expense' : 'Add Expense'}
        </h2>

        <form onSubmit={handleSubmit}>
          <Input
            label="Amount"
            name="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            error={fieldErrors.amount}
            placeholder="0.00"
            required
            autoFocus
          />

          <div className="input-group">
            <label className="input-label">Category</label>
            <select
              name="categoryId"
              className="input-field"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            {fieldErrors.categoryId && <div className="input-error-text">{fieldErrors.categoryId}</div>}
          </div>

          <Input
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            error={fieldErrors.date}
            required
          />

          <Input
            label="Note"
            name="note"
            type="text"
            value={formData.note}
            onChange={handleChange}
            error={fieldErrors.note}
            placeholder="What was this for?"
          />

          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            <Button 
              type="button" 
              variant="outline" 
              fullWidth 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              fullWidth 
              loading={loading}
            >
              {expense ? 'Save Changes' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ExpenseModal;
