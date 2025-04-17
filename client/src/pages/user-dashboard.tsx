import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  CalendarCheck, 
  Heart, 
  User, 
  Settings, 
  Clock, 
  MapPin, 
  AlertCircle, 
  CheckCircle, 
  X 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import SalonCard from "@/components/salon/salon-card";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function UserDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const initialTab = searchParams.get("tab") || "bookings";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Fetch user bookings
  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ["/api/user/bookings"],
    enabled: !!user,
  });

  // Fetch user favorites
  const { data: favorites, isLoading: isLoadingFavorites } = useQuery({
    queryKey: ["/api/user/favorites"],
    enabled: !!user && activeTab === "favorites",
  });

  // Cancel booking mutation
  const cancelBooking = useMutation({
    mutationFn: async (bookingId: number) => {
      await apiRequest("PUT", `/api/bookings/${bookingId}/status`, { status: "cancelled" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/bookings"] });
      toast({
        title: "Booking cancelled",
        description: "Your booking has been successfully cancelled",
      });
    },
    onError: (error) => {
      toast({
        title: "Error cancelling booking",
        description: error.message || "There was an error cancelling your booking",
        variant: "destructive",
      });
    },
  });

  // Update URL when tab changes
  useEffect(() => {
    const newParams = new URLSearchParams(search);
    newParams.set("tab", activeTab);
    window.history.replaceState({}, "", `?${newParams.toString()}`);
  }, [activeTab, search]);

  // Get upcoming and past bookings
  const upcomingBookings = bookings?.filter(
    (booking) => new Date(booking.date) >= new Date() && booking.status !== "cancelled"
  );
  
  const pastBookings = bookings?.filter(
    (booking) => new Date(booking.date) < new Date() || booking.status === "cancelled"
  );

  const handleCancelBooking = (bookingId: number) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      cancelBooking.mutate(bookingId);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
        <p className="text-muted-foreground mb-6">Please log in to view your dashboard</p>
        <Button asChild>
          <a href="/auth">Log In or Sign Up</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-muted/30">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-1/4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${user.id}`} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <nav className="flex flex-col space-y-1">
                <Button
                  variant={activeTab === "bookings" ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("bookings")}
                >
                  <CalendarCheck className="mr-2 h-4 w-4" />
                  My Bookings
                </Button>
                <Button
                  variant={activeTab === "favorites" ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("favorites")}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Favorites
                </Button>
                <Button
                  variant={activeTab === "profile" ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant={activeTab === "settings" ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </nav>

              {user.isSalonOwner && (
                <>
                  <Separator className="my-4" />
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/salon-dashboard">Switch to Salon Dashboard</a>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="md:w-3/4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="hidden">
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>My Bookings</CardTitle>
                  <CardDescription>
                    Manage your upcoming and past appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingBookings ? (
                    <div className="space-y-4 animate-pulse">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="h-24 bg-muted rounded-lg"></div>
                      ))}
                    </div>
                  ) : bookings && bookings.length > 0 ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Upcoming Appointments</h3>
                        {upcomingBookings && upcomingBookings.length > 0 ? (
                          <div className="space-y-4">
                            {upcomingBookings.map((booking) => (
                              <Card key={booking.id} className="overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                  <div className="bg-primary/10 p-4 md:w-1/4 flex flex-col justify-center items-center text-center">
                                    <p className="text-lg font-bold mb-1">
                                      {format(new Date(booking.date), "EEE, MMM d")}
                                    </p>
                                    <p className="text-muted-foreground">
                                      {format(new Date(booking.date), "h:mm a")}
                                    </p>
                                  </div>
                                  <div className="p-4 md:w-3/4">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                                      <div>
                                        <h4 className="font-semibold">{booking.service?.name}</h4>
                                        <p className="text-muted-foreground text-sm">
                                          {booking.salon?.name}
                                        </p>
                                      </div>
                                      <Badge variant="outline" className="w-fit mt-2 md:mt-0">
                                        {booking.status === "pending" && "Pending"}
                                        {booking.status === "confirmed" && "Confirmed"}
                                        {booking.status === "completed" && "Completed"}
                                        {booking.status === "cancelled" && "Cancelled"}
                                      </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                                      <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        <span>{booking.service?.duration} min</span>
                                      </div>
                                      <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        <span>{booking.salon?.location}</span>
                                      </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 justify-end">
                                      <Button variant="outline" size="sm" asChild>
                                        <a href={`/salons/${booking.salonId}`}>View Salon</a>
                                      </Button>
                                      {booking.status !== "cancelled" && (
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => handleCancelBooking(booking.id)}
                                          disabled={cancelBooking.isPending}
                                        >
                                          Cancel Booking
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-muted/50 rounded-lg">
                            <CalendarCheck className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                            <h3 className="text-lg font-medium mb-1">No upcoming bookings</h3>
                            <p className="text-muted-foreground mb-4">
                              You don't have any upcoming appointments
                            </p>
                            <Button asChild>
                              <a href="/">Browse Salons</a>
                            </Button>
                          </div>
                        )}
                      </div>

                      {pastBookings && pastBookings.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Past Appointments</h3>
                          <div className="space-y-4">
                            {pastBookings.map((booking) => (
                              <Card key={booking.id} className="overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                  <div className="bg-muted p-4 md:w-1/4 flex flex-col justify-center items-center text-center">
                                    <p className="text-lg font-bold mb-1">
                                      {format(new Date(booking.date), "EEE, MMM d")}
                                    </p>
                                    <p className="text-muted-foreground">
                                      {format(new Date(booking.date), "h:mm a")}
                                    </p>
                                  </div>
                                  <div className="p-4 md:w-3/4">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                                      <div>
                                        <h4 className="font-semibold">{booking.service?.name}</h4>
                                        <p className="text-muted-foreground text-sm">
                                          {booking.salon?.name}
                                        </p>
                                      </div>
                                      <Badge
                                        variant={booking.status === "cancelled" ? "destructive" : "outline"}
                                        className="w-fit mt-2 md:mt-0"
                                      >
                                        {booking.status}
                                      </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                      <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        <span>{booking.service?.duration} min</span>
                                      </div>
                                      <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        <span>{booking.salon?.location}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-muted/50 rounded-lg">
                      <CalendarCheck className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium mb-1">No bookings found</h3>
                      <p className="text-muted-foreground mb-4">
                        You haven't made any appointments yet
                      </p>
                      <Button asChild>
                        <a href="/">Browse Salons</a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle>My Favorites</CardTitle>
                  <CardDescription>
                    Salons and spas you've saved for later
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingFavorites ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="h-80 bg-muted rounded-xl animate-pulse"></div>
                      ))}
                    </div>
                  ) : favorites && favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favorites.map((salon) => (
                        <SalonCard key={salon.id} salon={salon} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-muted/50 rounded-lg">
                      <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium mb-1">No favorites yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Save your favorite salons to find them easily later
                      </p>
                      <Button asChild>
                        <a href="/">Browse Salons</a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>My Profile</CardTitle>
                  <CardDescription>
                    Manage your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${user.id}`} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">{user.name}</h3>
                        <p className="text-muted-foreground">
                          {user.isSalonOwner ? "Salon Owner" : "Customer"}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Full Name</h3>
                        <p>{user.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Username</h3>
                        <p>{user.username}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                        <p>{user.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Phone</h3>
                        <p>{user.phone || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button>Edit Profile</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Notifications</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">
                              Receive booking confirmations and reminders
                            </p>
                          </div>
                          <div className="w-11 h-6 bg-primary rounded-full p-1 cursor-pointer">
                            <div className="bg-white w-4 h-4 rounded-full transform translate-x-5"></div>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">SMS Notifications</p>
                            <p className="text-sm text-muted-foreground">
                              Receive text message updates about your bookings
                            </p>
                          </div>
                          <div className="w-11 h-6 bg-muted rounded-full p-1 cursor-pointer">
                            <div className="bg-white w-4 h-4 rounded-full"></div>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Marketing Emails</p>
                            <p className="text-sm text-muted-foreground">
                              Receive offers, promotions, and news
                            </p>
                          </div>
                          <div className="w-11 h-6 bg-muted rounded-full p-1 cursor-pointer">
                            <div className="bg-white w-4 h-4 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-3">Account</h3>
                      <div className="space-y-4">
                        <Button variant="outline" className="w-full justify-start">
                          Change Password
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          Update Email Address
                        </Button>
                        <Button variant="destructive" className="w-full justify-start">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
