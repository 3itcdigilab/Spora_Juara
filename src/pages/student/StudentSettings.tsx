import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Bell, Trash2 } from 'lucide-react';

export const StudentSettings: React.FC = () => {
  const { showToast } = useToast();
  const { logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [notifs, setNotifs] = useState({
    assessmentReminders: true,
    jobRecommendations: true,
    applicationUpdates: true,
    interviewInvites: true
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Please enter your current password.', 'warning');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password updated successfully!', 'success');
  };

  const toggleNotif = (key: keyof typeof notifs) => {
    const updated = { ...notifs, [key]: !notifs[key] };
    setNotifs(updated);
    showToast('Notification preference saved.', 'info');
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(false);
    showToast('Account data reset. Logging out...', 'warning');
    setTimeout(() => {
      logout();
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto pb-10 space-y-8 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-sm text-gray-500">Manage your security credentials and platform preferences.</p>
      </div>

      {/* Account Security */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Shield className="text-blue-600" size={20} /> Account Security
        </h2>
        <Card className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registered Email</label>
            <p className="text-gray-900 bg-slate-50 px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono">budi.santoso@spora.id</p>
          </div>

          <form onSubmit={handlePasswordChange} className="border-t border-gray-100 pt-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Change Password</h3>
            <Input 
              type="password" 
              label="Current Password" 
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
              placeholder="••••••••" 
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                type="password" 
                label="New Password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                placeholder="••••••••" 
              />
              <Input 
                type="password" 
                label="Confirm New Password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="••••••••" 
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary">Update Password</Button>
            </div>
          </form>
        </Card>
      </section>

      {/* Notification Preferences */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Bell className="text-blue-600" size={20} /> Notification Preferences
        </h2>
        <Card className="p-0 overflow-hidden divide-y divide-gray-100">
          {[
            { key: 'assessmentReminders', label: 'Assessment Reminders', desc: 'Get notified when you have pending psychometric or technical tests.' },
            { key: 'jobRecommendations', label: 'Job Recommendations', desc: 'Receive AI-curated job matches aligned with your Talent Score.' },
            { key: 'applicationUpdates', label: 'Application Status Alerts', desc: 'Get instant alerts when your recruitment pipeline stage updates.' },
            { key: 'interviewInvites', label: 'Interview Invitations', desc: 'Notifications for scheduled video and onsite interview calls.' },
          ].map((item) => (
            <div key={item.key} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifs[item.key as keyof typeof notifs]} 
                  onChange={() => toggleNotif(item.key as keyof typeof notifs)} 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0099B8]"></div>
              </label>
            </div>
          ))}
        </Card>
      </section>

      {/* Danger Zone */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
          <Trash2 size={20} /> Danger Zone
        </h2>
        <Card className="p-6 border-red-100 bg-red-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900">Delete Account</h3>
            <p className="text-xs text-gray-500">Permanently remove your candidate profile, scores, and application records.</p>
          </div>
          <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>Delete Account</Button>
        </Card>
      </section>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Account Deletion">
        <div className="space-y-4 pt-2">
          <p className="text-sm text-gray-600">Are you sure you want to delete your account? This action cannot be undone and all your assessment history will be erased.</p>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteAccount}>Yes, Delete My Account</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
