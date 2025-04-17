import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface SpecialOfferProps {
  title: string;
  description: string;
  image: string;
  badge: string;
  buttonLabel: string;
  buttonUrl: string;
  buttonColor?: string;
}

export default function SpecialOffer({
  title,
  description,
  image,
  badge,
  buttonLabel,
  buttonUrl,
  buttonColor = "primary",
}: SpecialOfferProps) {
  return (
    <div className="rounded-xl overflow-hidden relative h-64">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <span className={`inline-block px-3 py-1 bg-${buttonColor} text-sm font-medium rounded-full mb-2`}>
          {badge}
        </span>
        <h3 className="text-xl md:text-2xl font-bold mb-2">{title}</h3>
        <p className="mb-3">{description}</p>
        <Button 
          asChild 
          variant="outline" 
          className="bg-white hover:bg-white/90 text-foreground"
        >
          <Link href={buttonUrl}>{buttonLabel}</Link>
        </Button>
      </div>
    </div>
  );
}
