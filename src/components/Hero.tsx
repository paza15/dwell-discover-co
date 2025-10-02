import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import heroImage from "@/assets/hero-real-estate.jpg";

const Hero = () => {
  return (
    <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `var(--gradient-overlay), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
          Find Your Dream Home
        </h1>
        <p className="text-xl text-white/90 mb-8 drop-shadow-md">
          Discover the perfect property that matches your lifestyle and budget
        </p>
        
        {/* Search Bar */}
        <div className="bg-card rounded-full shadow-[var(--shadow-elevated)] p-2 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
          <Input 
            placeholder="Enter location, property type, or keyword..."
            className="flex-1 border-0 focus-visible:ring-0 text-base h-12 rounded-full"
          />
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-12"
          >
            <Search className="w-5 h-5 mr-2" />
            Search
          </Button>
        </div>
        
        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
            For Sale
          </Button>
          <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
            For Rent
          </Button>
          <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
            New Listings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
