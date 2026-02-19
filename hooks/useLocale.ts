'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type LocaleNamespace = 
  | 'common'
  | 'nav'
  | 'system'
  | 'dashboard'
  | 'artefact'
  | 'artefacts'
  | 'status'
  | 'impact'
  | 'lang'
  | 'graph'
  | 'detail'
  | 'versionHistory'
  | 'table';

/**
 * Returns resolved strings for the given namespace.
 * Direct attribute access - no t() or string keys.
 *
 * const loc = useLocale('artefacts')
 * <button>{loc.addArtefact}</button>
 */
export function useLocale<N extends LocaleNamespace>(namespace: N) {
  const { t } = useTranslation();
  
  return useMemo(() => {
    // Create a proxy that resolves keys dynamically
    return new Proxy({} as Record<string, string>, {
      get(_target, prop: string | symbol) {
        if (typeof prop === 'string') {
          return t(`${namespace}.${prop}`);
        }
        return undefined;
      },
      ownKeys() {
        // Return empty array - we can't know keys at compile time
        // This is fine since we're using Proxy for dynamic access
        return [];
      },
      has(_target, prop: string | symbol) {
        return typeof prop === 'string';
      },
    });
  }, [namespace, t]);
}
