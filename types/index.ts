/**
 * Central Type Exports
 * Import types from this file for convenience
 */

// User & Auth
export type { User, UserName, UserStatus, CreateUserInput, UpdateUserInput } from './user';
export type { Role, Permission, RoleKey, RoleLabel, RoleLabels } from './role';
export type { Department, CreateDepartmentInput, UpdateDepartmentInput } from './department';

// EA Domain
export type {
    Artefact,
    ArtefactType,
    ArtefactStatus,
    ArtefactClassification,
    ArtefactRelation,
    CreateArtefactInput,
    UpdateArtefactInput,
    BusinessArtefactAttributes,
    ApplicationArtefactAttributes,
    DataArtefactAttributes,
    TechnologyArtefactAttributes,
    SecurityArtefactAttributes,
    IntegrationArtefactAttributes,
} from './artefact';

// Audit
export type { AuditLog, AuditAction, AuditSeverity, AuditLogFilter } from './audit';

// Navigation
export type { NavItem, NavSection, SiteConfig } from './nav';

// WiFi
export type {
    WifiDevice,
    WifiAuthStatus,
    WifiAuthLog,
    WifiAuthFilter,
} from './wifi';
