import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from 'axios';

const API_URL = 'http://localhost:3000';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
  };
}

interface WeddingPlace {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  location: string;
}

interface Organizer {
  id: number;
  name: string;
  description: string;
}

interface Booking {
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

const Index = () => {
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [weddingPlaces, setWeddingPlaces] = useState<WeddingPlace[]>([]);
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<number | null>(null);
  const [selectedOrganizer, setSelectedOrganizer] = useState<number | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchBookings(savedToken);
      fetchWeddingPlaces(savedToken);
      fetchOrganizers(savedToken);
    }
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, {
        username,
        password
      });
      
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      
      fetchBookings(response.data.token);
      fetchWeddingPlaces(response.data.token);
      fetchOrganizers(response.data.token);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to login. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
      await axios.post(
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

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    setBookings([]);
    setWeddingPlaces([]);
    setOrganizers([]);
    setSelectedPlace(null);
    setSelectedOrganizer(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Wedding Organizer API Tester</h1>
      
      {!token ? (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to test the API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
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
                    </CardContent>
                  </Card>
                ))}
                {bookings.length === 0 && (
                  <p className="text-center text-gray-500">No bookings found.</p>
                )}
              </div>
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
      )}
    </div>
  );
};

export default Index;