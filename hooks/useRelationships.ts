"use client";

import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { Relationship, RelationshipType } from "@/types/artefact";

const relationshipTypeMap: Record<string, RelationshipType> = {
  uses: "uses",
  depends_on: "depends_on",
  dependson: "depends_on",
  manages: "manages",
  integrates_with: "integrates_with",
  integrateswith: "integrates_with",
  supports: "supports",
};

const relationshipLabelMap: Record<RelationshipType, string> = {
  uses: "Uses",
  depends_on: "Depends On",
  manages: "Manages",
  integrates_with: "Integrates With",
  supports: "Supports",
};

function getLocalizedValue(
  value: unknown,
  language: "en" | "th" = "en",
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const localized = value as Record<string, string>;
    return localized[language] || localized.en || localized.th || "";
  }

  return "";
}

function normalizeRelationshipType(apiRelationship: any): RelationshipType {
  const rawKey = String(
    apiRelationship.relationshipType?.key ||
      apiRelationship.relationshipType?.relationshipKey ||
      apiRelationship.relationshipKey ||
      getLocalizedValue(
        apiRelationship.relationshipType?.relationshipName,
        "en",
      ) ||
      getLocalizedValue(apiRelationship.relationshipType?.name, "en") ||
      apiRelationship.type ||
      "",
  )
    .toLowerCase()
    .replace(/\s+/g, "_");

  return relationshipTypeMap[rawKey.replace(/[^a-z_]/g, "")] || "supports";
}

function transformApiRelationship(apiRelationship: any): Relationship {
  const type = normalizeRelationshipType(apiRelationship);
  const label =
    getLocalizedValue(
      apiRelationship.relationshipType?.relationshipName,
      "en",
    ) ||
    getLocalizedValue(apiRelationship.relationshipType?.name, "en") ||
    relationshipLabelMap[type];

  return {
    id: apiRelationship.id?.toString() ?? "",
    source:
      apiRelationship.sourceArtefactId?.toString() ??
      apiRelationship.sourceArtefact?.id?.toString() ??
      "",
    target:
      apiRelationship.targetArtefactId?.toString() ??
      apiRelationship.targetArtefact?.id?.toString() ??
      "",
    type,
    label,
  };
}

function toNumericId(value: string): number {
  if (!/^\d+$/.test(value)) {
    throw new Error("Relationship changes require persisted artefact IDs.");
  }

  return Number(value);
}

function normalizeRelationshipKey(value: unknown): string {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

export function useRelationships() {
  const queryClient = useQueryClient();

  const {
    data: relationships = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery<Relationship[]>({
    queryKey: queryKeys.relationships.all,
    queryFn: async () => {
      const data = await apiClient.get<any[]>("/api/v1/relationships");
      return data.map(transformApiRelationship);
    },
  });

  const { data: relationshipTypes = [] } = useQuery<any[]>({
    queryKey: queryKeys.relationshipTypes.all,
    queryFn: async () => {
      return apiClient.get<any[]>("/api/v1/relationship-types");
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async ({
      source,
      target,
      type = "depends_on",
    }: {
      source: string;
      target: string;
      type?: RelationshipType;
    }) => {
      const normalizedType = normalizeRelationshipKey(type);
      const activeTypes = relationshipTypes.filter(
        (t) => t?.isActive !== false,
      );
      const selectedType =
        activeTypes.find(
          (t) =>
            normalizeRelationshipKey(t?.relationshipKey || t?.key) ===
            normalizedType,
        ) || activeTypes[0];

      if (!selectedType?.id) {
        throw new Error("No active relationship type available.");
      }

      const created = await apiClient.post<any>("/api/v1/relationships", {
        sourceArtefactId: toNumericId(source),
        targetArtefactId: toNumericId(target),
        relationshipTypeId: Number(selectedType.id),
        status: "ACTIVE",
      });

      return transformApiRelationship(created);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.relationships.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (relationshipId: string) => {
      const numericId = toNumericId(relationshipId);
      await apiClient.delete(`/api/v1/relationships/${numericId}`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.relationships.all });
    },
  });

  const getRelationshipsByArtefactId = useCallback(
    (artefactId: string) => {
      return relationships.filter(
        (relationship) =>
          relationship.source === artefactId ||
          relationship.target === artefactId,
      );
    },
    [relationships],
  );

  return {
    relationships,
    loading: isLoading,
    error: queryError?.message || null,
    refetch,
    createRelationship: createMutation.mutateAsync,
    deleteRelationship: deleteMutation.mutateAsync,
    relationshipMutationLoading:
      createMutation.isPending || deleteMutation.isPending,
    getRelationshipsByArtefactId,
  };
}
