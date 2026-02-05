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
    | 'import';

export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';

export type AuditLog = {
    _id: string;
    timestamp: string;
    userId: string;
    userName: string;
    userRole?: string;
    action: AuditAction;
    module: string;
    resourceType?: string;
    resourceId?: string;
    resourceName?: string;
    description: string;
    ipAddress?: string;
    userAgent?: string;
    severity: AuditSeverity;
    changes?: {
        before?: Record<string, unknown>;
        after?: Record<string, unknown>;
    };
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
