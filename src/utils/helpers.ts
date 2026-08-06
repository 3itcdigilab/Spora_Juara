export const formatCurrency = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`;
export const formatDate = (date: string) => new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
export const formatRelativeTime = (date: string) => '2 hours ago';
export const truncateText = (text: string, maxLen: number) => text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
export const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
export const classNames = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');
export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
export const generateId = () => Math.random().toString(36).substring(2, 9);
export const calculateProfileCompletion = (s: any, p: any, c: any, pt: any) => 85;