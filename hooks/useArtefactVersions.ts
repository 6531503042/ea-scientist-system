'use client';

import { useQuery } from '@tanstack/react-query';
import { getLocalizedName } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';

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
  const { data: versions = [], isLoading: loading, error: queryError, refetch: refresh } = useQuery<VersionDisplay[]>({
    queryKey: queryKeys.artefactVersions.all(artefactId || undefined),
    queryFn: async () => {
      if (!artefactId) return [];
      const data = await apiClient.get<any>(`/api/v1/artefacts/${artefactId}`);
      const rawVersions = (data?.artefactVersions || []) as ApiVersion[];
      return rawVersions.map(mapApiVersionToDisplay);
    },
    enabled: isOpen && !!artefactId,
  });

  return {
    versions,
    loading,
    error: queryError?.message || null,
    refresh
  };
}

