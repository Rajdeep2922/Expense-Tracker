// app.js — Express app factory (no listen — makes testing easier)
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const { corsOrigins, nodeEnv } = require('./src/config/env');
const { apiLimiter } = require('./src/middleware/rateLimiter.middleware');
const errorHandler = require('./src/middleware/error.middleware');

const authRoutes     = require('./src/routes/auth.routes');
const expenseRoutes  = require('./src/routes/expense.routes');
const categoryRoutes = require('./src/routes/category.routes');

const app = express();

// ── Security & basics ─────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: corsOrigins.includes('*') ? '*' : corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
if (nodeEnv !== 'test') app.use(morgan('dev'));

// ── Rate limiting (all API routes) ───────────────────────────────────────────
app.use('/api', apiLimiter);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/expenses',   expenseRoutes);
app.use('/api/categories', categoryRoutes);

// ── 404 catch ─────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

// ── Centralised error handler ────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
