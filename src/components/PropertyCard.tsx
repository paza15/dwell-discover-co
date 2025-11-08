import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Bath, Square, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyCardProps {
  id: string;
  image: string;
  price: string;
  title: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  status?: "For Sale" | "For Rent";
}

const PropertyCard = ({ id, image, price, title, location, beds, baths, sqft, status = "For Sale" }: PropertyCardProps) => {
  const { t } = useLanguage();
  
  return (
    <Card className="overflow-hidden group border-border hover-lift bg-[image:var(--gradient-card)]">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground font-semibold">
          {status}
        </Badge>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-2xl font-bold text-primary">{price}</h3>
        </div>
        <h4 className="text-xl font-semibold mb-2 text-foreground">{title}</h4>
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex items-center gap-4 mb-4 text-muted-foreground">
          <div className="flex items-center gap-1">
            <BedDouble className="w-4 h-4" />
            <span className="text-sm">{beds} {t('beds')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span className="text-sm">{baths} {t('baths')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            <span className="text-sm">{sqft} {t('sqft')}</span>
          </div>
        </div>
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
          <Link to={`/property/${id}`}>{t('viewDetails')}</Link>
        </Button>
      </div>
    </Card>
  );
};

export default PropertyCard;
