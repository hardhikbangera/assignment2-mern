import pool from '../config/database.js';

export const create = async (client, payload) => {
  const { experience_id, slot_id, customer_name, customer_email, quantity, subtotal, taxes, discount, total, promo_code, booking_reference } = payload;
  const res = await client.query(
    `INSERT INTO bookings (experience_id, slot_id, customer_name, customer_email, quantity, subtotal, taxes, discount, total, promo_code, booking_reference, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [experience_id, slot_id, customer_name, customer_email, quantity, subtotal, taxes, discount, total, promo_code, booking_reference, 'confirmed']
  );
  return res.rows[0];
};

export default { create };