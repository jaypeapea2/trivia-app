/**
 * /routes/scores.js
 * -------------------
 * Handles storing or retrieving team scores.
 * Useful for leaderboards or displaying results.
 */

import express from 'express';
import { supabase } from '../config/supabaseClient.js';

const router = express.Router();

/**
 * GET /scores
 * Get all scores, or filter by team_id or block_id.
 * Query: ?team_id=1&block_id=2
 */
router.get('/', async (req, res) => {
  const { team_id, block_id } = req.query;

  let query = supabase.from('scores').select('*');

  if (team_id) query = query.eq('team_id', team_id);
  if (block_id) query = query.eq('block_id', block_id);

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

/**
 * POST /scores
 * Add a new score entry.
 * Body: { team_id, block_id, points }
 */
router.post('/', async (req, res) => {
  const { team_id, block_id, points } = req.body;

  const { data, error } = await supabase
    .from('scores')
    .insert([{ team_id, block_id, points }])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json(data);
});

/**
 * PUT /scores/:id
 * Update an existing score entry by ID.
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { points } = req.body;

  const { data, error } = await supabase
    .from('scores')
    .update({ points })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

/**
 * DELETE /scores/:id
 * Delete a score entry by ID.
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('scores').delete().eq('id', id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: `Score ${id} deleted.` });
});

export default router;
// This module handles all score-related operations