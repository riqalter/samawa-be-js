import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Booking } from '@/types';

interface BookingListProps {
  bookings: Booking[];
  onCheckout: (booking: Booking) => void;
}

const BookingList = ({ bookings, onCheckout }: BookingListProps) => {
  return (
    <div className="grid gap-4">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardHeader>
            <CardTitle>{booking.weddingPlace.name}</CardTitle>
            <CardDescription>Organized by: {booking.organizer.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Status: <span className="font-semibold">{booking.bookingState}</span>
            </p>
            <p className="text-sm text-gray-500">
              Price: <span className="font-semibold">${booking.weddingPlace.price}</span>
            </p>
            {booking.bookingState === 'pending' && (
              <Button 
                className="mt-4"
                onClick={() => onCheckout(booking)}
              >
                Proceed to Checkout
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
      {bookings.length === 0 && (
        <p className="text-center text-gray-500">No bookings found.</p>
      )}
    </div>
  );
};

export default BookingList;