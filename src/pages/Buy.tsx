import { Link, useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters, { FilterValues } from "@/components/PropertyFilters";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileMenu from "@/components/MobileMenu";
import SocialLinks from "@/components/SocialLinks";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-white.png";
import { resolvePropertyImage } from "@/lib/propertyImages";
import type { Tables } from "@/integrations/supabase/types";

const Buy = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [filters, setFilters] = useState<FilterValues>({
    minPrice: '',
    maxPrice: '',
    beds: '',
    baths: '',
    propertyType: '',
  });

  const { data: properties, isLoading } = useQuery<Tables<'properties'>[]>({
    queryKey: ['properties', 'for-sale'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'For Sale')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Tables<'properties'>[];
    },
  });

  const filteredProperties = useMemo(() => {
    if (!properties) return [];

    return properties.filter((property) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          property.title.toLowerCase().includes(query) ||
          property.location.toLowerCase().includes(query) ||
          property.description?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Price filters
      if (filters.minPrice && property.price < parseFloat(filters.minPrice)) return false;
      if (filters.maxPrice && property.price > parseFloat(filters.maxPrice)) return false;
      if (filters.beds && filters.beds !== 'any' && property.beds < parseInt(filters.beds)) return false;
      if (filters.baths && filters.baths !== 'any' && property.baths < parseInt(filters.baths)) return false;
      if (filters.propertyType && filters.propertyType !== 'any' && property.property_type !== filters.propertyType) return false;
      return true;
    });
  }, [properties, filters, searchQuery]);

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

      {/* Hero Section */}
      <section className="py-20 bg-[image:var(--gradient-hero)] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">{t('propertiesForSale')}</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {t('dreamHomeDescription')}
          </p>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-20 bg-[image:var(--gradient-light)]">
        <div className="container mx-auto px-4">
          <PropertyFilters onFilterChange={setFilters} />

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('loadingProperties')}</p>
            </div>
          ) : filteredProperties && filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  image={resolvePropertyImage(property.image_url, property.image_urls)}
                  price={`€${Math.floor(property.price).toLocaleString()}`}
                  price_eur={property.price_eur ?? undefined}
                  price_lek={property.price_lek ?? undefined}
                  title={property.title}
                  title_en={property.title_en ?? undefined}
                  title_al={property.title_al ?? undefined}
                  location={property.location}
                  beds={property.beds}
                  baths={property.baths}
                  sqft={property.sqft}
                  floor={property.floor ?? undefined}
                  living_rooms={property.living_rooms ?? undefined}
                  kitchen={property.kitchen ?? undefined}
                  balcony={property.balcony ?? undefined}
                  status="For Sale"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">{t('noPropertiesForSale')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img src={logo} alt="iDeal Properties" className="h-16 w-auto" />
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

export default Buy;
