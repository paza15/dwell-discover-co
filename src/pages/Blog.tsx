import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Calendar, User, ArrowRight } from "lucide-react";
import logo from "@/assets/logo.jpg";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const Blog = () => {
  const { t } = useLanguage();

  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Tips for First-Time Home Buyers",
      excerpt: "Essential advice to help you navigate the home buying process with confidence and make informed decisions.",
      image: property1,
      author: "Ardit Mehmeti",
      date: "March 15, 2025",
      category: "Buying Guide"
    },
    {
      id: 2,
      title: "Understanding the Albanian Real Estate Market in 2025",
      excerpt: "A comprehensive overview of current market trends, pricing, and investment opportunities in Albania.",
      image: property2,
      author: "Elona Kastrati",
      date: "March 10, 2025",
      category: "Market Insights"
    },
    {
      id: 3,
      title: "Investing in Rental Properties: What You Need to Know",
      excerpt: "Learn the fundamentals of rental property investment and maximize your returns in the real estate market.",
      image: property3,
      author: "Besnik Hoxha",
      date: "March 5, 2025",
      category: "Investment"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="iDeal Properties" className="h-12 w-auto" />
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/buy" className="text-foreground hover:text-primary transition-colors">{t('buy')}</Link>
              <Link to="/rent" className="text-foreground hover:text-primary transition-colors">{t('rent')}</Link>
              <Link to="/blog" className="text-primary font-semibold">{t('blog')}</Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors">{t('about')}</Link>
              <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                {t('ownerPortal')}
              </Link>
              <LanguageSwitcher />
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                <Link to="/contact">{t('contactUs')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-[image:var(--gradient-hero)]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            {t('blogTitle')}
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            {t('blogSubtitle')}
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-[var(--shadow-elevated)] transition-[var(--transition-smooth)] border-border">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author}
                    </span>
                  </div>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {post.excerpt}
                  </p>
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full">
                    {t('readMore')} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            ))}
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
            <p className="text-background/50 text-sm">
              © 2025 iDeal Properties. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Blog;
