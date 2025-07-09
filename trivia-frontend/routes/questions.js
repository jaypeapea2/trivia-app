import express from 'express';
import { supabase } from '../config/supabaseClient.js';

const router = express.Router();

/**
 * GET /questions
 * Return all questions (optional filter by block_id)
 * Example: /questions?block_id=1
 */
router.get('/', async (req, res) => {
  const { block_id } = req.query;

  let query = supabase.from('questions').select('*');

  if (block_id) {
    query = query.eq('block_id', block_id);
  }

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/**
 * POST /questions
 * Create a new question
 * Body: { block_id, question_text, question_type, options }
 * (options can be array or JSON string)
 */
router.post('/', async (req, res) => {
  const { block_id, question_text, question_type, options } = req.body;

  const { data, error } = await supabase
    .from('questions')
    .insert([{ block_id, question_text, question_type, options }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

/**
 * PUT /questions/:id
 * Update a question by ID
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { question_text, question_type, options } = req.body;

  const { data, error } = await supabase
    .from('questions')
    .update({ question_text, question_type, options })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/**
 * DELETE /questions/:id
 * Delete a question by ID
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('questions').delete().eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: `Question ${id} deleted.` });
});

export default router;
