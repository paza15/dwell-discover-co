import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters, { FilterValues } from "@/components/PropertyFilters";
import AgentCard from "@/components/AgentCard";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import logo from "@/assets/logo.png";

const Buy = () => {
  const { t } = useLanguage();
  const [filters, setFilters] = useState<FilterValues>({
    minPrice: '',
    maxPrice: '',
    beds: '',
    baths: '',
    propertyType: '',
  });

  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties', 'for-sale'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'For Sale')
        .order('created_at', { ascending: false });
      
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

  const filteredProperties = useMemo(() => {
    if (!properties) return [];
    
    return properties.filter((property) => {
      if (filters.minPrice && property.price < parseFloat(filters.minPrice)) return false;
      if (filters.maxPrice && property.price > parseFloat(filters.maxPrice)) return false;
      if (filters.beds && filters.beds !== 'any' && property.beds < parseInt(filters.beds)) return false;
      if (filters.baths && filters.baths !== 'any' && property.baths < parseInt(filters.baths)) return false;
      if (filters.propertyType && filters.propertyType !== 'any' && property.property_type !== filters.propertyType) return false;
      return true;
    });
  }, [properties, filters]);

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
              <Link to="/blog" className="hover:text-accent transition-colors">{t('blog')}</Link>
              <Link to="/about" className="hover:text-accent transition-colors">{t('about')}</Link>
              <LanguageSwitcher />
              <Button variant="secondary" asChild>
                <Link to="/contact">{t('contactUs')}</Link>
              </Button>
            </div>
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
      <section className="py-20">
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
                  image={getImageForProperty(property.image_url || '')}
                  price={`$${property.price.toLocaleString()}`}
                  title={property.title}
                  location={property.location}
                  beds={property.beds}
                  baths={property.baths}
                  sqft={property.sqft}
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

      {/* Agents Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-foreground">{t('ourAgents')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('ourAgentsDescription')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AgentCard 
              name="Ardit Mehmeti"
              role="Senior Real Estate Agent"
              image={property1}
              email="ardit@idealproperties.com"
              phone="+355 69 123 4567"
              description="With over 10 years of experience in the Albanian real estate market, Ardit specializes in luxury properties and commercial real estate."
            />
            <AgentCard 
              name="Elona Kastrati"
              role="Property Consultant"
              image={property2}
              email="elona@idealproperties.com"
              phone="+355 69 234 5678"
              description="Elona is dedicated to helping families find their dream homes. Her attention to detail and personalized service sets her apart."
            />
            <AgentCard 
              name="Besnik Hoxha"
              role="Investment Specialist"
              image={property3}
              email="besnik@idealproperties.com"
              phone="+355 69 345 6789"
              description="Besnik focuses on investment properties and helps clients maximize their real estate portfolio returns."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Buy;
