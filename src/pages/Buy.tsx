import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const Buy = () => {
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

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Home className="w-8 h-8" />
              <span className="text-2xl font-bold">EstateHub</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link to="/buy" className="hover:text-accent transition-colors">Buy</Link>
              <Link to="/rent" className="hover:text-accent transition-colors">Rent</Link>
              <Link to="/about" className="hover:text-accent transition-colors">About</Link>
              <Button variant="secondary" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-[image:var(--gradient-hero)] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Properties For Sale</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Discover your dream home from our curated collection of premium properties
          </p>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading properties...</p>
            </div>
          ) : properties && properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard 
                  key={property.id}
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
              <p className="text-muted-foreground text-lg">No properties available for sale at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Buy;
