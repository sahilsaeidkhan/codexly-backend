require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const passport = require('./config/passport');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const practiceRoutes = require('./routes/practiceRoutes');
const aiRoutes = require('./routes/aiRoutes');
const earlyAccessRoutes = require('./routes/earlyAccessRoutes');
const errorHandler = require('./middleware/errorMiddleware');

// Catch synchronous exceptions that slip through all handlers
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION — shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

const app = express();

// Security: HTTP headers
app.use(helmet());

// Security: Rate limiting — 100 requests per 15 min per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});
app.use(limiter);

// CORS — production-safe: only allow FRONTEND_URL
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Passport initialization (no sessions)
app.use(passport.initialize());

// Body parser with size limit (prevents payload abuse)
app.use(express.json({ limit: '50kb' }));

// Health check
app.get('/', (_req, res) => {
  res.send('Backend is running');
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/early-access', earlyAccessRoutes);

// Error Middleware
app.use(errorHandler);

// Async bootstrap: connect to DB first, then start listening
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Catch async rejections that slip through all handlers
  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION — shutting down...');
    console.error(err.name, err.message);
    server.close(() => process.exit(1));
  });
};

startServer();
