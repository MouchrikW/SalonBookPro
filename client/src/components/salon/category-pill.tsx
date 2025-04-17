import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryPillProps {
  category: string;
  isActive?: boolean;
  onClick?: () => void;
}

export default function CategoryPill({ category, isActive = false, onClick }: CategoryPillProps) {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      className={cn(
        "px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted hover:bg-muted/80"
      )}
      onClick={onClick}
    >
      {category}
    </Button>
  );
}
