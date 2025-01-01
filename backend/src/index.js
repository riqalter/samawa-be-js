import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import weddingPlaceRoutes from './routes/weddingPlaces.js';
import organizerRoutes from './routes/organizers.js';
import { authenticateToken } from './middleware/auth.js';

const app = express();

app.use(cors());
app.use(express.json());

// Public routes
app.use('/auth', authRoutes);

// Protected routes
app.use('/bookings', authenticateToken, bookingRoutes);
app.use('/wedding-places', authenticateToken, weddingPlaceRoutes);
app.use('/organizers', authenticateToken, organizerRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});