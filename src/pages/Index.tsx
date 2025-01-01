import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from 'axios';
import LoginForm from '@/components/LoginForm';
import BookingList from '@/components/BookingList';
import Receipt from '@/components/Receipt';
import { Button } from "@/components/ui/button";
import { WeddingPlace, Organizer, Booking } from '@/types';

const API_URL = 'http://localhost:3000';

const Index = () => {
  const { toast } = useToast();
  const [token, setToken] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [weddingPlaces, setWeddingPlaces] = useState<WeddingPlace[]>([]);
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<number | null>(null);
  const [selectedOrganizer, setSelectedOrganizer] = useState<number | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchBookings(savedToken);
      fetchWeddingPlaces(savedToken);
      fetchOrganizers(savedToken);
    }
  }, []);

  const fetchBookings = async (currentToken: string) => {
    try {
      const response = await axios.get<Booking[]>(`${API_URL}/bookings`, {
        headers: {
          Authorization: `Bearer ${currentToken}`
        }
      });
      setBookings(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings.",
        variant: "destructive",
      });
    }
  };

  const fetchWeddingPlaces = async (currentToken: string) => {
    try {
      const response = await axios.get<WeddingPlace[]>(`${API_URL}/wedding-places`, {
        headers: {
          Authorization: `Bearer ${currentToken}`
        }
      });
      setWeddingPlaces(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch wedding places.",
        variant: "destructive",
      });
    }
  };

  const fetchOrganizers = async (currentToken: string) => {
    try {
      const response = await axios.get<Organizer[]>(`${API_URL}/organizers`, {
        headers: {
          Authorization: `Bearer ${currentToken}`
        }
      });
      setOrganizers(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch organizers.",
        variant: "destructive",
      });
    }
  };

  const handleBooking = async () => {
    if (!selectedPlace || !selectedOrganizer) {
      toast({
        title: "Error",
        description: "Please select both a wedding place and an organizer.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/bookings`,
        {
          weddingPlaceId: selectedPlace,
          organizerId: selectedOrganizer
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast({
        title: "Success",
        description: "Booking created successfully!",
      });

      fetchBookings(token);
      setSelectedPlace(null);
      setSelectedOrganizer(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create booking.",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = async (booking: Booking) => {
    try {
      await axios.post(
        `${API_URL}/bookings/${booking.id}/checkout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast({
        title: "Success",
        description: "Checkout successful!",
      });

      setSelectedBooking(booking);
      setShowReceipt(true);
      fetchBookings(token);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to checkout.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    setBookings([]);
    setWeddingPlaces([]);
    setOrganizers([]);
    setSelectedPlace(null);
    setSelectedOrganizer(null);
  };

  if (!token) {
    return <LoginForm onLogin={setToken} />;
  }

  if (showReceipt && selectedBooking) {
    return (
      <Receipt
        booking={selectedBooking}
        onClose={() => {
          setShowReceipt(false);
          setSelectedBooking(null);
        }}
      />
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Welcome back!</h2>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>
      
      <Tabs defaultValue="bookings">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="places">Wedding Places</TabsTrigger>
          <TabsTrigger value="organizers">Organizers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings">
          <BookingList bookings={bookings} onCheckout={handleCheckout} />
        </TabsContent>
        
        <TabsContent value="places">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {weddingPlaces.map((place) => (
              <Card key={place.id} className={`cursor-pointer transition-all ${selectedPlace === place.id ? 'ring-2 ring-primary' : ''}`}
                   onClick={() => setSelectedPlace(place.id)}>
                <CardHeader>
                  <CardTitle>{place.name}</CardTitle>
                  <CardDescription>{place.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <img src={place.image} alt={place.name} className="w-full h-48 object-cover rounded-md mb-4" />
                  <p className="text-sm text-gray-500 mb-2">{place.description}</p>
                  <p className="font-semibold">Price: ${place.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="organizers">
          <div className="grid gap-4 md:grid-cols-2">
            {organizers.map((organizer) => (
              <Card key={organizer.id} className={`cursor-pointer transition-all ${selectedOrganizer === organizer.id ? 'ring-2 ring-primary' : ''}`}
                   onClick={() => setSelectedOrganizer(organizer.id)}>
                <CardHeader>
                  <CardTitle>{organizer.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">{organizer.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {(selectedPlace || selectedOrganizer) && (
        <div className="fixed bottom-4 left-0 right-0 p-4 bg-background border-t">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                {selectedPlace ? `Selected Place: ${weddingPlaces.find(p => p.id === selectedPlace)?.name}` : ''}
              </p>
              <p className="text-sm text-gray-500">
                {selectedOrganizer ? `Selected Organizer: ${organizers.find(o => o.id === selectedOrganizer)?.name}` : ''}
              </p>
            </div>
            <Button onClick={handleBooking} disabled={!selectedPlace || !selectedOrganizer}>
              Book Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
