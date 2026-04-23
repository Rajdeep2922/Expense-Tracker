// src/pages/expenses/Expenses.jsx
import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import ExpenseModal from '../../components/expenses/ExpenseModal';
import './Expenses.css';

const Expenses = () => {
  const { expenses, loading, fetchExpenses, fetchCategories, deleteExpense, pagination } = useExpenses();
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchExpenses({ page, limit: 15 }, page > 1);
  }, [page]);

  const loadMore = () => {
    if (page < (pagination?.pages || 1)) setPage(p => p + 1);
  };

  const handleAdd = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header flex-between">
        <h1 className="page-title">Expenses</h1>
        <Button className="add-btn" onClick={handleAdd}><Plus size={18} /> Add Expense</Button>
      </header>

      {loading && page === 1 ? <Loading /> : null}

      {!loading && expenses.length === 0 ? (
        <Card><EmptyState title="No expenses found" subtitle="Track your first expense today!" /></Card>
      ) : (
        <div className="expenses-list">
          {expenses.map(expense => (
            <Card key={expense._id} className="expense-item">
              <div className="expense-main">
                <div className="expense-icon" style={{ backgroundColor: expense.categoryId?.color || '#ccc' }}>
                  {expense.categoryId?.icon || '📦'}
                </div>
                <div className="expense-details">
                  <div className="expense-note">{expense.note || 'No note'}</div>
                  <div className="expense-meta">
                    <span className="expense-category" style={{ color: expense.categoryId?.color || '#a0a0a0' }}>
                      {expense.categoryId?.name || 'Uncategorized'}
                    </span>
                    <span>•</span>
                    <span className="expense-date">{formatDate(expense.date)}</span>
                  </div>
                </div>
              </div>
              <div className="expense-right">
                <div className="expense-amount">
                  {formatCurrency(expense.amount)}
                </div>
                <div className="expense-actions">
                  <button className="icon-btn edit" onClick={() => handleEdit(expense)} title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button className="icon-btn delete" onClick={() => handleDelete(expense._id)} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}

          {pagination && page < pagination.pages && (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Button variant="outline" onClick={loadMore} loading={loading}>Load More</Button>
            </div>
          )}
        </div>
      )}

      <ExpenseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        expense={editingExpense} 
      />
    </div>
  );
};

export default Expenses;
