import express from 'express';
import { supabase } from '../config/supabaseClient.js';

const router = express.Router();

/**
 * GET /teams
 * Get all teams
 */
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('teams').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/**
 * POST /teams
 * Create a new team
 * Body: { name, email, phone, logo_url }
 */
router.post('/', async (req, res) => {
  const { name, email, phone, logo_url } = req.body;

  const { data, error } = await supabase
    .from('teams')
    .insert([{ name, email, phone, logo_url }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

/**
 * PUT /teams/:id
 * Update a team by ID
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, logo_url } = req.body;

  const { data, error } = await supabase
    .from('teams')
    .update({ name, email, phone, logo_url })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/**
 * DELETE /teams/:id
 * Delete a team by ID
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('teams').delete().eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: `Team ${id} deleted.` });
});

export default router;
