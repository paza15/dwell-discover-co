import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Calendar, User, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo-new.png";

const Blog = () => {
  const { t } = useLanguage();

  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-black/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="iDeal Properties" className="h-12 w-auto" />
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/buy" className="text-white hover:text-accent transition-colors">{t('buy')}</Link>
              <Link to="/rent" className="text-white hover:text-accent transition-colors">{t('rent')}</Link>
              <Link to="/blog" className="text-accent font-semibold">{t('blog')}</Link>
              <Link to="/about" className="text-white hover:text-accent transition-colors">{t('about')}</Link>
              <Link to="/admin" className="text-white/70 hover:text-accent transition-colors">
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
      <section className="py-20 bg-[image:var(--gradient-light)]">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading articles...</p>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No articles published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-[var(--shadow-elevated)] transition-[var(--transition-smooth)] border-border">
                  {post.image_url && (
                    <img 
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
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
                    <Button 
                      variant="outline" 
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full"
                      asChild
                    >
                      <Link to={`/blog/${post.id}`}>
                        {t('readMore')} <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
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
