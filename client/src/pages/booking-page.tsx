import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import BookingForm from "@/components/booking/booking-form";
import { Separator } from "@/components/ui/separator";

export default function BookingPage() {
  const { salonId, serviceId } = useParams<{ salonId: string; serviceId: string }>();
  const [_, navigate] = useLocation();
  
  // Fetch salon data
  const { data: salon, isLoading: isLoadingSalon, error: salonError } = useQuery({
    queryKey: [`/api/salons/${salonId}`],
    enabled: !!salonId,
  });
  
  // Fetch service data
  const { data: service, isLoading: isLoadingService, error: serviceError } = useQuery({
    queryKey: [`/api/services/${serviceId}`],
    enabled: !!serviceId,
  });
  
  // Fetch all services for the salon (for recommended services)
  const { data: allServices, isLoading: isLoadingAllServices } = useQuery({
    queryKey: [`/api/salons/${salonId}/services`],
    enabled: !!salonId,
  });
  
  // Get recommended services (excluding current service)
  const recommendedServices = allServices?.filter(s => s.id !== parseInt(serviceId)).slice(0, 3);
  
  // Handle errors
  useEffect(() => {
    if (salonError || serviceError) {
      navigate("/");
    }
  }, [salonError, serviceError, navigate]);
  
  if (isLoadingSalon || isLoadingService) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <div className="h-96 bg-muted rounded-lg mb-6"></div>
            </div>
            <div className="md:w-1/3">
              <div className="h-96 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!salon || !service) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold">Service or salon not found</h2>
        <p className="mb-4">The service or salon you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-muted/30">
      <Link href={`/salons/${salonId}`} className="flex items-center text-foreground hover:text-primary mb-6">
        <ChevronLeft className="mr-2 h-4 w-4" />
        <span>Back to {salon.name}</span>
      </Link>
      
      <h1 className="text-3xl font-bold mb-2">Book an Appointment</h1>
      <p className="text-muted-foreground mb-8">Complete your booking for {service.name} at {salon.name}</p>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side - Service details */}
        <div className="md:w-2/3">
          <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-8">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Service Details</h2>
              
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">{service.duration} minutes</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-medium">
                        {service.discountedPrice ? (
                          <>
                            <span className="line-through text-muted-foreground mr-2">{service.price} MAD</span>
                            {service.discountedPrice} MAD
                          </>
                        ) : (
                          <>{service.price} MAD</>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <h4 className="font-medium mb-2">Salon Information</h4>
                    <p className="text-sm mb-1">{salon.name}</p>
                    <p className="text-sm mb-1">{salon.address}</p>
                    <p className="text-sm text-muted-foreground">{salon.location}, Morocco</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recommended Services */}
          {recommendedServices && recommendedServices.length > 0 && (
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">You Might Also Like</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedServices.map((rec) => (
                    <div key={rec.id} className="border rounded-lg overflow-hidden">
                      {rec.image ? (
                        <img
                          src={rec.image}
                          alt={rec.name}
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <div className="w-full h-32 bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground">No image</span>
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-medium mb-1">{rec.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {rec.duration} minutes
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="font-medium">
                            {rec.discountedPrice || rec.price} MAD
                          </p>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/booking/${salonId}/${rec.id}`}>Book</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Right side - Booking form */}
        <div className="md:w-1/3">
          <BookingForm 
            salon={salon} 
            service={service} 
            className="mb-6"
          />
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-3">Booking Policy</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Free cancellation up to 24 hours before your appointment</li>
              <li>• Late cancellations may incur a fee of 50% of the service price</li>
              <li>• No-shows are charged the full service price</li>
              <li>• Please arrive 10 minutes before your appointment time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
