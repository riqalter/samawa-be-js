import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import pool from '../db/index.js';

async function seed() {
  try {
    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS wedding_places (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL NOT NULL,
        image VARCHAR(255),
        location VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS organizers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        wedding_place_id INTEGER REFERENCES wedding_places(id),
        organizer_id INTEGER REFERENCES organizers(id),
        booking_state VARCHAR(50)
      );
    `);

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING',
      ['testuser', hashedPassword]
    );

    // Create wedding places
    for (let i = 0; i < 5; i++) {
      await pool.query(
        'INSERT INTO wedding_places (name, description, price, image, location) VALUES ($1, $2, $3, $4, $5)',
        [
          faker.company.name() + ' Wedding Venue',
          faker.lorem.paragraph(),
          faker.number.int({ min: 1000, max: 10000 }),
          faker.image.url(),
          faker.location.city()
        ]
      );
    }

    // Create organizers
    for (let i = 0; i < 3; i++) {
      await pool.query(
        'INSERT INTO organizers (name, description) VALUES ($1, $2)',
        [
          faker.company.name() + ' Wedding Organizers',
          faker.lorem.paragraph()
        ]
      );
    }

    // Create some bookings for test user
    const user = await pool.query('SELECT id FROM users WHERE username = $1', ['testuser']);
    const places = await pool.query('SELECT id FROM wedding_places');
    const organizers = await pool.query('SELECT id FROM organizers');

    for (let i = 0; i < 3; i++) {
      await pool.query(
        'INSERT INTO bookings (user_id, wedding_place_id, organizer_id, booking_state) VALUES ($1, $2, $3, $4)',
        [
          user.rows[0].id,
          places.rows[i].id,
          organizers.rows[Math.floor(Math.random() * organizers.rows.length)].id,
          faker.helpers.arrayElement(['pending', 'confirmed', 'completed'])
        ]
      );
    }

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();