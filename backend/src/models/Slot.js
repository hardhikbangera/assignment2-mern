import pool from '../config/database.js';

export const getByExperience = async (experience_id) => {
  const res = await pool.query('SELECT * FROM slots WHERE experience_id = $1 AND date >= CURRENT_DATE ORDER BY date, time', [experience_id]);
  return res.rows;
};

export const getByIdForUpdate = async (client, id) => {
  const res = await client.query('SELECT * FROM slots WHERE id = $1 FOR UPDATE', [id]);
  return res.rows[0];
};

export const decreaseAvailable = async (client, id, qty) => {
  await client.query('UPDATE slots SET available_slots = available_slots - $1 WHERE id = $2', [qty, id]);
};

export default { getByExperience, getByIdForUpdate, decreaseAvailable };