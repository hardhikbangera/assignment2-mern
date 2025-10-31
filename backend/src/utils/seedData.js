import pool from '../config/database.js';

const experiences = [
  { name:'Kayaking', location:'Udupi', description:'Curated small-group experience. Certified guide. Safety first with gear included.', price:999, image_url:'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80', category:'Water Sports' },
  { name:'Nandi Hills Sunrise', location:'Bangalore', description:'Curated small-group experience. Certified guide.', price:899, image_url:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', category:'Trekking' },
  { name:'Coffee Trail', location:'Coorg', description:'Curated small-group experience. Certified guide.', price:1299, image_url:'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80', category:'Nature' }
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('TRUNCATE bookings, slots, experiences CASCADE');
    for (const e of experiences) {
      const r = await client.query(
        `INSERT INTO experiences (name, location, description, price, image_url, category) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
        [e.name, e.location, e.description, e.price, e.image_url, e.category]
      );
      const expId = r.rows[0].id;
      const times = ['07:00:00','09:00:00','11:00:00','13:00:00'];
      for (let d=0; d<7; d++) {
        const date = new Date();
        date.setDate(date.getDate()+d);
        const dateStr = date.toISOString().split('T')[0];
        for (const t of times) {
          const avail = Math.floor(Math.random()*6)+2;
          await client.query('INSERT INTO slots (experience_id, date, time, available_slots, total_slots) VALUES ($1,$2,$3,$4,$5)', [expId, dateStr, t, avail, 10]);
        }
      }
    }
    await client.query(`INSERT INTO promo_codes (code, discount_type, discount_value, is_active) VALUES ('SAVE10','percentage',10,true) ON CONFLICT DO NOTHING`);
    await client.query(`INSERT INTO promo_codes (code, discount_type, discount_value, is_active) VALUES ('FLAT100','fixed',100,true) ON CONFLICT DO NOTHING`);
    await client.query('COMMIT');
    console.log('Seeded ✅');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
  } finally {
    client.release();
    process.exit(0);
  }
}

seed();