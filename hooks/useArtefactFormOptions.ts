'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ApiLayer, ApiUser, ApiDepartment } from '@/types/artefact-api';

type Cache = {
  users: ApiUser[];
  departments: ApiDepartment[];
  layers: ApiLayer[];
};

let cache: Cache | null = null;
let fetchPromise: Promise<Cache> | null = null;

function fetchOptions(): Promise<Cache> {
  if (cache) return Promise.resolve(cache);
  if (fetchPromise) return fetchPromise;
  fetchPromise = (async () => {
    const [uRes, dRes, lRes] = await Promise.all([
      fetch('/api/v1/users'),
      fetch('/api/v1/departments'),
      fetch('/api/v1/architecture-layers'),
    ]);
    const [uJson, dJson, lJson] = await Promise.all([uRes.json(), dRes.json(), lRes.json()]);
    cache = {
      users: uJson.success ? uJson.data : [],
      departments: dJson.success ? dJson.data : [],
      layers: lJson.success ? lJson.data : [],
    };
    return cache;
  })();
  return fetchPromise;
}

/**
 * Shared hook for users, departments, architecture layers.
 * Prefetch on page load → Edit/Create modal opens with cached data (no skeleton delay).
 */
export function useArtefactFormOptions() {
  const [data, setData] = useState<Cache | null>(() => cache);
  const [loading, setLoading] = useState(() => !cache);

  useEffect(() => {
    fetchOptions().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);

  const refresh = useCallback(() => {
    cache = null;
    fetchPromise = null;
    setData(null);
    setLoading(true);
    fetchOptions().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);

  return {
    users: data?.users ?? [],
    departments: data?.departments ?? [],
    layers: data?.layers ?? [],
    loading,
    refresh,
  };
}
