import { useState, useEffect } from "react";
import { useSearch, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Settings,
  Store,
  PlusCircle,
  Edit,
  Trash2,
  Clock,
  DollarSign,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function SalonDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Fetch salons owned by user
  const { data: mySalons, isLoading: isLoadingSalons } = useQuery({
    queryKey: ["/api/salon/owner"],
    enabled: !!user && user.isSalonOwner,
  });

  // Fetch salon bookings
  const { data: salonBookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ["/api/salon/bookings"],
    enabled: !!user && user.isSalonOwner,
  });

  // Update booking status mutation
  const updateBookingStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PUT", `/api/bookings/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/salon/bookings"] });
      toast({
        title: "Booking updated",
        description: "The booking status has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating booking",
        description: error.message || "There was an error updating the booking",
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

  // Get pending, confirmed, and past bookings
  const pendingBookings = salonBookings?.filter(
    (booking) => booking.status === "pending" && new Date(booking.date) >= new Date()
  );
  
  const confirmedBookings = salonBookings?.filter(
    (booking) => booking.status === "confirmed" && new Date(booking.date) >= new Date()
  );
  
  const pastBookings = salonBookings?.filter(
    (booking) => new Date(booking.date) < new Date() || booking.status === "cancelled" || booking.status === "completed"
  );

  const handleUpdateStatus = (id: number, status: string) => {
    updateBookingStatus.mutate({ id, status });
  };

  if (!user || !user.isSalonOwner) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-2xl font-bold mb-2">Owner Access Required</h1>
        <p className="text-muted-foreground mb-6">You need to be registered as a salon owner to access this page</p>
        <Button asChild className="mr-2">
          <Link href="/auth?action=become-partner">Become a Partner</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Return to Home</Link>
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
              <div className="flex justify-between items-center">
                <CardTitle>Salon Dashboard</CardTitle>
                <Badge variant="outline">Owner</Badge>
              </div>
              <CardDescription>Manage your salon business</CardDescription>
            </CardHeader>
            <CardContent>
              <nav className="flex flex-col space-y-1">
                <Button
                  variant={activeTab === "overview" ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("overview")}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Overview
                </Button>
                <Button
                  variant={activeTab === "bookings" ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("bookings")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Bookings
                </Button>
                <Button
                  variant={activeTab === "services" ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("services")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Services
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

              <Separator className="my-4" />
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard">Switch to User Dashboard</Link>
              </Button>
            </CardContent>
          </Card>

          {!isLoadingSalons && (!mySalons || mySalons.length === 0) && (
            <Card className="mt-4 bg-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-base">
                  <Info className="h-4 w-4 inline mr-2" />
                  Get Started
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  You haven't set up your salon profile yet. Create your salon to start accepting bookings.
                </p>
                <Button className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Salon Profile
                </Button>
              </CardContent>
            </Card>
          )}
        </aside>

        {/* Main Content */}
        <main className="md:w-3/4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="hidden">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Pending Bookings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isLoadingBookings ? (
                        <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                      ) : (
                        pendingBookings?.length || 0
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Today's Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isLoadingBookings ? (
                        <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                      ) : (
                        salonBookings?.filter(
                          (booking) => 
                            format(new Date(booking.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && 
                            booking.status !== "cancelled"
                        ).length || 0
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isLoadingSalons ? (
                        <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                      ) : (
                        mySalons?.reduce((count, salon) => count + (salon.serviceCount || 0), 0) || 0
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {isLoadingSalons ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-64 bg-muted rounded-lg"></div>
                </div>
              ) : mySalons && mySalons.length > 0 ? (
                <div className="space-y-6">
                  {mySalons.map((salon) => (
                    <Card key={salon.id}>
                      <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <CardTitle>{salon.name}</CardTitle>
                          <div className="flex items-center mt-2 md:mt-0">
                            <Badge variant="outline" className="mr-2">
                              <Store className="h-3 w-3 mr-1" />
                              {salon.featured ? "Featured" : "Standard"}
                            </Badge>
                            <div className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-4 h-4 text-yellow-400 mr-1"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-sm">{salon.rating.toFixed(1)}</span>
                              <span className="text-sm text-muted-foreground ml-1">
                                ({salon.reviewCount})
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="rounded-lg overflow-hidden h-48">
                            <img
                              src={salon.images[0]}
                              alt={salon.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-2">
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                              <p>{salon.address}, {salon.location}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Contact</h3>
                              <p>{salon.phone} • {salon.email}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Services</h3>
                              <div className="flex flex-wrap gap-1">
                                {salon.categories.map((category, index) => (
                                  <Badge key={index} variant="outline" className="bg-muted">
                                    {category}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/salons/${salon.id}`}>View Public Page</Link>
                        </Button>
                        <Button size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit Salon
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Welcome to SalonBook for Business</CardTitle>
                    <CardDescription>
                      Start managing your salon on Morocco's premier booking platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6">
                      <Store className="h-16 w-16 mx-auto text-primary mb-4" />
                      <h3 className="text-lg font-medium mb-2">Create Your Salon Profile</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Set up your salon profile to showcase your services and start accepting bookings from customers across Morocco.
                      </p>
                      <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Salon
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Bookings</CardTitle>
                  <CardDescription>
                    View and manage customer appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingBookings ? (
                    <div className="space-y-4 animate-pulse">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="h-24 bg-muted rounded-lg"></div>
                      ))}
                    </div>
                  ) : salonBookings && salonBookings.length > 0 ? (
                    <Tabs defaultValue="pending" className="w-full">
                      <TabsList className="w-full grid grid-cols-3 mb-4">
                        <TabsTrigger value="pending">
                          Pending ({pendingBookings?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="confirmed">
                          Confirmed ({confirmedBookings?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="past">
                          Past/Cancelled ({pastBookings?.length || 0})
                        </TabsTrigger>
                      </TabsList>

                      {/* Pending Bookings */}
                      <TabsContent value="pending">
                        {pendingBookings && pendingBookings.length > 0 ? (
                          <div className="space-y-4">
                            {pendingBookings.map((booking) => (
                              <Card key={booking.id} className="overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                  <div className="bg-yellow-50 p-4 md:w-1/4 flex flex-col justify-center items-center text-center">
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
                                      <Badge className="w-fit mt-2 md:mt-0 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                        Pending
                                      </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                                      <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        <span>{booking.service?.duration} min</span>
                                      </div>
                                      <div className="flex items-center">
                                        <DollarSign className="h-4 w-4 mr-1" />
                                        <span>{booking.totalPrice} MAD</span>
                                      </div>
                                      <div className="flex items-center">
                                        <User className="h-4 w-4 mr-1" />
                                        <span>{booking.user?.name || "Customer"}</span>
                                      </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 justify-end">
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => handleUpdateStatus(booking.id, "confirmed")}
                                        disabled={updateBookingStatus.isPending}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Confirm
                                      </Button>
                                      <Button 
                                        variant="destructive" 
                                        size="sm"
                                        onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                                        disabled={updateBookingStatus.isPending}
                                      >
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Decline
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-muted/50 rounded-lg">
                            <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                            <h3 className="text-lg font-medium mb-1">No pending bookings</h3>
                            <p className="text-muted-foreground">
                              You're all caught up! There are no pending bookings to review.
                            </p>
                          </div>
                        )}
                      </TabsContent>

                      {/* Confirmed Bookings */}
                      <TabsContent value="confirmed">
                        {confirmedBookings && confirmedBookings.length > 0 ? (
                          <div className="space-y-4">
                            {confirmedBookings.map((booking) => (
                              <Card key={booking.id} className="overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                  <div className="bg-green-50 p-4 md:w-1/4 flex flex-col justify-center items-center text-center">
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
                                      <Badge className="w-fit mt-2 md:mt-0 bg-green-100 text-green-800 hover:bg-green-100">
                                        Confirmed
                                      </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                                      <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        <span>{booking.service?.duration} min</span>
                                      </div>
                                      <div className="flex items-center">
                                        <DollarSign className="h-4 w-4 mr-1" />
                                        <span>{booking.totalPrice} MAD</span>
                                      </div>
                                      <div className="flex items-center">
                                        <User className="h-4 w-4 mr-1" />
                                        <span>{booking.user?.name || "Customer"}</span>
                                      </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 justify-end">
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => handleUpdateStatus(booking.id, "completed")}
                                        disabled={updateBookingStatus.isPending}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Mark as Completed
                                      </Button>
                                      <Button 
                                        variant="destructive" 
                                        size="sm"
                                        onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                                        disabled={updateBookingStatus.isPending}
                                      >
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-muted/50 rounded-lg">
                            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                            <h3 className="text-lg font-medium mb-1">No confirmed bookings</h3>
                            <p className="text-muted-foreground">
                              You have no upcoming confirmed bookings at this time.
                            </p>
                          </div>
                        )}
                      </TabsContent>

                      {/* Past Bookings */}
                      <TabsContent value="past">
                        {pastBookings && pastBookings.length > 0 ? (
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
                                        className={`w-fit mt-2 md:mt-0 ${
                                          booking.status === "completed" 
                                            ? "bg-green-100 text-green-800" 
                                            : booking.status === "cancelled" 
                                            ? "bg-red-100 text-red-800" 
                                            : "bg-muted"
                                        }`}
                                      >
                                        {booking.status === "completed" ? "Completed" : 
                                         booking.status === "cancelled" ? "Cancelled" : "Past"}
                                      </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                      <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        <span>{booking.service?.duration} min</span>
                                      </div>
                                      <div className="flex items-center">
                                        <DollarSign className="h-4 w-4 mr-1" />
                                        <span>{booking.totalPrice} MAD</span>
                                      </div>
                                      <div className="flex items-center">
                                        <User className="h-4 w-4 mr-1" />
                                        <span>{booking.user?.name || "Customer"}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-muted/50 rounded-lg">
                            <CalendarCheck className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                            <h3 className="text-lg font-medium mb-1">No past bookings</h3>
                            <p className="text-muted-foreground">
                              You don't have any past or cancelled bookings yet.
                            </p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="text-center py-12 bg-muted/50 rounded-lg">
                      <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium mb-1">No bookings found</h3>
                      <p className="text-muted-foreground mb-4">
                        You haven't received any bookings yet
                      </p>
                      {mySalons && mySalons.length > 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Make sure your salon profile is complete with attractive photos and service descriptions.
                        </p>
                      ) : (
                        <Button asChild>
                          <Link href="?tab=overview">Create Your Salon</Link>
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div>
                    <CardTitle>Manage Services</CardTitle>
                    <CardDescription>
                      Add, edit or remove services for your salon
                    </CardDescription>
                  </div>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add New Service
                  </Button>
                </CardHeader>
                <CardContent>
                  {mySalons && mySalons.length > 0 ? (
                    <div className="space-y-6">
                      {mySalons.map((salon) => (
                        <div key={salon.id}>
                          <h3 className="text-lg font-semibold mb-4">{salon.name}</h3>
                          {salon.services && salon.services.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {salon.services.map((service) => (
                                <Card key={service.id}>
                                  <CardHeader className="p-4 pb-2">
                                    <CardTitle className="text-base">{service.name}</CardTitle>
                                    <CardDescription className="text-xs">
                                      {service.category}
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent className="p-4 pt-0">
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {service.description}
                                    </p>
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <p className="font-semibold">
                                          {service.discountedPrice ? (
                                            <>
                                              <span className="line-through text-muted-foreground text-sm mr-1">
                                                {service.price} MAD
                                              </span>
                                              {service.discountedPrice} MAD
                                            </>
                                          ) : (
                                            <>{service.price} MAD</>
                                          )}
                                        </p>
                                        <div className="flex items-center text-xs text-muted-foreground">
                                          <Clock className="h-3 w-3 mr-1" />
                                          <span>{service.duration} min</span>
                                        </div>
                                      </div>
                                      {service.isPopular && (
                                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                                          Popular
                                        </Badge>
                                      )}
                                    </div>
                                  </CardContent>
                                  <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                                    <Button variant="ghost" size="sm">
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </Button>
                                  </CardFooter>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 bg-muted/50 rounded-lg mb-6">
                              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                              <h3 className="text-lg font-medium mb-1">No services yet</h3>
                              <p className="text-muted-foreground mb-4">
                                Add services to start accepting bookings
                              </p>
                              <Button>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add Service
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-muted/50 rounded-lg">
                      <Store className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium mb-1">No salon created yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Create a salon profile before adding services
                      </p>
                      <Button asChild>
                        <Link href="?tab=overview">Create Salon Profile</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Salon Settings</CardTitle>
                  <CardDescription>
                    Configure your salon's appearance and operational details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {mySalons && mySalons.length > 0 ? (
                    <div className="space-y-6">
                      {/* Salon Selector */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                          Select Salon to Configure
                        </label>
                        <Select defaultValue={mySalons[0].id.toString()}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a salon" />
                          </SelectTrigger>
                          <SelectContent>
                            {mySalons.map((salon) => (
                              <SelectItem key={salon.id} value={salon.id.toString()}>
                                {salon.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      {/* Setting Categories */}
                      <div>
                        <h3 className="text-lg font-medium mb-3">Business Information</h3>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Salon Profile
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Update Opening Hours
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Manage Staff
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium mb-3">Booking Settings</h3>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start">
                            <Edit className="h-4 w-4 mr-2" />
                            Update Booking Rules
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Manage Availability
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Set Special Dates
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium mb-3">Appearance</h3>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start">
                            <Edit className="h-4 w-4 mr-2" />
                            Manage Photos
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Update Description
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium mb-3">Marketing</h3>
                        <div className="space-y-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="w-full justify-start">
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Request Featured Status
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Get Featured on SalonBook</DialogTitle>
                                <DialogDescription>
                                  Featured salons appear in prominent spots across our platform and receive up to 5x more bookings.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-medium">Enhanced Visibility</h4>
                                    <p className="text-sm text-muted-foreground">
                                      Appear at the top of search results
                                    </p>
                                  </div>
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                </div>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-medium">Homepage Placement</h4>
                                    <p className="text-sm text-muted-foreground">
                                      Featured in the homepage carousel
                                    </p>
                                  </div>
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                </div>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-medium">Featured Badge</h4>
                                    <p className="text-sm text-muted-foreground">
                                      Special badge that builds trust
                                    </p>
                                  </div>
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                </div>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-medium">Priority Support</h4>
                                    <p className="text-sm text-muted-foreground">
                                      Get help faster when you need it
                                    </p>
                                  </div>
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline">Contact Sales</Button>
                                <Button>Request Featured Status</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" className="w-full justify-start">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Create Special Offers
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-muted/50 rounded-lg">
                      <Settings className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium mb-1">No salon to configure</h3>
                      <p className="text-muted-foreground mb-4">
                        Create a salon profile to access settings
                      </p>
                      <Button asChild>
                        <Link href="?tab=overview">Create Salon Profile</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
