/**
 * Trivia App Backend
 * ------------------
 * This is the main entry point for your Express server.
 * It sets up middleware, connects your routers,
 * and listens on the configured port.
 */

import express from 'express';
import cors from 'cors';

// ✅ Import shared Supabase client config
import { supabase } from './config/supabaseClient.js';

// ✅ Import all modular route handlers
import blocksRoutes from './routes/blocks.js';
import questionsRoutes from './routes/questions.js';
import teamsRoutes from './routes/teams.js';
import answersRoutes from './routes/answers.js';
import scoresRoutes from './routes/scores.js';
import slidesRoutes from './routes/slides.js';

const app = express();

// ✅ Enable Cross-Origin Resource Sharing for your frontend
app.use(cors());

// ✅ Enable JSON parsing for incoming requests
// This allows Express to read `req.body` for POST/PUT calls
app.use(express.json());

// ✅ Root route for health check or uptime monitor
app.get('/', (req, res) => {
  res.send('✅ Trivia backend is running!');
});

// ✅ Simple test route to confirm Supabase connection works
app.get('/test-blocks', async (req, res) => {
  const { data, error } = await supabase.from('blocks').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ✅ Register all API routes
app.use('/blocks', blocksRoutes);         // Rounds / question blocks
app.use('/questions', questionsRoutes);   // Questions per block
app.use('/teams', teamsRoutes);           // Team info, logos, contacts
app.use('/answers', answersRoutes);       // Submitted team answers
app.use('/scores', scoresRoutes);         // Team scores per game/block
app.use('/slides', slidesRoutes);         // Custom slides between rounds

// ✅ Define server port and start listening
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Trivia backend running at http://localhost:${PORT}`);
});
