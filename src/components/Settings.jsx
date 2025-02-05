import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Lock, Trash2, FileText, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

function Settings() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    toast.success(`${darkMode ? 'Light' : 'Dark'} mode enabled`);
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(false);
    toast.success('Account deleted successfully');
    navigate('/');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

      <div className="space-y-6 max-w-2xl">
        {/* Appearance */}
        <div className="bg-[#1e2128] p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5 text-[#4fd1c5]" /> : <Sun className="w-5 h-5 text-[#4fd1c5]" />}
              <span className="text-gray-300">Dark Mode</span>
            </div>
            <button
              onClick={handleDarkModeToggle}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-700 transition-colors focus:outline-none"
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-[#1e2128] p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Security</h2>
          <div className="space-y-4">
            <button
              onClick={() => toast.success('Password reset email sent!')}
              className="flex items-center gap-2 text-gray-300 hover:text-[#4fd1c5] transition-colors"
            >
              <Lock className="w-5 h-5" />
              Reset Password
            </button>
          </div>
        </div>

        {/* Account */}
        <div className="bg-[#1e2128] p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Account</h2>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Delete Account
          </button>
        </div>

        {/* Legal */}
        <div className="bg-[#1e2128] p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Legal</h2>
          <div className="space-y-4">
            <button
              onClick={() => toast.success('Terms of Use opened in new tab')}
              className="flex items-center gap-2 text-gray-300 hover:text-[#4fd1c5] transition-colors"
            >
              <FileText className="w-5 h-5" />
              Terms of Use
            </button>
            <button
              onClick={() => toast.success('Privacy Policy opened in new tab')}
              className="flex items-center gap-2 text-gray-300 hover:text-[#4fd1c5] transition-colors"
            >
              <Shield className="w-5 h-5" />
              Privacy Policy
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#1e2128] p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Delete Account</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;