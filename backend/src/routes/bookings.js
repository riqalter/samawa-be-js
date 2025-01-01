import express from 'express';
import pool from '../db/index.js';

const router = express.Router();

// Get all bookings for a user
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.*, 
             wp.name as wedding_place_name, 
             wp.price as wedding_place_price,
             o.name as organizer_name
      FROM bookings b
      JOIN wedding_places wp ON b.wedding_place_id = wp.id
      JOIN organizers o ON b.organizer_id = o.id
      WHERE b.user_id = $1
    `, [req.user.id]);
    
    const bookings = result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      weddingPlaceId: row.wedding_place_id,
      organizerId: row.organizer_id,
      bookingState: row.booking_state,
      weddingPlace: {
        name: row.wedding_place_name,
        price: row.wedding_place_price
      },
      organizer: {
        name: row.organizer_name
      }
    }));
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new booking
router.post('/', async (req, res) => {
  const { weddingPlaceId, organizerId } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO bookings (user_id, wedding_place_id, organizer_id, booking_state) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, weddingPlaceId, organizerId, 'pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;