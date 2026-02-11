export interface AllowedPair {
    source_category_id: number | null;
    target_category_id: number | null;
}

export interface RelType {
    id: number;
    relationshipKey: string;
    relationshipName: { en: string; th: string };
    description?: { en?: string; th?: string } | null;
    allowedPairs: AllowedPair[];
    isActive: boolean;
    _count?: { relationships: number };
}

export interface ApiCategory {
    id: number;
    categoryName: { en: string; th: string } | string;
    architectureLayer?: { id: number; layerName: { en: string; th: string } | string };
}

/** Small helper to safely read i18n JSON fields. */
export const getLoc = (v: unknown, lang: 'en' | 'th' = 'en'): string => {
    if (!v) return '';
    if (typeof v === 'string') return v;
    if (typeof v === 'object' && v !== null) {
        const obj = v as Record<string, string>;
        return obj[lang] || obj['en'] || obj['th'] || '';
    }
    return '';
};

