import { useState } from "react";
import { Link } from "wouter";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Salon } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SalonCardProps {
  salon: Salon;
}

export default function SalonCard({ salon }: SalonCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isHovering, setIsHovering] = useState(false);
  
  // Safely use auth
  let user = null;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    console.error("Auth provider not available:", error);
  }

  // Check if salon is in favorites
  const { data: favoriteData } = useQuery({
    queryKey: ["/api/favorites/check", salon.id],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user,
  });

  const isFavorite = favoriteData?.isFavorite || false;

  // Add to favorites mutation
  const addToFavorites = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/favorites", { salonId: salon.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites/check", salon.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/favorites"] });
      toast({
        title: "Added to favorites",
        description: `${salon.name} has been added to your favorites`,
      });
    },
  });

  // Remove from favorites mutation
  const removeFromFavorites = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/favorites/${salon.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites/check", salon.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/favorites"] });
      toast({
        title: "Removed from favorites",
        description: `${salon.name} has been removed from your favorites`,
      });
    },
  });

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  return (
    <Link 
      href={`/salons/${salon.id}`} 
      className="rounded-xl overflow-hidden bg-white shadow-card hover:shadow-lg transition-all group block"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="salon-card-img-container relative h-60 md:h-48">
        <img 
          src={salon.images[0]} 
          alt={salon.name} 
          className="w-full h-full object-cover"
        />
        <Button 
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all ${isFavorite ? 'text-primary' : 'text-foreground'}`}
          onClick={toggleFavorite}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''} ${addToFavorites.isPending || removeFromFavorites.isPending ? 'animate-pulse' : ''}`} />
        </Button>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium">{salon.name}</h3>
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
            <span className="text-sm font-medium">{salon.rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground ml-1">({salon.reviewCount})</span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-2">{salon.location} • 2.4 km away</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {salon.categories.slice(0, 3).map((category, index) => (
            <Badge key={index} variant="outline" className="bg-muted text-xs font-normal">
              {category}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm">From <span className="font-semibold">{salon.priceRange.min} MAD</span></p>
        </div>
      </div>
    </Link>
  );
}
