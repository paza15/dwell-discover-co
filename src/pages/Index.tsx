import Hero from "@/components/Hero";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, TrendingUp, Shield, Phone, Mail, MapPin } from "lucide-react";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const Index = () => {
  const featuredProperties = [
    {
      image: property1,
      price: "$850,000",
      title: "Modern Luxury Villa",
      location: "Beverly Hills, CA",
      beds: 4,
      baths: 3,
      sqft: 3200,
      status: "For Sale" as const,
    },
    {
      image: property2,
      price: "$525,000",
      title: "Charming Family Home",
      location: "Austin, TX",
      beds: 3,
      baths: 2,
      sqft: 2400,
      status: "For Sale" as const,
    },
    {
      image: property3,
      price: "$3,200/mo",
      title: "Downtown Luxury Condo",
      location: "Seattle, WA",
      beds: 2,
      baths: 2,
      sqft: 1800,
      status: "For Rent" as const,
    },
  ];

  const services = [
    {
      icon: Home,
      title: "Buy a Home",
      description: "Find your perfect property from our extensive listings",
    },
    {
      icon: TrendingUp,
      title: "Sell Property",
      description: "Get the best value with our expert marketing strategies",
    },
    {
      icon: Shield,
      title: "Property Management",
      description: "Hassle-free management for your investment properties",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-20 bg-transparent">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold text-white">EstateHub</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="text-white hover:text-accent transition-colors">Buy</a>
              <a href="#" className="text-white hover:text-accent transition-colors">Rent</a>
              <a href="#" className="text-white hover:text-accent transition-colors">Sell</a>
              <a href="#" className="text-white hover:text-accent transition-colors">About</a>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero />

      {/* Featured Properties */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Featured Properties</h2>
            <p className="text-muted-foreground text-lg">
              Handpicked properties that match your dreams
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <PropertyCard key={index} {...property} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              View All Properties
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Services</h2>
            <p className="text-muted-foreground text-lg">
              Everything you need for your real estate journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="p-8 text-center hover:shadow-[var(--shadow-elevated)] transition-[var(--transition-smooth)] border-border">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-foreground">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[image:var(--gradient-hero)]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Let our expert team guide you through every step of your real estate journey
          </p>
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Get In Touch</h2>
            <p className="text-muted-foreground text-lg">
              Have questions? We're here to help
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 text-center border-border">
              <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-foreground">Phone</h3>
              <p className="text-muted-foreground">(555) 123-4567</p>
            </Card>
            <Card className="p-6 text-center border-border">
              <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-foreground">Email</h3>
              <p className="text-muted-foreground">info@estatehub.com</p>
            </Card>
            <Card className="p-6 text-center border-border">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-foreground">Address</h3>
              <p className="text-muted-foreground">123 Main St, City, ST 12345</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Home className="w-8 h-8" />
              <span className="text-2xl font-bold">EstateHub</span>
            </div>
            <p className="text-background/70 mb-6">
              Your trusted partner in real estate
            </p>
            <p className="text-background/50 text-sm">
              © 2025 EstateHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
