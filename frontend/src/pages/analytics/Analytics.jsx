// src/pages/analytics/Analytics.jsx
import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { useExpenses } from '../../context/ExpenseContext';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatters';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import './Analytics.css';

const Analytics = () => {
  const { mode } = useTheme();
  const { summary, trends, loading, fetchSummary, fetchTrends } = useExpenses();
  const [trendType, setTrendType] = useState('monthly');
  const now = new Date();

  useEffect(() => {
    fetchSummary(now.getMonth() + 1, now.getFullYear());
    fetchTrends(trendType, 6);
  }, [trendType]);

  if (loading && !summary) return <Loading />;

  const hasData = summary?.categoryBreakdown?.length > 0;
  
  // Prepare data for recharts
  const pieData = summary?.categoryBreakdown?.map(c => ({
    name: c.name,
    value: c.total,
    color: c.color
  })) || [];

  const barData = trends?.trends?.map((t, i) => ({
    name: trendType === 'monthly' ? `M${t.month}` : `W${t.week}`,
    total: t.total,
  })) || [];

  // Theme colors for axis
  const axisColor = mode === 'dark' ? '#a0a0c0' : '#606080';
  const gridColor = mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Analytics</h1>
      </header>

      <div className="toggle-group">
        <button 
          className={`toggle-btn ${trendType === 'monthly' ? 'active' : ''}`}
          onClick={() => setTrendType('monthly')}
        >Monthly</button>
        <button 
          className={`toggle-btn ${trendType === 'weekly' ? 'active' : ''}`}
          onClick={() => setTrendType('weekly')}
        >Weekly</button>
      </div>

      {!hasData ? (
        <Card><EmptyState icon="📊" title="No Data" subtitle="Track expenses to see analytics" /></Card>
      ) : (
        <div className="analytics-grid">
          {/* Pie Chart */}
          <Card className="chart-card">
            <h3>Spending by Category</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="custom-legend">
              {pieData.map((entry, index) => (
                <div key={index} className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: entry.color }} />
                  <span className="legend-name">{entry.name}</span>
                  <span className="legend-value">{formatCurrency(entry.value)}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Bar Chart */}
          <Card className="chart-card">
            <h3>{trendType === 'monthly' ? 'Monthly Trends' : 'Weekly Trends'}</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={barData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                  <XAxis dataKey="name" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => formatCompactCurrency(val)} />
                  <Tooltip wrapperStyle={{ borderRadius: '8px' }} formatter={(val) => formatCurrency(val)} />
                  <Bar dataKey="total" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Analytics;
