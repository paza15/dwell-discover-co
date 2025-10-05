import { Link } from "react-router-dom";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Users, Award, TrendingUp } from "lucide-react";

const About = () => {
  const { t } = useLanguage();
  
  const stats = [
    { icon: Home, value: "500+", label: t('propertiesSold') },
    { icon: Users, value: "1000+", label: t('happyClients') },
    { icon: Award, value: "15+", label: t('yearsExperience') },
    { icon: TrendingUp, value: "98%", label: t('customerSatisfaction') },
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
              <Link to="/buy" className="hover:text-accent transition-colors">{t('buy')}</Link>
              <Link to="/rent" className="hover:text-accent transition-colors">{t('rent')}</Link>
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
          <h1 className="text-5xl font-bold mb-6">{t('aboutEstateHub')}</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {t('trustedPartner')}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-6">{t('ourStory')}</h2>
            <p className="text-muted-foreground text-lg mb-6">
              {t('storyText1')}
            </p>
            <p className="text-muted-foreground text-lg">
              {t('storyText2')}
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
          <h2 className="text-4xl font-bold text-foreground text-center mb-12">{t('ourValues')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 border-border">
              <h3 className="text-2xl font-semibold text-foreground mb-3">{t('integrity')}</h3>
              <p className="text-muted-foreground">
                {t('integrityText')}
              </p>
            </Card>
            <Card className="p-8 border-border">
              <h3 className="text-2xl font-semibold text-foreground mb-3">{t('excellence')}</h3>
              <p className="text-muted-foreground">
                {t('excellenceText')}
              </p>
            </Card>
            <Card className="p-8 border-border">
              <h3 className="text-2xl font-semibold text-foreground mb-3">{t('community')}</h3>
              <p className="text-muted-foreground">
                {t('communityText')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[image:var(--gradient-hero)] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">{t('readyToStart')}</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            {t('findPropertyTogether')}
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/contact">{t('contactUsToday')}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
