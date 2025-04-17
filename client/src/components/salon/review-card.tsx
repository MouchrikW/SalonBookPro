import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Review } from "@shared/schema";

interface ReviewWithUser extends Review {
  user: {
    id: number;
    name: string;
  } | null;
}

interface ReviewCardProps {
  review: ReviewWithUser;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  // Format date
  const formattedDate = format(new Date(review.date), 'MMMM yyyy');
  
  // Get user's first letter for avatar fallback
  const userInitial = review.user?.name.charAt(0) || '?';
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-start mb-4">
        <div className="mr-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${review.user?.id || review.id}`} alt={review.user?.name || "Anonymous"} />
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h3 className="font-medium">{review.user?.name || "Anonymous"}</h3>
          <p className="text-muted-foreground text-sm">{formattedDate}</p>
        </div>
      </div>
      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"} mr-1`}
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
              clipRule="evenodd"
            />
          </svg>
        ))}
      </div>
      <p className="text-foreground">{review.comment}</p>
    </div>
  );
}
