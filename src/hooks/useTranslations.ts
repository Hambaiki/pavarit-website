import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface TranslationResponse {
  error_code: string;
  error_desc: string;
  translators: TranslationItem[];
}

interface TranslationItem {
  key: string;
  value_th: string;
  value_en: string;
}

export interface Translations {
  [key: string]: string;
}

/**
 * Global Cache (translationCache):
 * translationCache stores translations for each sheet and locale with a timestamp.
 * The cache is checked before fetching new data.
 *
 * Stale Data Check:
 * If the cache contains fresh data (based on refetchIntervalMs), it is used instead of making a network request.
 *
 * Optional Auto-Refetch:
 * If refetchIntervalMs is provided, the hook will automatically refetch translations at the specified interval.
 * An intervalId is set to repeatedly fetch translations and is cleared on component unmount.
 *
 * Locale-Aware Caching:
 * Cache keys are locale-specific (e.g., sheetName-locale), ensuring that translations are correctly fetched and stored for different languages.
 */

// Cache for translations and timestamps
const translationCache = new Map<
  string,
  { translations: Translations; timestamp: number }
>();

export const getTranslations = async (
  sheetName: string
): Promise<TranslationResponse> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_THONBURI_BASE_URL}/api/v1/appointment/get_translation`,
      { sheet_name: sheetName }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return {
      error_code: "99",
      error_desc: "Something went wrong",
      translators: [],
    };
  }
};

export const useTranslations = (
  sheetName: string,
  initialTranslations?: Translations,
  refetchIntervalMs?: number // Optional refetch interval in milliseconds
) => {
  const { locale } = useRouter();
  const [translations, setTranslations] = useState<Translations>(
    initialTranslations || {}
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      setLoading(true);
      setError(null);

      try {
        const now = Date.now();
        const cacheKey = `${sheetName}-${locale}`;
        const cachedData = translationCache.get(cacheKey);

        // If cached data exists and is not stale, use it
        if (
          cachedData &&
          now - cachedData.timestamp < (refetchIntervalMs || Infinity)
        ) {
          setTranslations(cachedData.translations);
          setLoading(false);
          return;
        }

        // Fetch new data if no cache or cache is stale
        const data = await getTranslations(sheetName);
        const formattedTranslations = data.translators.reduce<Translations>(
          (acc, item) => {
            acc[item.key] = locale === "th" ? item.value_th : item.value_en;
            return acc;
          },
          {}
        );

        // Update cache
        translationCache.set(cacheKey, {
          translations: formattedTranslations,
          timestamp: now,
        });

        setTranslations(formattedTranslations);
      } catch (err: any) {
        setError(err.message || "Failed to load translations");
      } finally {
        setLoading(false);
      }
    };

    fetchTranslations();

    // Set up auto-refetch if refetchIntervalMs is specified
    let intervalId: NodeJS.Timeout | null = null;
    if (refetchIntervalMs) {
      intervalId = setInterval(fetchTranslations, refetchIntervalMs);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [sheetName, locale, refetchIntervalMs]);

  const t = (key: string, placeholder?: string) => {
    if (loading) {
      return placeholder || key; // Return the placeholder if loading, or the key if no placeholder
    }

    let translation = translations[key] || placeholder || key;

    return translation;
  };

  return { t, loading, error, locale };
};
