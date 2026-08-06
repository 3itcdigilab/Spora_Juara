export const logAction = (action: string, details: any) => {
  const log = { action, details, timestamp: new Date().toISOString() };
  const logs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
  logs.push(log);
  localStorage.setItem('auditLogs', JSON.stringify(logs));
};