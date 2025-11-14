import { usePage } from '@inertiajs/react';
import en from '../../lang/en.json';
import kh from '../../lang/kh.json';

// Available translations
const translations = {
  en,
  kh,
};

export default function useTranslation() {
  // Get the current locale from Inertia's page props
  const { locale } = usePage().props;

  // Set the default language as 'kh' (Khmer) if no locale is set
  const currentLocale = locale || 'en'; // fallback to 'en' (English)

  // Translate function to return the translated value for a key
  const t = (key: string): string => {
    return translations[currentLocale]?.[key] || key; // If translation not found, return the key
  };

  return { t, currentLocale };
}
