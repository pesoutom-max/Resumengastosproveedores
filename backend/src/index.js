import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Test connection route
app.get('/api/health', async (req, res) => {
  try {
    const { data, error } = await supabase.from('expenses').select('count', { count: 'exact' });
    if (error) throw error;
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Upload and process expenses
app.post('/api/upload', express.json({ limit: '50mb' }), async (req, res) => {
  try {
    const { expenses } = req.body;

    if (!Array.isArray(expenses) || expenses.length === 0) {
      return res.status(400).json({ error: 'No expenses provided' });
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('expenses')
      .insert(expenses)
      .select();

    if (error) throw error;

    res.json({ success: true, inserted: data.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get summary by provider
app.get('/api/summary', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('get_summary_by_provider');

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
