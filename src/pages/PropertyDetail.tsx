import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Bath, Square, MapPin, ArrowLeft, Home } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import logo from "@/assets/logo.png";

const PropertyDetail = () => {
  const { id } = useParams();
  const { t } = useLanguage();

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const getImageForProperty = (imageUrl: string) => {
    const imageMap: Record<string, string> = {
      'property-1.jpg': property1,
      'property-2.jpg': property2,
      'property-3.jpg': property3,
    };
    return imageMap[imageUrl] || property1;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{t('loadingProperties')}</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Property not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="iDeal Properties" className="h-12 w-auto" />
            </Link>
            <div className="flex items-center gap-6">
              <Link to="/buy" className="hover:text-accent transition-colors">{t('buy')}</Link>
              <Link to="/rent" className="hover:text-accent transition-colors">{t('rent')}</Link>
              <Link to="/about" className="hover:text-accent transition-colors">{t('about')}</Link>
              <LanguageSwitcher />
              <Button variant="secondary" asChild>
                <Link to="/contact">{t('contactUs')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Property Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-6">
            <Link to={property.status === 'For Sale' ? '/buy' : '/rent'}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backToListings')}
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image */}
            <div className="relative h-[400px] lg:h-[600px] rounded-lg overflow-hidden">
              <img 
                src={getImageForProperty(property.image_url || '')} 
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground font-semibold text-lg px-4 py-2">
                {property.status}
              </Badge>
            </div>

            {/* Details */}
            <div>
              <h1 className="text-4xl font-bold mb-4 text-foreground">{property.title}</h1>
              <div className="flex items-center text-muted-foreground mb-6">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-lg">{property.location}</span>
              </div>
              
              <div className="text-5xl font-bold text-primary mb-8">
                ${property.price.toLocaleString()}{property.status === 'For Rent' ? '/mo' : ''}
              </div>

              <Card className="p-6 mb-8">
                <div className="grid grid-cols-3 gap-6">
                  <div className="flex flex-col items-center">
                    <BedDouble className="w-8 h-8 text-primary mb-2" />
                    <span className="text-2xl font-bold text-foreground">{property.beds}</span>
                    <span className="text-sm text-muted-foreground">{t('beds')}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Bath className="w-8 h-8 text-primary mb-2" />
                    <span className="text-2xl font-bold text-foreground">{property.baths}</span>
                    <span className="text-sm text-muted-foreground">{t('baths')}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Square className="w-8 h-8 text-primary mb-2" />
                    <span className="text-2xl font-bold text-foreground">{property.sqft}</span>
                    <span className="text-sm text-muted-foreground">sqft</span>
                  </div>
                </div>
              </Card>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-foreground">{t('description')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description || t('noDescription')}
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-3 text-foreground">{t('propertyType')}</h3>
                <Badge variant="outline" className="text-base px-4 py-2">
                  {property.property_type}
                </Badge>
              </div>

              <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                <Link to="/contact">{t('contactUs')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyDetail;
