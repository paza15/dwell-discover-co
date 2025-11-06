import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white p-2"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/10 z-50">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            <Link
              to="/buy"
              className="text-white hover:text-accent transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              {t('buy')}
            </Link>
            <Link
              to="/rent"
              className="text-white hover:text-accent transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              {t('rent')}
            </Link>
            <Link
              to="/blog"
              className="text-white hover:text-accent transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              {t('blog')}
            </Link>
            <Link
              to="/about"
              className="text-white hover:text-accent transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              {t('about')}
            </Link>
            <Link
              to="/auth"
              className="text-white/80 hover:text-accent transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              {t('ownerPortal')}
            </Link>
            <div className="py-2">
              <LanguageSwitcher />
            </div>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
              <Link to="/contact" onClick={() => setIsOpen(false)}>
                {t('contactUs')}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
