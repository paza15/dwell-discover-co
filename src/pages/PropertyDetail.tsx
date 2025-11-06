import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Bath, Square, MapPin, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileMenu from "@/components/MobileMenu";
import ImageZoom from "@/components/ImageZoom";
import SocialLinks from "@/components/SocialLinks";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo-new.png";
import { resolvePropertyImages } from "@/lib/propertyImages";

const PropertyDetail = () => {
  const { id } = useParams();
  const { t } = useLanguage();

  const { data: property, isLoading } = useQuery<Tables<'properties'>>({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Tables<'properties'>;
    },
  });

  const propertyImages = useMemo(
    () => resolvePropertyImages(property?.image_urls as string[] | null, property?.image_url),
    [property?.image_urls, property?.image_url],
  );

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [property?.id]);

  const showPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };

  const showNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
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
      <nav className="bg-black/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="iDeal Properties" className="h-12 w-auto" />
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/buy" className="text-white hover:text-accent transition-colors">{t('buy')}</Link>
              <Link to="/rent" className="text-white hover:text-accent transition-colors">{t('rent')}</Link>
              <Link to="/blog" className="text-white hover:text-accent transition-colors">{t('blog')}</Link>
              <Link to="/about" className="text-white hover:text-accent transition-colors">{t('about')}</Link>
              <LanguageSwitcher />
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                <Link to="/contact">{t('contactUs')}</Link>
              </Button>
            </div>
            <MobileMenu />
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
            <div>
              <div className="relative h-[400px] lg:h-[600px] rounded-lg overflow-hidden">
                <img
                  src={propertyImages[currentImageIndex]}
                  alt={`${property.title} image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                <ImageZoom 
                  src={propertyImages[currentImageIndex]} 
                  alt={`${property.title} image ${currentImageIndex + 1}`}
                  onPrevious={showPreviousImage}
                  onNext={showNextImage}
                  showNavigation={propertyImages.length > 1}
                />
                {propertyImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={showPreviousImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/70 text-foreground shadow-lg transition hover:bg-background"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      type="button"
                      onClick={showNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/70 text-foreground shadow-lg transition hover:bg-background"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground font-semibold text-lg px-4 py-2">
                  {property.status}
                </Badge>
              </div>

              {propertyImages.length > 1 && (
                <div className="mt-4 flex items-center justify-center gap-3">
                  {propertyImages.map((image, index) => (
                    <button
                      key={image + index}
                      type="button"
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-16 w-20 overflow-hidden rounded-md border transition ${
                        index === currentImageIndex
                          ? 'border-primary ring-2 ring-primary/60'
                          : 'border-border hover:border-primary/60'
                      }`}
                      aria-label={`Show image ${index + 1}`}
                    >
                      <img src={image} alt={`${property.title} thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
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

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img src={logo} alt="iDeal Properties" className="h-16 w-auto brightness-0 invert" />
            </div>
            <p className="text-background/70 mb-6">
              Your trusted partner in real estate
            </p>
            <SocialLinks />
            <p className="text-background/50 text-sm mt-6">
              © 2025 iDeal Properties. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PropertyDetail;
