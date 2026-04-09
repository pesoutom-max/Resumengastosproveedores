import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
