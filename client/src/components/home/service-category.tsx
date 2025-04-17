import { LucideIcon } from "lucide-react";

interface ServiceCategoryProps {
  icon: LucideIcon;
  name: string;
  onClick?: () => void;
}

export default function ServiceCategory({ icon: Icon, name, onClick }: ServiceCategoryProps) {
  return (
    <div 
      className="flex flex-col items-center justify-center p-4 rounded-xl hover:bg-white hover:shadow-card transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="w-20 h-20 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-3">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
}
