'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import Avatar from '@/components/ui/Avatar';
import { useDispatch } from 'react-redux';
import { updateUserAvatar, updateUserProfile } from '@/redux/slices/userSlice';
import useUserData from '@/hooks/useUserData';

export default function ProfilePage() {
  const { data: session, status: authStatus, update } = useSession();
  const { user: profile, loading, error: reduxError } = useUserData();
  
  const dispatch = useDispatch();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    status: '',
    isPrivate: false,
  });
  const [saving, setSaving] = useState(false);
  
  // Check if user is authenticated
  if (authStatus === 'unauthenticated') {
    redirect('/login');
  }

  
  // Initialize form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        status: profile.status || '',
        isPrivate: profile.isPrivate || false,
      });
    }
  }, [profile]);
  
  // Set error from Redux
  useEffect(() => {
    if (reduxError) {
      setError(reduxError);
    }
  }, [reduxError]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submit using Redux
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      // Dispatch the updateUserProfile action
      const resultAction = await dispatch(
        updateUserProfile({
          userId: session.user.id,
          profileData: formData,
        })
      );
      
      // Check if the action was fulfilled
      if (updateUserProfile.fulfilled.match(resultAction)) {
        // Update session
        await update({
          ...session,
          user: {
            ...session.user,
            name: resultAction.payload.name,
            avatar: resultAction.payload.avatar,
          },
        });
        
        setSuccess('Profile updated successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // File input reference
  const fileInputRef = useRef(null);
  
  // Handle avatar upload using Redux
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setSaving(true);
      setError('');
      
      // Dispatch the updateUserAvatar action
      const resultAction = await dispatch(
        updateUserAvatar({
          userId: session.user.id,
          file,
        })
      );
      
      // Check if the action was fulfilled
      if (updateUserAvatar.fulfilled.match(resultAction)) {
        // Update session
        await update({
          ...session,
          user: {
            ...session.user,
            avatar: resultAction.payload.avatar,
          },
        });
        
        setSuccess('Avatar updated successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      setError(error.message || 'Failed to update avatar');
    } finally {
      setSaving(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };
  
  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="spinner w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Header */}
      <header className="bg-dark-lighter border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/chat" className="mr-4 text-gray-400 hover:text-white">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          
          <h1 className="text-white font-semibold text-xl">Your Profile</h1>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 max-w-3xl mx-auto w-full p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded text-red-200">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded text-green-200">
            {success}
          </div>
        )}
        
        <div className="bg-dark-lighter rounded-lg overflow-hidden shadow-lg border border-gray-700/50">
          {/* Avatar section */}
          <div className="p-6 flex flex-col items-center border-b border-gray-700">
            <div className="relative mb-4">
              <div className="relative border-4 border-primary/30 shadow-lg shadow-primary/20 rounded-full">
                <Avatar 
                  src={profile?.avatar} 
                  name={profile?.name} 
                  size="3xl"
                />
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                className="hidden"
                accept="image/*"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-primary hover:bg-primary-dark text-dark p-2 rounded-full cursor-pointer transition-all transform hover:scale-110 shadow-lg"
                disabled={saving}
                title="Change profile picture"
              >
                {saving ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>
                )}
              </button>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-1 mt-4">{profile?.name}</h2>
            <p className="text-gray-400 flex items-center">
              <svg className="w-4 h-4 mr-1 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              {profile?.email}
            </p>
            {profile?.isOnline && (
              <div className="mt-2 px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Online
              </div>
            )}
          </div>
          
          {/* Stats section */}
          <div className="grid grid-cols-3 divide-x divide-gray-700 border-t border-gray-700">
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-white">{profile?.contacts?.length || 0}</p>
              <p className="text-sm text-gray-400">Contacts</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-white">
                {profile?.lastSeen ? new Date(profile.lastSeen).toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-sm text-gray-400">Last Active</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-white">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-sm text-gray-400">Joined</p>
            </div>
          </div>
          
          {/* Profile form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Edit Profile</h3>
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 px-4 py-2 bg-dark rounded border border-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-white"
                  disabled={saving}
                />
              </div>
            </div>
            
            <div className="relative">
              <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  placeholder="Hey there! I am using Chat App"
                  maxLength={100}
                  className="w-full pl-10 px-4 py-2 bg-dark rounded border border-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-white"
                  disabled={saving}
                />
              </div>
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-500">
                  {formData.status.length}/100 characters
                </p>
                {formData.status.length > 0 && (
                  <button 
                    type="button" 
                    onClick={() => setFormData(prev => ({ ...prev, status: '' }))}
                    className="text-xs text-primary hover:text-primary-light"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-dark/50 rounded-lg border border-gray-700/50">
              <input
                type="checkbox"
                id="isPrivate"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleChange}
                className="h-5 w-5 text-primary focus:ring-primary border-gray-700 rounded bg-dark"
                disabled={saving}
              />
              <div className="ml-3">
                <label htmlFor="isPrivate" className="font-medium text-sm text-white">
                  Private account
                </label>
                <p className="text-xs text-gray-400 mt-0.5">
                  Only your contacts will be able to see your profile and message you
                </p>
              </div>
            </div>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-dark font-semibold rounded-md transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleLogout}
                className="px-6 py-2.5 bg-transparent hover:bg-gray-700 text-white border border-gray-700 rounded-md transition flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
