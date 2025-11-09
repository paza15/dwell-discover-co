import { Card } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AgentCardProps {
  name: string;
  role: string;
  image: string;
  email: string;
  phone: string;
  description: string;
}

const AgentCard = ({ name, role, image, email, phone, description }: AgentCardProps) => {
  const { language } = useLanguage();
  
  // Parse description if it's JSON format with translations
  let displayDescription = description;
  try {
    const parsed = JSON.parse(description);
    if (parsed.en && parsed.al) {
      displayDescription = language === 'en' ? parsed.en : parsed.al;
    }
  } catch {
    // If not JSON, use as-is
    displayDescription = description;
  }

  return (
    <Card className="overflow-hidden hover:shadow-[var(--shadow-elevated)] transition-[var(--transition-smooth)]">
      <div className="relative h-80 overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover object-top"
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-1 text-foreground">{name}</h3>
        <p className="text-primary font-semibold mb-4">{role}</p>
        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{displayDescription}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4 text-primary" />
            <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
              {email}
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4 text-primary" />
            <a href={`tel:${phone}`} className="hover:text-primary transition-colors">
              {phone}
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AgentCard;
