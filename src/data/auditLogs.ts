import { AuditLog } from './types';
export const mockAuditLogs: AuditLog[] = Array.from({ length: 20 }, (_, i) => ({
  id: `log-${i + 1}`, userId: 'admin-1', userName: 'Admin', userRole: 'admin',
  action: 'LOGIN', entity: 'User', entityId: 'admin-1', ipAddress: '127.0.0.1', timestamp: new Date().toISOString()
}));