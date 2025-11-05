import { Link, useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo-new.png";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Article not found</h2>
          <Button onClick={() => navigate("/blog")}>Back to Blog</Button>
        </div>
      </div>
    );
  }

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

      {/* Article Content */}
      <article className="py-12 bg-[image:var(--gradient-light)]">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate("/blog")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>

          {post.image_url && (
            <img 
              src={post.image_url}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
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

          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-6">
            {post.category}
          </span>

          <h1 className="text-4xl font-bold text-foreground mb-6">
            {post.title}
          </h1>

          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-xl text-muted-foreground mb-8 font-medium">
              {post.excerpt}
            </p>
            <div className="whitespace-pre-wrap">
              {post.content}
            </div>
          </div>
        </div>
      </article>

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

export default BlogDetail;
