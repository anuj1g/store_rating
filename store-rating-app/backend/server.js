require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

// Import utilities
const logger = require('./utils/logger');
const { handleError, notFoundHandler } = require('./utils/errorHandler');

// Import database connection
const db = require('./models');

// Import routes
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const userRoutes = require('./routes/user.routes');
const ownerRoutes = require('./routes/owner.routes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy if behind a reverse proxy (e.g., Nginx, Heroku, AWS ELB)
app.enable('trust proxy');

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
}));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev', { stream: { write: message => logger.info(message.trim()) } }));
}

// Limit requests from same IP (100 requests per 15 minutes)
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again in 15 minutes!',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Serving static files
app.use(express.static(path.join(__dirname, '../public')));

// Test database connection
const testDbConnection = async () => {
  try {
    await db.sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Sync database and start server
const startServer = async () => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await testDbConnection();
      
      // Sync all models with the database
      if (process.env.NODE_ENV === 'development') {
        await db.sequelize.sync({ alter: true });
      } else {
        await db.sequelize.sync();
      }
      
      logger.info('Database synced');
      
      // Start server
      const server = app.listen(PORT, () => {
        logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      });
      
      // Handle unhandled promise rejections
      process.on('unhandledRejection', (err) => {
        logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
        logger.error(err.name, err.message);
        server.close(() => {
          process.exit(1);
        });
      });
    }
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
};

// Compress all responses
autoCompress = require('express-auto-compress');
app.use(autoCompress({
  filter: () => true,
  customCompressions: [{
    encodingName: 'gzip',
    onCompress: (content, compressionCallback) => {
      return compression.gzip(content, compressionCallback);
    }
  }],
  threshold: 1024 // Only compress responses larger than 1KB
}));

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/owner', ownerRoutes);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
  });
}

// 404 handler
app.all('*', notFoundHandler);

// Global error handling middleware
app.use(handleError);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

// Start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
