import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables FIRST before importing routes
dotenv.config();

// Now import routes after env vars are loaded
import rulesRouter from './routes/rules.js';
import calculatorRouter from './routes/calculator.js';
import complianceRouter from './routes/compliance.js';
import aiRouter from './routes/ai.js';
import projectsRouter from './routes/projects.js';
import paymentsRouter from './routes/payments.js';
import authRouter from './routes/auth.js';
import reportsRouter from './routes/reports.js';
import districtRulesRouter from './routes/districtRules.js';
import tablesRouter from './routes/tables.js';
import regulationsRouter from './routes/regulations.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Log environment status
console.log('\n🔧 Environment Configuration:');
console.log('   MongoDB:', process.env.MONGODB_URI ? '✅ Configured' : '❌ Not configured');
console.log('   OpenAI API:', process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here' ? '✅ Configured' : '❌ Not configured');
console.log('   Razorpay:', process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'your_razorpay_key_id' ? '✅ Configured' : '❌ Not configured');
console.log('');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/rules', rulesRouter);
app.use('/api/district-rules', districtRulesRouter);
app.use('/api/calculator', calculatorRouter);
app.use('/api/compliance', complianceRouter);
app.use('/api/ai', aiRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/tables', tablesRouter);
app.use('/api/regulations', regulationsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'UDCPR Master API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
