/**
 * /routes/slides.js
 * -------------------
 * Handles custom slides to display between rounds.
 * Slides can hold titles, text, images, or other content.
 */

import express from 'express';
import { supabase } from '../config/supabaseClient.js';

const router = express.Router();

/**
 * GET /slides
 * Get all slides or filter by block_id.
 * Query: ?block_id=1
 */
router.get('/', async (req, res) => {
  const { block_id } = req.query;

  let query = supabase.from('slides').select('*');

  if (block_id) {
    query = query.eq('block_id', block_id).order('order', { ascending: true });
  }

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

/**
 * POST /slides
 * Add a new slide.
 * Body: { block_id, title, content, order, type }
 */
router.post('/', async (req, res) => {
  const { block_id, title, content, order, type } = req.body;

  const { data, error } = await supabase
    .from('slides')
    .insert([{ block_id, title, content, order, type }])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json(data);
});

/**
 * PUT /slides/:id
 * Update an existing slide by ID.
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, order, type } = req.body;

  const { data, error } = await supabase
    .from('slides')
    .update({ title, content, order, type })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

/**
 * DELETE /slides/:id
 * Remove a slide by ID.
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('slides').delete().eq('id', id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: `Slide ${id} deleted.` });
});

export default router;
