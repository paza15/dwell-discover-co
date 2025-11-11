import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Bath, Square, MapPin, Building2, Sofa, ChefHat, Flower2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyCardProps {
  id: string;
  image: string;
  price: string;
  price_eur?: string;
  price_lek?: string;
  title: string;
  title_en?: string;
  title_al?: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  floor?: number;
  living_rooms?: number;
  kitchen?: number;
  balcony?: number;
  status?: "For Sale" | "For Rent";
}

const PropertyCard = ({ id, image, price, price_eur, price_lek, title, title_en, title_al, location, beds, baths, sqft, floor, living_rooms, kitchen, balcony, status = "For Sale" }: PropertyCardProps) => {
  const { t, language } = useLanguage();
  
  const displayTitle = language === 'al' ? (title_al || title_en || title) : (title_en || title);
  const displayPrice = language === 'al' ? (price_lek || price) : (price_eur || price);
  
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
          <h3 className="text-2xl font-bold text-primary">{displayPrice}</h3>
        </div>
        <h4 className="text-xl font-semibold mb-2 text-foreground">{displayTitle}</h4>
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{location}</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4 text-muted-foreground">
          <div className="flex items-center gap-1">
            <BedDouble className="w-4 h-4" />
            <span className="text-sm">{beds} {t('bedrooms')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span className="text-sm">{baths} {t('baths')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            <span className="text-sm">{sqft} {t('sqft')}</span>
          </div>
          {floor !== undefined && (
            <div className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              <span className="text-sm">{t('floor')}: {floor}</span>
            </div>
          )}
          {living_rooms !== undefined && living_rooms > 0 && (
            <div className="flex items-center gap-1">
              <Sofa className="w-4 h-4" />
              <span className="text-sm">{living_rooms} {t('livingRooms')}</span>
            </div>
          )}
          {kitchen !== undefined && kitchen > 0 && (
            <div className="flex items-center gap-1">
              <ChefHat className="w-4 h-4" />
              <span className="text-sm">{kitchen} {t('kitchen')}</span>
            </div>
          )}
          {balcony !== undefined && balcony > 0 && (
            <div className="flex items-center gap-1">
              <Flower2 className="w-4 h-4" />
              <span className="text-sm">{balcony} {balcony > 1 ? t('balconies') : t('balcony')}</span>
            </div>
          )}
        </div>
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
          <Link to={`/property/${id}`}>{t('viewDetails')}</Link>
        </Button>
      </div>
    </Card>
  );
};

export default PropertyCard;
