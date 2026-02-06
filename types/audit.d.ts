/**
 * Audit Log Type Definitions
 */

export type AuditAction =
    | 'create'
    | 'read'
    | 'update'
    | 'delete'
    | 'login'
    | 'logout'
    | 'export'
    | 'import'
    | 'view'
    | 'relationship';

export type AuditTargetType = 'artefact' | 'user' | 'relationship' | 'report' | 'system';

export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';

export type AuditLog = {
    id: string;
    timestamp: string;
    action: AuditAction;
    target: string;
    targetType: AuditTargetType;
    user: string; // User Name
    userId?: string;
    userRole: string;
    department?: string;
    details?: string;
    ipAddress: string;
    userAgent?: string;
    sessionId?: string;
    severity?: AuditSeverity;
    metadata?: Record<string, unknown>;
};

export type AuditLogFilter = {
    userId?: string;
    action?: AuditAction;
    module?: string;
    severity?: AuditSeverity;
    startDate?: string;
    endDate?: string;
};
