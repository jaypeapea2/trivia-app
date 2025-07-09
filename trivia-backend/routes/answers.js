/**
 * /routes/answers.js
 * -------------------
 * Handles teams submitting answers to questions
 * and lets the host retrieve them for scoring.
 */

import express from 'express';
import { supabase } from '../config/supabaseClient.js';

const router = express.Router();

/**
 * POST /answers
 * Submit a new answer.
 * Body: { team_id, question_id, answer_text }
 */
router.post('/', async (req, res) => {
  const { team_id, question_id, answer_text } = req.body;

  const { data, error } = await supabase
    .from('answers')
    .insert([{ team_id, question_id, answer_text }])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json(data);
});

/**
 * GET /answers
 * Get all answers, with optional filters.
 * Query: ?team_id=1&question_id=2
 */
router.get('/', async (req, res) => {
  const { team_id, question_id } = req.query;

  let query = supabase.from('answers').select('*');

  if (team_id) query = query.eq('team_id', team_id);
  if (question_id) query = query.eq('question_id', question_id);

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

export default router;
