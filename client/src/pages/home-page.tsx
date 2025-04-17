import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Scissors, 
  Bath, 
  HandHelping, 
  Paintbrush, 
  Brush, 
  Search, 
  MapPin, 
  Calendar,
  Sparkles,
  CheckCircle 
} from "lucide-react";
import ServiceCategory from "@/components/home/service-category";
import SalonCard from "@/components/salon/salon-card";
import SpecialOffer from "@/components/home/special-offer";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  const [location, setLocation] = useState("Marrakech");
  const [service, setService] = useState("All Services");
  const [date, setDate] = useState("");
  const [_, navigate] = useLocation();

  // Fetch salons
  const { data: featuredSalons, isLoading: isLoadingFeatured } = useQuery({
    queryKey: ["/api/salons", { featured: true }],
  });

  // Fetch top rated salons for Marrakech
  const { data: topRatedSalons, isLoading: isLoadingTopRated } = useQuery({
    queryKey: ["/api/salons", { location: "Marrakech" }],
  });

  // Handle search
  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (location) searchParams.set("location", location);
    if (service && service !== "All Services") searchParams.set("service", service);
    if (date) searchParams.set("date", date);
    
    navigate(`/?${searchParams.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-muted/30">
      {/* Hero Section */}
      <section className="relative mb-12 rounded-xl overflow-hidden shadow-lg">
        <div className="h-[400px] md:h-[500px] bg-muted relative">
          <img
            src="https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=500&q=80"
            alt="Luxury salon in Morocco"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Discover Beauty & Wellness in Morocco</h1>
            <p className="text-lg md:text-xl mb-6">Book appointments at the best salons and spas near you</p>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 bg-white p-3 rounded-lg shadow-lg max-w-3xl">
              <div className="flex-1">
                <label className="text-foreground text-sm font-medium mb-1 block">Location</label>
                <div className="relative">
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="w-full border-0 p-0 pl-6 h-auto">
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Marrakech">Marrakech</SelectItem>
                      <SelectItem value="Casablanca">Casablanca</SelectItem>
                      <SelectItem value="Rabat">Rabat</SelectItem>
                      <SelectItem value="Fes">Fes</SelectItem>
                      <SelectItem value="Tangier">Tangier</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-1">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="w-px h-8 bg-border hidden md:block"></div>
              
              <div className="flex-1">
                <label className="text-foreground text-sm font-medium mb-1 block">Service</label>
                <div className="relative">
                  <Select value={service} onValueChange={setService}>
                    <SelectTrigger className="w-full border-0 p-0 pl-6 h-auto">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Services">All Services</SelectItem>
                      <SelectItem value="Haircut & Styling">Haircut & Styling</SelectItem>
                      <SelectItem value="Facial Treatments">Facial Treatments</SelectItem>
                      <SelectItem value="Massage">Massage</SelectItem>
                      <SelectItem value="Manicure & Pedicure">Manicure & Pedicure</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-1">
                    <Scissors className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="w-px h-8 bg-border hidden md:block"></div>
              
              <div className="flex-1">
                <label className="text-foreground text-sm font-medium mb-1 block">Date</label>
                <div className="relative">
                  <Input
                    type="date"
                    className="w-full border-0 p-0 pl-6 h-auto"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-1">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </div>
              
              <Button 
                className="mt-2 md:mt-0 px-4 py-2 md:px-6 md:py-3 bg-primary text-white"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Browse by Service</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <ServiceCategory icon={Scissors} name="Haircuts" />
          <ServiceCategory icon={Bath} name="Facials" />
          <ServiceCategory icon={HandHelping} name="Massage" />
          <ServiceCategory icon={Paintbrush} name="Nails" />
          <ServiceCategory icon={Brush} name="Makeup" className="hidden md:flex" />
          <ServiceCategory icon={Sparkles} name="Hair Color" className="hidden md:flex" />
        </div>
      </section>

      {/* Featured Salons */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Salons</h2>
          <Button variant="link" className="text-primary hover:underline">
            View all
          </Button>
        </div>
        {isLoadingFeatured ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-80 bg-white rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredSalons?.slice(0, 4).map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        )}
      </section>

      {/* Special Offers */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Special Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SpecialOffer
            title="Ultimate Bath Package"
            description="Get 20% off on our exclusive hammam and massage combo"
            image="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80"
            badge="Limited Time"
            buttonLabel="View Offer"
            buttonUrl="/"
            buttonColor="primary"
          />
          <SpecialOffer
            title="First-Timer Package"
            description="15% discount on your first haircut and styling session"
            image="https://images.unsplash.com/photo-1607779097040-26e80aa78e66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80"
            badge="New Clients"
            buttonLabel="View Offer"
            buttonUrl="/"
            buttonColor="primary"
          />
        </div>
      </section>

      {/* Top Rated in Marrakech */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Top Rated in Marrakech</h2>
          <Button variant="link" className="text-primary hover:underline">
            View all
          </Button>
        </div>
        {isLoadingTopRated ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-80 bg-white rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {topRatedSalons?.slice(0, 4).map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="mb-12 bg-white rounded-xl shadow-card p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">How SalonBook Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Discover</h3>
            <p className="text-muted-foreground">Browse and find the perfect salon or spa based on location, services, and reviews.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Book</h3>
            <p className="text-muted-foreground">Choose your preferred date, time, and service. Confirm your appointment in seconds.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-4">
              <Bath className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Relax</h3>
            <p className="text-muted-foreground">Enjoy your beauty treatment and leave a review to share your experience.</p>
          </div>
        </div>
      </section>

      {/* Download App */}
      <section className="mb-12 bg-primary bg-opacity-5 rounded-xl p-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Download the SalonBook App</h2>
            <p className="text-muted-foreground mb-6">Book appointments, get exclusive offers, and manage your bookings on the go.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="default" className="flex items-center justify-center bg-black text-white rounded-lg px-4 py-3 hover:bg-opacity-80 transition-colors">
                <FaApple className="text-2xl mr-3" />
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-medium">App Store</div>
                </div>
              </Button>
              <Button variant="default" className="flex items-center justify-center bg-black text-white rounded-lg px-4 py-3 hover:bg-opacity-80 transition-colors">
                <FaGooglePlay className="text-2xl mr-3" />
                <div>
                  <div className="text-xs">Get it on</div>
                  <div className="text-sm font-medium">Google Play</div>
                </div>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=600&q=80"
              alt="SalonBook App on a smartphone"
              className="max-w-full h-auto rounded-lg shadow-lg max-h-80"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
