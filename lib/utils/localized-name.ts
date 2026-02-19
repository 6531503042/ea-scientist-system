/**
 * Localized Name Utility
 * Safely read i18n JSON fields (e.g. { en: "...", th: "..." })
 */

export type Localizable = { en?: string; th?: string } | string | null | undefined;

/**
 * Extract localized string from JSON or plain string.
 * @param val - Localized object or string
 * @param lang - Language key ('en' | 'th')
 * @returns The string value
 */
export function getLocalizedName(val: Localizable, lang: 'en' | 'th' = 'en'): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  const obj = val as Record<string, string>;
  return obj[lang] || obj.en || obj.th || '';
}
