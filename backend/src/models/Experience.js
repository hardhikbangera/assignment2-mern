import pool from '../config/database.js';

export const getAll = async (search) => {
  if (search) {
    const res = await pool.query('SELECT * FROM experiences WHERE name ILIKE $1 OR location ILIKE $1 ORDER BY created_at DESC', [`%${search}%`]);
    return res.rows;
  }
  const res = await pool.query('SELECT * FROM experiences ORDER BY created_at DESC');
  return res.rows;
};

export const getById = async (id) => {
  const res = await pool.query('SELECT * FROM experiences WHERE id = $1', [id]);
  return res.rows[0];
};

export default { getAll, getById };