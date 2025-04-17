import { useState } from "react";
import { useLocation } from "wouter";
import { Calendar } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { format, addDays } from "date-fns";
import { Salon, Service } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BookingFormProps {
  salon: Salon;
  service: Service;
  className?: string;
}

export default function BookingForm({ salon, service, className }: BookingFormProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>("12:00");
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  // Generate time slots
  const timeSlots = [];
  for (let hour = 9; hour <= 18; hour++) {
    if (hour !== 13) { // Skip 13:00 (lunch break)
      timeSlots.push(`${hour}:00`);
      if (hour !== 18) {
        timeSlots.push(`${hour}:30`);
      }
    }
  }

  // Create booking mutation
  const bookingMutation = useMutation({
    mutationFn: async () => {
      // Combine date and time
      const bookingDate = new Date(date);
      const [hours, minutes] = time.split(':').map(Number);
      bookingDate.setHours(hours, minutes, 0, 0);

      return apiRequest("POST", "/api/bookings", {
        salonId: salon.id,
        serviceId: service.id,
        date: bookingDate.toISOString(),
        status: "pending",
        totalPrice: service.discountedPrice || service.price,
      });
    },
    onSuccess: () => {
      toast({
        title: "Booking confirmed!",
        description: `Your appointment has been scheduled for ${format(date, 'MMMM d, yyyy')} at ${time}`,
      });
      navigate("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Booking failed",
        description: error.message || "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    bookingMutation.mutate();
  };

  return (
    <div className={`bg-white rounded-xl p-6 shadow-card sticky top-24 ${className}`}>
      <h2 className="text-xl font-bold mb-4">Book an Appointment</h2>
      
      {/* Date Selection */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Select Date</h3>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => date && setDate(date)}
          disabled={(date) => date < new Date() || date > addDays(new Date(), 60)}
          className="rounded-md border"
        />
      </div>
      
      {/* Service Selection */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Service</h3>
        <div className="p-3 border rounded-lg bg-muted/50">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{service.name}</h4>
              <p className="text-sm text-muted-foreground">{service.duration} minutes</p>
            </div>
            <div className="font-semibold">
              {service.discountedPrice ? (
                <div>
                  <span className="line-through text-muted-foreground text-sm mr-1">{service.price} MAD</span>
                  {service.discountedPrice} MAD
                </div>
              ) : (
                <div>{service.price} MAD</div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Time Selection */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Select Time</h3>
        <Select value={time} onValueChange={setTime}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a time" />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((slot) => (
              <SelectItem key={slot} value={slot}>
                {slot}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Price Summary */}
      <div className="border-t border-b border-border py-4 mb-6">
        <div className="flex justify-between mb-2">
          <span>{service.name}</span>
          <span>{service.discountedPrice || service.price} MAD</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{service.discountedPrice || service.price} MAD</span>
        </div>
      </div>
      
      <Button 
        className="w-full bg-primary hover:bg-primary/90 text-white"
        onClick={handleSubmit}
        disabled={bookingMutation.isPending}
      >
        {bookingMutation.isPending ? "Processing..." : "Confirm Booking"}
      </Button>
      
      <p className="text-center text-muted-foreground text-sm mt-4">
        You won't be charged yet
      </p>
    </div>
  );
}
