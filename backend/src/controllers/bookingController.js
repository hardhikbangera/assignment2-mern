import pool from '../config/database.js';
import Slot from '../models/Slot.js';
import Experience from '../models/Experience.js';
import Promo from '../models/PromoCode.js';
import Booking from '../models/Booking.js';

const genRef = () => 'BK' + Math.random().toString(36).substring(2,9).toUpperCase();

export const createBooking = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { experience_id, slot_id, customer_name, customer_email, quantity = 1, promo_code } = req.body;
    if (!experience_id || !slot_id || !customer_name || !customer_email) throw new Error('Missing required fields');
    const slot = await Slot.getByIdForUpdate(client, slot_id);
    if (!slot) throw new Error('Slot not found');
    if (slot.available_slots < quantity) throw new Error('Not enough slots');
    const exp = await Experience.getById(experience_id);
    if (!exp) throw new Error('Experience not found');
    let subtotal = parseFloat(exp.price) * quantity;
    let discount = 0;
    if (promo_code) {
      const p = await Promo.findActive(promo_code);
      if (p) {
        if (p.discount_type === 'percentage') discount = (subtotal * parseFloat(p.discount_value)) / 100;
        else discount = parseFloat(p.discount_value);
      }
    }
    const taxes = Math.round((subtotal - discount) * 0.059 * 100) / 100;
    const total = Math.round((subtotal - discount + taxes) * 100) / 100;
    await Slot.decreaseAvailable(client, slot_id, quantity);
    const booking_reference = genRef();
    const booking = await Booking.create(client, { experience_id, slot_id, customer_name, customer_email, quantity, subtotal, taxes, discount, total, promo_code, booking_reference });
    await client.query('COMMIT');
    res.status(201).json({ success: true, booking });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(400).json({ success: false, error: err.message || 'Failed' });
  } finally {
    client.release();
  }
};

export const getBookingByReference = async (req, res) => {
  try {
    const { reference } = req.params;
    const result = await pool.query(
      `SELECT b.*, e.name as experience_name, s.date, s.time
       FROM bookings b
       JOIN experiences e ON b.experience_id = e.id
       JOIN slots s ON b.slot_id = s.id
       WHERE b.booking_reference = $1`,
      [reference]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};