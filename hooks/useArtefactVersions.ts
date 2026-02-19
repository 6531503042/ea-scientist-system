'use client';

import { useState, useCallback, useEffect } from 'react';
import { getLocalizedName } from '@/lib/utils';

export interface VersionDisplay {
  id: string;
  version: string;
  changes: string;
  changedBy: string;
  changedAt: string;
  previousVersion: string | null;
}

interface ApiVersion {
  id: number;
  artefactId: number;
  versionNumber: number;
  changeSummary?: { en?: string; th?: string } | string | null;
  createdAt: string;
}

function mapApiVersionToDisplay(v: ApiVersion): VersionDisplay {
  const changes = typeof v.changeSummary === 'string'
    ? v.changeSummary
    : getLocalizedName(v.changeSummary as { en?: string; th?: string }, 'th') || '—';
  const changedAt = new Date(v.createdAt).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return {
    id: String(v.id),
    version: String(v.versionNumber),
    changes,
    changedBy: '—',
    changedAt,
    previousVersion: v.versionNumber > 1 ? String(v.versionNumber - 1) : null,
  };
}

export function useArtefactVersions(artefactId: string | null, isOpen: boolean) {
  const [versions, setVersions] = useState<VersionDisplay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVersions = useCallback(async () => {
    if (!artefactId || !isOpen) {
      setVersions([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/artefacts/${artefactId}`);
      const json = await res.json();
      if (!json.success || !json.data) {
        setVersions([]);
        return;
      }
      const rawVersions = (json.data.artefactVersions || []) as ApiVersion[];
      setVersions(rawVersions.map(mapApiVersionToDisplay));
    } catch {
      setError('Failed to load versions');
      setVersions([]);
    } finally {
      setLoading(false);
    }
  }, [artefactId, isOpen]);

  useEffect(() => {
    if (isOpen && artefactId) {
      fetchVersions();
    } else {
      setVersions([]);
    }
  }, [isOpen, artefactId, fetchVersions]);

  return { versions, loading, error, refresh: fetchVersions };
}
