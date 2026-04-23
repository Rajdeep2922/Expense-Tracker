// server.js — Entry point: connects DB then starts HTTP server
const app = require('./app');
const { connect } = require('./src/config/db');
const { port } = require('./src/config/env');

const start = async () => {
  await connect();
  app.listen(port, () => {
    console.log(`🚀  Server running on http://localhost:${port}`);
    console.log(`📋  Health: http://localhost:${port}/health`);
  });
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  process.exit(1);
});

start();
