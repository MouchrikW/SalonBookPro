import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { Service } from "@shared/schema";

interface ServiceCardProps {
  service: Service;
  salonId: number;
}

export default function ServiceCard({ service, salonId }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-card transition-all">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 mb-4 md:mb-0 md:mr-6">
          {service.image ? (
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-32 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>
        <div className="md:w-3/4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="text-lg font-medium mb-1">{service.name}</h3>
              <p className="text-muted-foreground mb-2">{service.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="flex items-center text-muted-foreground text-sm">
                  <Clock className="h-4 w-4 mr-1" /> {service.duration} minutes
                </span>
              </div>
              {service.isPopular && (
                <span className="inline-block px-2 py-1 bg-primary bg-opacity-10 text-primary text-xs rounded-full">
                  Most Popular
                </span>
              )}
            </div>
            <div className="flex flex-col items-start md:items-end mt-2 md:mt-0">
              {service.discountedPrice ? (
                <div className="flex items-center mb-2">
                  <span className="line-through text-muted-foreground mr-2">{service.price} MAD</span>
                  <span className="font-semibold text-lg">{service.discountedPrice} MAD</span>
                </div>
              ) : (
                <p className="font-semibold text-lg mb-2">{service.price} MAD</p>
              )}
              <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                <Link href={`/booking/${salonId}/${service.id}`}>Book Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
