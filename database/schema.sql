-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  date DATE NOT NULL,
  provider TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  category TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_provider ON expenses(provider);
CREATE INDEX IF NOT EXISTS idx_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_provider_date ON expenses(provider, date);

-- Create function to calculate summary by provider
CREATE OR REPLACE FUNCTION get_summary_by_provider()
RETURNS TABLE (
  provider TEXT,
  total NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    expenses.provider,
    SUM(expenses.amount)::NUMERIC as total
  FROM expenses
  GROUP BY expenses.provider
  ORDER BY total DESC;
END;
$$ LANGUAGE plpgsql;

-- Create view for monthly summary
CREATE OR REPLACE VIEW monthly_summary AS
SELECT 
  DATE_TRUNC('month', date)::DATE as month,
  provider,
  SUM(amount) as total,
  COUNT(*) as count,
  AVG(amount) as avg_amount,
  MAX(amount) as max_amount,
  MIN(amount) as min_amount
FROM expenses
GROUP BY DATE_TRUNC('month', date), provider
ORDER BY month DESC, total DESC;

-- Create view for category summary
CREATE OR REPLACE VIEW category_summary AS
SELECT 
  category,
  SUM(amount) as total,
  COUNT(*) as count,
  AVG(amount) as avg_amount
FROM expenses
WHERE category IS NOT NULL
GROUP BY category
ORDER BY total DESC;

-- Enable Row Level Security (optional, for multi-user setup)
-- ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Grant permissions (if needed)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON expenses TO authenticated;
-- GRANT SELECT ON monthly_summary TO authenticated;
-- GRANT SELECT ON category_summary TO authenticated;
