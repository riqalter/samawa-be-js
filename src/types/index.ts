export interface WeddingPlace {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  location: string;
}

export interface Organizer {
  id: number;
  name: string;
  description: string;
}

export interface Booking {
  id: number;
  userId: number;
  weddingPlaceId: number;
  organizerId: number;
  bookingState: string;
  weddingPlace: {
    name: string;
    price: number;
  };
  organizer: {
    name: string;
  };
}