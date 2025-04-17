import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  Heart,
  Share2,
  MapPin,
  Star,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import ServiceCard from "@/components/salon/service-card";
import ReviewCard from "@/components/salon/review-card";
import CategoryPill from "@/components/salon/category-pill";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function SalonProfilePage() {
  const { id } = useParams<{ id: string }>();
  const salonId = parseInt(id);
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>("All Services");
  const [showAllPhotos, setShowAllPhotos] = useState<boolean>(false);

  // Fetch salon data
  const { data: salon, isLoading: isLoadingSalon } = useQuery({
    queryKey: [`/api/salons/${salonId}`],
    enabled: !!salonId,
  });

  // Fetch salon services
  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: [`/api/salons/${salonId}/services`],
    enabled: !!salonId,
  });

  // Fetch salon reviews
  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: [`/api/salons/${salonId}/reviews`],
    enabled: !!salonId,
  });

  // Check if salon is favorited
  const { data: favoriteData } = useQuery({
    queryKey: [`/api/favorites/check/${salonId}`],
    enabled: !!user && !!salonId,
  });

  const isFavorite = favoriteData?.isFavorite || false;

  // Add to favorites mutation
  const addToFavorites = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/favorites", { salonId });
    },
    onSuccess: () => {
      toast({
        title: "Added to favorites",
        description: `${salon?.name} has been added to your favorites`,
      });
    },
  });

  // Remove from favorites mutation
  const removeFromFavorites = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/favorites/${salonId}`);
    },
    onSuccess: () => {
      toast({
        title: "Removed from favorites",
        description: `${salon?.name} has been removed from your favorites`,
      });
    },
  });

  const toggleFavorite = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add salons to your favorites",
        variant: "destructive",
      });
      return;
    }

    if (isFavorite) {
      removeFromFavorites.mutate();
    } else {
      addToFavorites.mutate();
    }
  };

  // Filter services by category
  const filteredServices = services?.filter(
    (service) =>
      activeCategory === "All Services" || service.category === activeCategory
  );

  // Get unique categories
  const categories = services
    ? ["All Services", ...new Set(services.map((service) => service.category))]
    : ["All Services"];

  if (isLoadingSalon) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-64 bg-muted rounded-lg mb-6"></div>
          <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
          <div className="flex gap-2 mb-6">
            <div className="h-6 w-20 bg-muted rounded-full"></div>
            <div className="h-6 w-20 bg-muted rounded-full"></div>
            <div className="h-6 w-20 bg-muted rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold">Salon not found</h2>
        <p className="mb-4">The salon you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-muted/30">
      <div className="mb-8">
        <Link href="/" className="flex items-center text-foreground hover:text-primary mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          <span>Back to search results</span>
        </Link>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6">
          <div className="md:col-span-2 md:row-span-2 h-64 md:h-auto">
            <img
              src={salon.images[0]}
              alt={salon.name}
              className="w-full h-full object-cover rounded-tl-lg rounded-bl-lg md:rounded-bl-none"
            />
          </div>
          <div className="hidden md:block h-48">
            <img
              src={salon.images.length > 1 ? salon.images[1] : salon.images[0]}
              alt={salon.name}
              className="w-full h-full object-cover rounded-tr-lg"
            />
          </div>
          <div className="hidden md:block h-48">
            <img
              src={salon.images.length > 2 ? salon.images[2] : salon.images[0]}
              alt={salon.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden md:block h-48">
            <img
              src={salon.images.length > 3 ? salon.images[3] : salon.images[0]}
              alt={salon.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden md:block h-48 relative">
            <img
              src={salon.images.length > 4 ? salon.images[4] : salon.images[0]}
              alt={salon.name}
              className="w-full h-full object-cover rounded-br-lg"
            />
            {salon.images.length > 5 && (
              <button
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-medium rounded-br-lg"
                onClick={() => setShowAllPhotos(true)}
              >
                <span>+{salon.images.length - 5} more photos</span>
              </button>
            )}
          </div>
        </div>

        {/* Header and Actions */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{salon.name}</h1>
            <div className="flex items-center mb-2">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="font-medium mr-1">{salon.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({salon.reviewCount} reviews)</span>
              <span className="mx-2">•</span>
              <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
              <span>{salon.location}, Morocco</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {salon.categories.map((category, index) => (
                <Badge key={index} variant="outline" className="bg-muted text-sm">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              className="flex items-center"
              onClick={toggleFavorite}
            >
              <Heart
                className={`mr-2 h-4 w-4 ${
                  isFavorite ? "fill-primary text-primary" : ""
                }`}
              />
              <span>{isFavorite ? "Saved" : "Save"}</span>
            </Button>
            <Button variant="outline" className="flex items-center">
              <Share2 className="mr-2 h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs and Main Content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="md:w-2/3">
          <Tabs defaultValue="services">
            <TabsList className="border-b w-full justify-start rounded-none bg-transparent mb-6">
              <TabsTrigger
                value="services"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Services
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                About
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="location"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Location
              </TabsTrigger>
            </TabsList>

            {/* Services Tab */}
            <TabsContent value="services" className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Our Services</h2>

              {/* Categories */}
              <div className="flex overflow-x-auto pb-2 mb-6 gap-3 no-scrollbar">
                {categories.map((category, index) => (
                  <CategoryPill
                    key={index}
                    category={category}
                    isActive={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                  />
                ))}
              </div>

              {/* Services List */}
              {isLoadingServices ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-card transition-all animate-pulse">
                      <div className="h-32 bg-muted rounded-lg mb-4"></div>
                      <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-2/3 mb-3"></div>
                      <div className="h-8 bg-muted rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredServices && filteredServices.length > 0 ? (
                    filteredServices.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        salonId={salon.id}
                      />
                    ))
                  ) : (
                    <p className="text-center py-6 text-muted-foreground">
                      No services found in this category.
                    </p>
                  )}
                </div>
              )}
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about">
              <h2 className="text-2xl font-bold mb-4">About {salon.name}</h2>
              <p className="mb-6 text-muted-foreground">{salon.description}</p>

              <h3 className="text-xl font-semibold mb-3">Contact Information</h3>
              <div className="space-y-2 mb-6">
                <p><span className="font-medium">Address:</span> {salon.address}</p>
                <p><span className="font-medium">Phone:</span> {salon.phone}</p>
                <p><span className="font-medium">Email:</span> {salon.email}</p>
              </div>

              <h3 className="text-xl font-semibold mb-3">Business Hours</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Monday - Friday:</span> 9:00 AM - 7:00 PM</p>
                <p><span className="font-medium">Saturday:</span> 10:00 AM - 6:00 PM</p>
                <p><span className="font-medium">Sunday:</span> Closed</p>
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Customer Reviews</h2>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="font-medium mr-1">{salon.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({salon.reviewCount} reviews)</span>
                </div>
              </div>

              {isLoadingReviews ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
                      <div className="flex items-start mb-4">
                        <div className="w-12 h-12 rounded-full bg-muted mr-4"></div>
                        <div>
                          <div className="h-4 bg-muted rounded w-24 mb-1"></div>
                          <div className="h-3 bg-muted rounded w-16"></div>
                        </div>
                      </div>
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews && reviews.length > 0 ? (
                    <>
                      {reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                      {reviews.length > 2 && (
                        <Button variant="outline" className="w-full py-3">
                          Read all {salon.reviewCount} reviews
                        </Button>
                      )}
                    </>
                  ) : (
                    <p className="text-center py-6 text-muted-foreground">
                      No reviews yet. Be the first to review this salon!
                    </p>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Location Tab */}
            <TabsContent value="location">
              <h2 className="text-2xl font-bold mb-4">Location</h2>
              <p className="mb-6">
                <MapPin className="inline-block h-4 w-4 mr-1" />
                {salon.address}, {salon.location}, Morocco
              </p>
              <div className="bg-muted h-96 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Map view is not available in this demo.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Booking Section */}
        <div className="md:w-1/3" id="booking">
          <div className="bg-white rounded-xl p-6 shadow-card sticky top-24">
            <h2 className="text-xl font-bold mb-4">Book an Appointment</h2>
            <p className="mb-4">
              Select a service from our menu and book your appointment today.
            </p>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Price Range</h3>
              <p className="text-lg font-semibold">
                {salon.priceRange.min} - {salon.priceRange.max} MAD
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Cancellation Policy</h3>
              <p className="text-sm text-muted-foreground">
                Free cancellation up to 24 hours before your appointment.
              </p>
            </div>
            
            <Button 
              className="w-full"
              asChild
            >
              <Link href="#services">
                View Services & Book
              </Link>
            </Button>
            
            <p className="text-center text-muted-foreground text-sm mt-4">
              No payment required until your appointment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
