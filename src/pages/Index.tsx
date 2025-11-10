import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Hero from "@/components/Hero";
import PropertyCard from "@/components/PropertyCard";
import AgentCard from "@/components/AgentCard";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileMenu from "@/components/MobileMenu";
import SocialLinks from "@/components/SocialLinks";
import GoogleReviews from "@/components/GoogleReviews";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, TrendingUp, Shield, Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo-white.png";
import agent1 from "@/assets/agent-1.jpg";
import agent2 from "@/assets/agent-2.jpg";
import { resolvePropertyImage } from "@/lib/propertyImages";
import type { Tables } from "@/integrations/supabase/types";

const Index = () => {
  const { t } = useLanguage();

  // Fetch properties from database
  const { data: properties, isLoading } = useQuery<Tables<'properties'>[]>({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Tables<'properties'>[];
    },
  });

  // Format price based on status
  const formatPrice = (price: number, status: string) => {
    if (status === 'For Rent') {
      return `$${price.toLocaleString()}/mo`;
    }
    return `$${price.toLocaleString()}`;
  };

  const services = [
    {
      icon: Home,
      titleKey: "buyAHome",
      descriptionKey: "buyAHomeDesc",
    },
    {
      icon: TrendingUp,
      titleKey: "sellProperty",
      descriptionKey: "sellPropertyDesc",
    },
    {
      icon: Shield,
      titleKey: "propertyManagement",
      descriptionKey: "propertyManagementDesc",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-20 bg-black/90 backdrop-blur-sm">
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
              <Link to="/auth" className="text-white/80 hover:text-accent transition-colors">
                {t('ownerPortal')}
              </Link>
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
      <Hero />

      {/* Featured Properties */}
      <section className="py-20 bg-[image:var(--gradient-light)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">{t('featuredProperties')}</h2>
            <p className="text-muted-foreground text-lg">
              {t('featuredPropertiesDesc')}
            </p>
          </div>
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('loadingProperties')}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties?.slice(0, 6).map((property) => (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    image={resolvePropertyImage(property.image_url, property.image_urls)}
                    price={formatPrice(property.price, property.status)}
                    title={property.title}
                    location={property.location}
                    beds={property.beds}
                    baths={property.baths}
                    sqft={property.sqft}
                    floor={property.floor ?? undefined}
                    living_rooms={property.living_rooms ?? undefined}
                    kitchen={property.kitchen ?? undefined}
                    balcony={property.balcony ?? undefined}
                    status={property.status as "For Sale" | "For Rent"}
                  />
                ))}
              </div>
              <div className="text-center mt-12">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground hover-lift" asChild>
                  <Link to="/buy">{t('viewAllProperties')}</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">{t('ourServices')}</h2>
            <p className="text-muted-foreground text-lg">
              {t('ourServicesDesc')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="p-8 text-center hover-lift border-border bg-[image:var(--gradient-card)]">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 shadow-[var(--shadow-glow)]">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-foreground">{t(service.titleKey)}</h3>
                <p className="text-muted-foreground">{t(service.descriptionKey)}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[image:var(--gradient-hero)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6 animate-fade-in">
            {t('readyPerfectHome')}
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            {t('expertTeamGuide')}
          </p>
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground hover-lift shadow-[var(--shadow-elevated)]" asChild>
            <Link to="/rent">{t('getStartedToday')}</Link>
          </Button>
        </div>
      </section>

      {/* Agents Section */}
      <section className="py-20 bg-[image:var(--gradient-light)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-foreground">{t('ourAgents')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('ourAgentsDescription')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <AgentCard
              name="Arben Pazari"
              role="Managing Director"
              image={agent1}
              email="info@idealprop.al"
              phone="+355 69 123 4567"
            />
            <AgentCard
              name="Elona Hoxha"
              role="Senior Sales Agent"
              image={agent2}
              email="elona@idealprop.al"
              phone="+355 69 234 5678"
            />
            <AgentCard
              name="Marko Dervishi"
              role="Property Consultant"
              image={agent1}
              email="marko@idealprop.al"
              phone="+355 69 345 6789"
            />
            <AgentCard
              name="Sara Krasniqi"
              role="Rental Specialist"
              image={agent2}
              email="sara@idealprop.al"
              phone="+355 69 456 7890"
            />
            <AgentCard
              name="Altin Shehu"
              role="Investment Advisor"
              image={agent1}
              email="altin@idealprop.al"
              phone="+355 69 567 8901"
            />
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <GoogleReviews />

      {/* Contact Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">{t('getInTouch')}</h2>
            <p className="text-muted-foreground text-lg">
              {t('questionsHelp')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 text-center border-border">
              <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-foreground">{t('phone')}</h3>
              <p className="text-muted-foreground"> +355-674087114 </p>
            </Card>
            <Card className="p-6 text-center border-border">
              <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-foreground">{t('email')}</h3>
              <p className="text-muted-foreground">info@estatehub.com</p>
            </Card>
            <Card className="p-6 text-center border-border">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-foreground">{t('address')}</h3>
              <p className="text-muted-foreground">Besnik Sykja, Shkodër 4001, Albania</p>
            </Card>
          </div>
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
              {t('trustedPartnerFooter')}
            </p>
            <SocialLinks />
            <p className="text-background/50 text-sm mt-6">
              © 2025 EstateHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
