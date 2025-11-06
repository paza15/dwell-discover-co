import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'sq';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    buy: 'Buy',
    rent: 'Rent',
    about: 'About',
    contactUs: 'Contact Us',
    ownerPortal: 'Owner Portal',
    blog: 'Blog',
    blogTitle: 'Real Estate Insights & News',
    blogSubtitle: 'Stay informed with the latest trends, tips, and market updates from our expert team',
    readMore: 'Read More',

    // Hero
    findDreamHome: 'Find Your Dream Home',
    discoverProperty: 'Discover the perfect property that matches your lifestyle and budget',
    search: 'Search',
    searchPlaceholder: 'Enter location, property type, or keyword...',
    forSale: 'For Sale',
    forRent: 'For Rent',
    newListings: 'New Listings',

    // Filters
    filters: 'Filters',
    priceRange: 'Price Range',
    minPrice: 'Min Price',
    maxPrice: 'Max Price',
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    propertyType: 'Property Type',
    allTypes: 'All Types',
    house: 'House',
    apartment: 'Apartment',
    condo: 'Condo',
    villa: 'Villa',
    clearFilters: 'Clear Filters',
    applyFilters: 'Apply Filters',

    // Property
    beds: 'Beds',
    baths: 'Baths',
    sqft: 'sqft',
    viewDetails: 'View Details',
    backToListings: 'Back to Listings',
    description: 'Description',
    noDescription: 'No description available for this property.',
    ourAgents: 'Our Real Estate Agents',
    ourAgentsDescription: 'Meet our experienced team of real estate professionals ready to help you find your perfect property.',

    // Buy Page
    propertiesForSale: 'Properties For Sale',
    dreamHomeDescription: 'Discover your dream home from our curated collection of premium properties',
    loadingProperties: 'Loading properties...',
    noPropertiesForSale: 'No properties available for sale at the moment.',

    // Rent Page
    propertiesForRent: 'Properties For Rent',
    rentalDescription: 'Find the perfect rental property that feels like home',
    noPropertiesForRent: 'No properties available for rent at the moment.',

    // About Page
    aboutEstateHub: 'About EstateHub',
    trustedPartner: 'Your trusted partner in finding the perfect property',
    ourStory: 'Our Story',
    storyText1: 'Founded in 2010, EstateHub has been helping families and individuals find their dream homes for over a decade. Our commitment to excellence and personalized service has made us one of the most trusted names in real estate.',
    storyText2: 'We believe that finding a home is more than just a transaction—it\'s about finding a place where memories are made and futures are built. Our team of dedicated professionals works tirelessly to ensure every client finds exactly what they\'re looking for.',
    propertiesSold: 'Properties Sold',
    happyClients: 'Happy Clients',
    yearsExperience: 'Years Experience',
    customerSatisfaction: 'Customer Satisfaction',
    ourValues: 'Our Values',
    integrity: 'Integrity',
    integrityText: 'We uphold the highest standards of honesty and transparency in every interaction.',
    excellence: 'Excellence',
    excellenceText: 'We strive for excellence in every service we provide, ensuring the best outcomes for our clients.',
    community: 'Community',
    communityText: 'We\'re committed to building stronger communities, one home at a time.',
    readyToStart: 'Ready to Get Started?',
    findPropertyTogether: 'Let\'s find your perfect property together',
    contactUsToday: 'Contact Us Today',

    // Contact Page
    getInTouch: 'Get In Touch',
    loveToHear: 'We\'d love to hear from you. Let us know how we can help.',
    contactInformation: 'Contact Information',
    reachOut: 'Reach out to us through any of these channels, or fill out the form and we\'ll get back to you shortly.',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    sendMessage: 'Send Us a Message',
    name: 'Name',
    yourName: 'Your name',
    yourEmail: 'your.email@example.com',
    message: 'Message',
    tellUsHow: 'Tell us how we can help you...',
    sendMessageBtn: 'Send Message',
    visitOffice: 'Visit Our Office',
    messageSent: 'Message sent!',
    getBackSoon: 'We\'ll get back to you as soon as possible.',
    messageFailed: 'Unable to send message',
    pleaseTryAgain: 'Please try again or reach out through another channel.',
    sendingMessage: 'Sending...',
  },
  sq: {
    // Navigation
    buy: 'Blej',
    rent: 'Qira',
    about: 'Rreth Nesh',
    contactUs: 'Na Kontaktoni',
    ownerPortal: 'Portali i Pronarit',
    blog: 'Blogu',
    blogTitle: 'Njohuri dhe Lajme për Pasuritë e Paluajtshme',
    blogSubtitle: 'Qëndroni të informuar me tendencat, këshillat dhe përditësimet më të fundit të tregut nga ekipi ynë ekspert',
    readMore: 'Lexo Më Shumë',

    // Hero
    findDreamHome: 'Gjeni Shtëpinë e Ëndrrave',
    discoverProperty: 'Zbuloni pronën perfekte që përputhet me stilin tuaj të jetesës dhe buxhetin',
    search: 'Kërko',
    searchPlaceholder: 'Vendndodhje, lloj prone ose fjalë kyçe...',
    forSale: 'Për Shitje',
    forRent: 'Për Qira',
    newListings: 'Shpallje të Reja',

    // Filters
    filters: 'Filtrat',
    priceRange: 'Rangu i Çmimit',
    minPrice: 'Çmimi Min',
    maxPrice: 'Çmimi Max',
    bedrooms: 'Dhoma Gjumi',
    bathrooms: 'Banjo',
    propertyType: 'Lloji i Pronës',
    allTypes: 'Të Gjitha Llojet',
    house: 'Shtëpi',
    apartment: 'Apartament',
    condo: 'Kondo',
    villa: 'Vilë',
    clearFilters: 'Pastro Filtrat',
    applyFilters: 'Apliko Filtrat',

    // Property
    beds: 'Shtretër',
    baths: 'Banjo',
    sqft: 'm²',
    viewDetails: 'Shiko Detajet',
    backToListings: 'Kthehu te Listat',
    description: 'Përshkrimi',
    noDescription: 'Nuk ka përshkrim të disponueshëm për këtë pronë.',
    ourAgents: 'Agjentët Tanë të Pasurive të Paluajtshme',
    ourAgentsDescription: 'Njihuni me ekipin tonë të përvuarëshem të profesionistëve të pasurive të paluajtshme të gatshëm t\'ju ndihmojnë të gjeni pronën tuaj të përsosur.',

    // Buy Page
    propertiesForSale: 'Prona Për Shitje',
    dreamHomeDescription: 'Zbuloni shtëpinë e ëndrrave tuaja nga koleksioni ynë i pronave premium',
    loadingProperties: 'Po ngarkohen pronat...',
    noPropertiesForSale: 'Nuk ka prona të disponueshme për shitje në këtë moment.',

    // Rent Page
    propertiesForRent: 'Prona Për Qira',
    rentalDescription: 'Gjeni pronën perfekte për qira që të ndihet si shtëpia juaj',
    noPropertiesForRent: 'Nuk ka prona të disponueshme për qira në këtë moment.',

    // About Page
    aboutEstateHub: 'Rreth EstateHub',
    trustedPartner: 'Partneri juaj i besuar në gjetjen e pronës perfekte',
    ourStory: 'Historia Jonë',
    storyText1: 'E themeluar në 2010, EstateHub ka ndihmuar familje dhe individë të gjejnë shtëpitë e tyre të ëndrrave për më shumë se një dekadë. Përkushtimi ynë ndaj përsosmërisë dhe shërbimit të personalizuar na ka bërë një nga emrat më të besueshëm në pasuritë e paluajtshme.',
    storyText2: 'Ne besojmë se gjetja e një shtëpie është më shumë se një transaksion—bëhet fjalë për gjetjen e një vendi ku krijohen kujtime dhe ndërtohen e ardhmja. Ekipi ynë i profesionistëve të dedikuar punon pa lodhje për të siguruar që çdo klient të gjejë saktësisht atë që kërkon.',
    propertiesSold: 'Prona të Shitura',
    happyClients: 'Klientë të Kënaqur',
    yearsExperience: 'Vite Eksperiencë',
    customerSatisfaction: 'Kënaqësi e Klientit',
    ourValues: 'Vlerat Tona',
    integrity: 'Integriteti',
    integrityText: 'Ne mbajmë standardet më të larta të ndershmërisë dhe transparencës në çdo ndërveprim.',
    excellence: 'Përkryerja',
    excellenceText: 'Ne përpiqemi për përsosmëri në çdo shërbim që ofrojmë, duke siguruar rezultatet më të mira për klientët tanë.',
    community: 'Komuniteti',
    communityText: 'Ne jemi të përkushtuar për ndërtimin e komuniteteve më të forta, një shtëpi në një kohë.',
    readyToStart: 'Gati për të Filluar?',
    findPropertyTogether: 'Le të gjejmë pronën tuaj perfekte së bashku',
    contactUsToday: 'Na Kontaktoni Sot',

    // Contact Page
    getInTouch: 'Na Kontaktoni',
    loveToHear: 'Do të donim të dëgjonim nga ju. Na tregoni se si mund t\'ju ndihmojmë.',
    contactInformation: 'Informacion Kontakti',
    reachOut: 'Na kontaktoni përmes ndonjërit prej këtyre kanaleve, ose plotësoni formularin dhe ne do t\'ju përgjigjemi së shpejti.',
    phone: 'Telefon',
    email: 'Email',
    address: 'Adresa',
    sendMessage: 'Dërgoni një Mesazh',
    name: 'Emri',
    yourName: 'Emri juaj',
    yourEmail: 'email.juaj@shembull.com',
    message: 'Mesazhi',
    tellUsHow: 'Na tregoni se si mund t\'ju ndihmojmë...',
    sendMessageBtn: 'Dërgo Mesazhin',
    visitOffice: 'Vizitoni Zyrën Tonë',
    messageSent: 'Mesazhi u dërgua!',
    getBackSoon: 'Ne do t\'ju përgjigjemi sa më shpejt të jetë e mundur.',
    messageFailed: 'Mesazhi nuk mund të dërgohej',
    pleaseTryAgain: 'Ju lutemi provoni përsëri ose na kontaktoni në një mënyrë tjetër.',
    sendingMessage: 'Duke dërguar...',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
