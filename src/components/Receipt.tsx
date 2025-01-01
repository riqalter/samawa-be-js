import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';

interface ReceiptProps {
  booking: {
    weddingPlace: {
      name: string;
      price: number;
    };
    organizer: {
      name: string;
    };
  };
  onClose: () => void;
}

const Receipt = ({ booking, onClose }: ReceiptProps) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Booking Receipt</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-b pb-4">
          <p className="text-sm text-gray-500">Date</p>
          <p className="font-medium">{format(new Date(), 'PPP')}</p>
        </div>
        <div className="border-b pb-4">
          <p className="text-sm text-gray-500">Wedding Place</p>
          <p className="font-medium">{booking.weddingPlace.name}</p>
          <p className="text-sm text-gray-500 mt-2">Price</p>
          <p className="font-medium">${booking.weddingPlace.price}</p>
        </div>
        <div className="border-b pb-4">
          <p className="text-sm text-gray-500">Organizer</p>
          <p className="font-medium">{booking.organizer.name}</p>
        </div>
        <div className="pt-4">
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-xl font-bold">${booking.weddingPlace.price}</p>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-primary text-primary-foreground py-2 rounded-md mt-4"
        >
          Close Receipt
        </button>
      </CardContent>
    </Card>
  );
};

export default Receipt;