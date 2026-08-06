import React, { useState, useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { Tabs } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { Bell, Briefcase, FileText, CheckCircle, AlertCircle, Calendar, Trash2, CheckSquare, Square } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { localDB } from '../../services/db';

export const StudentNotifications: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('All');
  const [refreshKey, setRefreshKey] = useState(0);

  // Selected notifications state for bulk delete
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const notifications = useMemo(() => {
    return localDB.getNotifications(user?.email || 'student-1');
  }, [user, refreshKey]);

  const handleMarkAllRead = () => {
    notifications.forEach((n: any) => {
      localDB.markNotificationRead(n.id);
    });
    setRefreshKey(k => k + 1);
    showToast('Semua notifikasi ditandai sebagai dibaca.', 'info');
  };

  const handleCardClick = (notifId: string) => {
    localDB.markNotificationRead(notifId);
    setRefreshKey(k => k + 1);
  };

  const handleDeleteSingle = (e: React.MouseEvent, notifId: string) => {
    e.stopPropagation();
    localDB.deleteNotification(notifId);
    setSelectedIds(prev => prev.filter(id => id !== notifId));
    setRefreshKey(k => k + 1);
    showToast('Notifikasi berhasil dihapus.', 'warning');
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Yakin ingin menghapus ${selectedIds.length} notifikasi terpilih?`)) {
      localDB.deleteMultipleNotifications(selectedIds);
      setSelectedIds([]);
      setRefreshKey(k => k + 1);
      showToast(`${selectedIds.length} notifikasi berhasil dihapus.`, 'warning');
    }
  };

  const handleClearAll = () => {
    if (notifications.length === 0) return;
    if (window.confirm('Yakin ingin menghapus seluruh notifikasi?')) {
      localDB.clearAllNotifications(user?.email || 'student-1');
      setSelectedIds([]);
      setRefreshKey(k => k + 1);
      showToast('Seluruh notifikasi telah dibersihkan.', 'warning');
    }
  };

  const toggleSelect = (e: React.MouseEvent, notifId: string) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(notifId) ? prev.filter(id => id !== notifId) : [...prev, notifId]
    );
  };

  const filteredNotifs = useMemo(() => {
    return notifications.filter((n: any) => {
      if (activeTab === 'All') return true;
      if (activeTab === 'Application') return n.type === 'status' || n.type === 'invite' || n.type === 'feedback';
      if (activeTab === 'Assessment') return n.type === 'reminder';
      return true;
    });
  }, [notifications, activeTab]);

  const isAllFilteredSelected = useMemo(() => {
    if (filteredNotifs.length === 0) return false;
    return filteredNotifs.every((n: any) => selectedIds.includes(n.id));
  }, [filteredNotifs, selectedIds]);

  const toggleSelectAllFiltered = () => {
    if (isAllFilteredSelected) {
      const filteredIds = filteredNotifs.map((n: any) => n.id);
      setSelectedIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      const filteredIds = filteredNotifs.map((n: any) => n.id);
      const combined = new Set([...selectedIds, ...filteredIds]);
      setSelectedIds(Array.from(combined));
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10 space-y-6 font-sans">
      {/* Page Header & Bulk Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-xs text-slate-500">Pembaruan waktu nyata mengenai lamaran, wawancara, dan hasil seleksi industri.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {selectedIds.length > 0 && (
            <Button 
              size="sm" 
              variant="danger" 
              onClick={handleDeleteSelected}
              className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 px-3 py-1.5"
            >
              <Trash2 size={14} /> Hapus Terpilih ({selectedIds.length})
            </Button>
          )}

          {notifications.length > 0 && (
            <>
              <button 
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-[#0099B8] hover:underline bg-cyan-50 px-3 py-1.5 rounded-lg border border-cyan-200"
              >
                Mark all as read
              </button>

              <button 
                onClick={handleClearAll}
                className="text-xs font-bold text-slate-500 hover:text-red-600 hover:underline px-2 py-1.5"
              >
                Clear All
              </button>
            </>
          )}
        </div>
      </div>

      <Tabs 
        tabs={[
          { id: 'All', label: `All (${notifications.length})` },
          { id: 'Application', label: 'Applications & Status' },
          { id: 'Assessment', label: 'Assessments' },
          { id: 'System', label: 'System Updates' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Select All Checkbox Bar */}
      {filteredNotifs.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600">
          <button 
            onClick={toggleSelectAllFiltered}
            className="flex items-center gap-2 hover:text-slate-900 transition-colors"
          >
            {isAllFilteredSelected ? (
              <CheckSquare size={16} className="text-[#0099B8]" />
            ) : (
              <Square size={16} className="text-slate-400" />
            )}
            <span>Pilih Semua Notifikasi Kategori Ini</span>
          </button>
          <span>{selectedIds.length} dipilih</span>
        </div>
      )}

      {/* Notification Cards List */}
      <div className="space-y-3">
        {filteredNotifs.map((n: any) => {
          let Icon = Bell;
          let colorBg = 'bg-slate-100 text-slate-500';

          if (n.type === 'invite') {
            Icon = Calendar;
            colorBg = 'bg-violet-100 text-violet-700';
          } else if (n.type === 'feedback') {
            Icon = AlertCircle;
            colorBg = 'bg-red-100 text-red-600';
          } else if (n.type === 'status') {
            Icon = Briefcase;
            colorBg = 'bg-cyan-100 text-[#0099B8]';
          }

          const isSelected = selectedIds.includes(n.id);

          return (
            <Card 
              key={n.id} 
              onClick={() => handleCardClick(n.id)}
              className={`p-4 flex items-start gap-3 transition-all hover:shadow-md cursor-pointer border-slate-200 ${
                !n.isRead ? 'bg-cyan-50/30 border-cyan-200' : 'bg-white'
              } ${isSelected ? 'ring-2 ring-[#0099B8] bg-cyan-50/40' : ''}`}
            >
              {/* Individual Select Checkbox */}
              <button 
                onClick={(e) => toggleSelect(e, n.id)}
                className="mt-1 text-slate-400 hover:text-[#0099B8] transition-colors p-0.5 shrink-0"
              >
                {isSelected ? (
                  <CheckSquare size={18} className="text-[#0099B8]" />
                ) : (
                  <Square size={18} />
                )}
              </button>

              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorBg}`}>
                <Icon size={20} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1 gap-2">
                  <h4 className={`text-sm leading-snug ${!n.isRead ? 'font-extrabold text-slate-900' : 'font-semibold text-slate-700'}`}>
                    {n.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap font-mono shrink-0">
                    {n.createdAt ? n.createdAt.split('T')[0] : 'Today'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
              </div>

              {/* Unread indicator & Delete Icon */}
              <div className="flex items-center gap-2 shrink-0 self-center">
                {!n.isRead && <div className="w-2.5 h-2.5 bg-[#0099B8] rounded-full animate-pulse"></div>}
                
                <button 
                  onClick={(e) => handleDeleteSingle(e, n.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus notifikasi ini"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          );
        })}

        {filteredNotifs.length === 0 && (
          <Card className="p-12 text-center text-slate-500 border-slate-200">
            <Bell size={36} className="mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-slate-700">Belum Ada Notifikasi</p>
            <p className="text-xs text-slate-400 mt-1">Notifikasi mengenai status lamaran dan wawancara industri akan muncul di sini secara otomatis.</p>
          </Card>
        )}
      </div>
    </div>
  );
};
