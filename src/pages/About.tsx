import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Users, Award, TrendingUp } from "lucide-react";

const About = () => {
  const stats = [
    { icon: Home, value: "500+", label: "Properties Sold" },
    { icon: Users, value: "1000+", label: "Happy Clients" },
    { icon: Award, value: "15+", label: "Years Experience" },
    { icon: TrendingUp, value: "98%", label: "Customer Satisfaction" },
  ];

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
          <h1 className="text-5xl font-bold mb-6">About EstateHub</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Your trusted partner in finding the perfect property
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-6">Our Story</h2>
            <p className="text-muted-foreground text-lg mb-6">
              Founded in 2010, EstateHub has been helping families and individuals find their dream homes for over a decade. 
              Our commitment to excellence and personalized service has made us one of the most trusted names in real estate.
            </p>
            <p className="text-muted-foreground text-lg">
              We believe that finding a home is more than just a transaction—it's about finding a place where memories are made 
              and futures are built. Our team of dedicated professionals works tirelessly to ensure every client finds exactly 
              what they're looking for.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-8 text-center border-border">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                <p className="text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-foreground text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 border-border">
              <h3 className="text-2xl font-semibold text-foreground mb-3">Integrity</h3>
              <p className="text-muted-foreground">
                We uphold the highest standards of honesty and transparency in every interaction.
              </p>
            </Card>
            <Card className="p-8 border-border">
              <h3 className="text-2xl font-semibold text-foreground mb-3">Excellence</h3>
              <p className="text-muted-foreground">
                We strive for excellence in every service we provide, ensuring the best outcomes for our clients.
              </p>
            </Card>
            <Card className="p-8 border-border">
              <h3 className="text-2xl font-semibold text-foreground mb-3">Community</h3>
              <p className="text-muted-foreground">
                We're committed to building stronger communities, one home at a time.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[image:var(--gradient-hero)] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Let's find your perfect property together
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/contact">Contact Us Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
