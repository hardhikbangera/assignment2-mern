import pool from '../config/database.js';

export const findActive = async (code) => {
  const res = await pool.query('SELECT * FROM promo_codes WHERE code = $1 AND is_active = true', [code.toUpperCase()]);
  return res.rows[0];
};

export default { findActive };