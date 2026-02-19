/**
 * Artefact Type Management
 * Architecture Layers (TOGAF) and Artefact Categories
 */

export type LocalizedName = { en: string; th: string };

export interface ArchitectureLayer {
  id: number;
  layerName: LocalizedName | string;
  description?: LocalizedName | string;
  isActive: boolean;
  artefactCategories?: ArtefactCategory[];
}

export interface ArtefactCategory {
  id: number;
  architectureLayerId: number;
  categoryName: LocalizedName | string;
  description?: LocalizedName | string;
  isActive: boolean;
  architectureLayer?: { id: number; layerName: LocalizedName | string };
}
