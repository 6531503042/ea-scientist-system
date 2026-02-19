/**
 * API response types for Artefact-related endpoints
 * Used by CreateArtefactModal, EditArtefactModal, RelationshipRulePairSheet
 */

import type { LocalizedName } from './artefact-type';

export interface ApiLayer {
  id: number;
  layerName: LocalizedName | string;
  artefactCategories?: ApiCategory[];
}

export interface ApiCategory {
  id: number;
  categoryName: LocalizedName | string;
  architectureLayerId?: number;
  architectureLayer?: { id: number; layerName: LocalizedName | string };
}

export interface ApiUser {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
}

export interface ApiDepartment {
  id: number;
  shortName: string;
  fullName: string;
}
