import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api', apiRouter);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'fixly-api',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`[Fixly Server] Server listening on http://localhost:${PORT}`);
});
