import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Lazy initialize supabase to prevent crash on startup if keys are missing
let supabase: any = null;
const getSupabase = () => {
  if (!supabase) {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials missing');
    }
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
};

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials missing.');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { error } = await getSupabase()
      .from('subscribers')
      .insert([{ email }]);

    if (error) {
      if (error.code === '23505') { // Unique constraint violation in Postgres
        return res.status(409).json({ error: 'Email already subscribed' });
      }
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: error.message || 'Database error' });
    }

    res.json({ success: true, message: 'Thank you for subscribing!' });
  } catch (error: any) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Export subscribers (Convenience route)
app.get('/api/subscribers/export', async (req, res) => {
  try {
    const { data, error } = await getSupabase()
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// Vite middleware for development
if (process.env.NODE_ENV !== 'production') {
  const startDevServer = async () => {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  };
  startDevServer();
}

export default app;
