import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'al' ? 'al' : 'en')}
      className="gap-2 text-accent hover:text-accent/80 hover:bg-accent/10 font-semibold"
    >
      <Globe className="w-4 h-4" />
      {language === 'en' ? 'AL' : 'EN'}
    </Button>
  );
};

export default LanguageSwitcher;
