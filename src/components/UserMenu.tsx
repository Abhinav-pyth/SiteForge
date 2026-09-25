import { useState } from 'react';
import { LogOut, Shield, User } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { setView } from '../lib/store';

export default function UserMenu() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user || !profile) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    setView('landing');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 transition"
      >
        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
          {profile.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-sm font-medium text-neutral-900">
            {profile.full_name || user.email?.split('@')[0] || 'User'}
          </div>
          {isAdmin && (
            <div className="text-xs text-purple-600 flex items-center gap-1">
              <Shield size={10} />
              Admin
            </div>
          )}
        </div>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50">
            <div className="px-4 py-3 border-b border-neutral-200">
              <div className="text-sm font-medium text-neutral-900">{profile.full_name || 'User'}</div>
              <div className="text-xs text-neutral-500 truncate">{user.email}</div>
              {isAdmin && (
                <div className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                  <Shield size={10} />
                  Administrator
                </div>
              )}
            </div>
            
            {isAdmin && (
              <button
                onClick={() => {
                  setView('admin');
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2 transition"
              >
                <Shield size={16} className="text-purple-600" />
                Admin Dashboard
              </button>
            )}
            
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2 text-red-600 transition"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
