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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchBookings(savedToken);
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

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    setBookings([]);
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
              <p className="text-center text-gray-500">Wedding places will be implemented in the next iteration.</p>
            </TabsContent>
            
            <TabsContent value="organizers">
              <p className="text-center text-gray-500">Organizers will be implemented in the next iteration.</p>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Index;