import express from 'express';
import { supabase } from '../config/supabaseClient.js';

const router = express.Router();

/**
 * GET /blocks
 * Return all blocks
 */
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('blocks').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/**
 * POST /blocks
 * Create a new block
 * Body: { title, description, timer_seconds }
 */
router.post('/', async (req, res) => {
  console.log('REQ BODY:', req.body); // ✅ Debug output
  
  const { title, description, timer_seconds } = req.body;

  const { data, error } = await supabase
    .from('blocks')
    .insert([{ title, description, timer_seconds }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

/**
 * PUT /blocks/:id
 * Update a block by ID
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, timer_seconds } = req.body;

  const { data, error } = await supabase
    .from('blocks')
    .update({ title, description, timer_seconds })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/**
 * DELETE /blocks/:id
 * Delete a block by ID
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('blocks').delete().eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: `Block ${id} deleted.` });
});

export default router;
