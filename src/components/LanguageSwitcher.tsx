import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'sq' : 'en')}
      className="gap-2"
    >
      <Globe className="w-4 h-4" />
      {language === 'en' ? 'SQ' : 'EN'}
    </Button>
  );
};

export default LanguageSwitcher;
