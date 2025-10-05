import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

export interface FilterValues {
  minPrice: string;
  maxPrice: string;
  beds: string;
  baths: string;
  propertyType: string;
}

interface PropertyFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
}

const PropertyFilters = ({ onFilterChange }: PropertyFiltersProps) => {
  const { t } = useLanguage();
  const [filters, setFilters] = useState<FilterValues>({
    minPrice: '',
    maxPrice: '',
    beds: '',
    baths: '',
    propertyType: '',
  });

  const handleChange = (key: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterValues = {
      minPrice: '',
      maxPrice: '',
      beds: '',
      baths: '',
      propertyType: '',
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <Card className="p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">{t('filters')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">{t('minPrice')}</label>
          <Input
            type="number"
            placeholder="0"
            value={filters.minPrice}
            onChange={(e) => handleChange('minPrice', e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">{t('maxPrice')}</label>
          <Input
            type="number"
            placeholder="1000000"
            value={filters.maxPrice}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">{t('bedrooms')}</label>
          <Select value={filters.beds} onValueChange={(value) => handleChange('beds', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">{t('bathrooms')}</label>
          <Select value={filters.baths} onValueChange={(value) => handleChange('baths', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">{t('propertyType')}</label>
          <Select value={filters.propertyType} onValueChange={(value) => handleChange('propertyType', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('allTypes')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t('allTypes')}</SelectItem>
              <SelectItem value="House">{t('house')}</SelectItem>
              <SelectItem value="Apartment">{t('apartment')}</SelectItem>
              <SelectItem value="Condo">{t('condo')}</SelectItem>
              <SelectItem value="Villa">{t('villa')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-4">
        <Button variant="outline" onClick={clearFilters} className="w-full md:w-auto">
          {t('clearFilters')}
        </Button>
      </div>
    </Card>
  );
};

export default PropertyFilters;
