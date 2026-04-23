// src/config/db.js
const mongoose = require('mongoose');
const { mongoUri, nodeEnv } = require('./env');

const connect = async () => {
  try {
    const conn = await mongoose.connect(mongoUri, {
      // Mongoose 8 defaults are sensible; add extras here if needed
    });
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌  MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
};

// Log slow queries in development
if (nodeEnv === 'development') {
  mongoose.set('debug', (collectionName, methodName, ...methodArgs) => {
    console.log(`[Mongoose] ${collectionName}.${methodName}`, ...methodArgs);
  });
}

module.exports = { connect };
