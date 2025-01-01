# Wedding Organizer API

## Setup

1. Install PostgreSQL and create a database named `wedding_db`

2. Install dependencies:
```bash
npm install
```

3. Run the seed script to create tables and sample data:
```bash
npm run seed
```

4. Start the server:
```bash
npm run dev
```

## Test Credentials

Username: testuser
Password: password123

## API Endpoints

### Authentication
- POST /auth/login - Login with username and password

### Protected Routes (require JWT token)
- GET /bookings - Get user's bookings
- GET /wedding-places - Get all wedding places
- GET /organizers - Get all organizers

## Project Structure

```
backend/
├── src/
│   ├── db/
│   │   └── index.js         # Database connection
│   ├── middleware/
│   │   └── auth.js          # Authentication middleware
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── bookings.js      # Booking routes
│   │   ├── weddingPlaces.js # Wedding places routes
│   │   └── organizers.js    # Organizer routes
│   ├── seeds/
│   │   └── seed.js          # Database seeding
│   └── index.js             # Main application file
└── package.json
```