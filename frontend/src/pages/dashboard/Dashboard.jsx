// src/pages/dashboard/Dashboard.jsx
import React, { useEffect } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { formatCurrency, formatMonthYear } from '../../utils/formatters';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import './Dashboard.css';

const Dashboard = () => {
  const { summary, loading, fetchSummary } = useExpenses();
  const now = new Date();

  useEffect(() => {
    fetchSummary(now.getMonth() + 1, now.getFullYear());
  }, []);

  if (loading && !summary) return <Loading />;

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview for {formatMonthYear(now.getMonth() + 1, now.getFullYear())}</p>
        </div>
      </header>

      {!summary?.monthlyTotal && !summary?.categoryBreakdown?.length ? (
        <Card>
          <EmptyState
            icon="📊"
            title="No expenses this month"
            subtitle="Add some expenses to see your spending overview!"
          />
        </Card>
      ) : (
        <div className="dashboard-grid">
          {/* Main Total Card */}
          <Card className="total-card glass-panel">
            <h3 className="total-label">Total Spent This Month</h3>
            <div className="total-amount">{formatCurrency(summary.monthlyTotal)}</div>
          </Card>

          {/* Breakdown cards */}
          <div className="breakdown-grid">
            {summary.categoryBreakdown.map(cat => (
              <Card key={cat.categoryId} className="category-card">
                <div className="cat-header">
                  <div className="cat-icon" style={{ backgroundColor: cat.color }}>
                    {cat.icon}
                  </div>
                  <span className="cat-name">{cat.name}</span>
                </div>
                <div className="cat-amount">{formatCurrency(cat.total)}</div>
                <div className="cat-pct">
                  {((cat.total / summary.monthlyTotal) * 100).toFixed(1)}% of total
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
