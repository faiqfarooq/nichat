'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    status: '',
    isPrivate: false,
  });
  const [saving, setSaving] = useState(false);
  
  // Check if user is authenticated
  if (status === 'unauthenticated') {
    redirect('/login');
  }

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${session.user.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const data = await response.json();
        setProfile(data);
        
        // Initialize form data
        setFormData({
          name: data.name || '',
          status: data.status || '',
          isPrivate: data.isPrivate || false,
        });
      } catch (error) {
        console.error('Error loading profile:', error);
        setError('Could not load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }
      
      const updatedProfile = await response.json();
      
      // Update profile and session
      setProfile(updatedProfile);
      
      // Update session
      await update({
        ...session,
        user: {
          ...session.user,
          name: updatedProfile.name,
          avatar: updatedProfile.avatar,
        },
      });
      
      setSuccess('Profile updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // TODO: Implement file upload to storage service
    // For now, we'll just use a placeholder
    
    try {
      setSaving(true);
      setError('');
      
      // Mock API call for avatar update
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatar: '/assets/images/default-avatar.png', // Replace with actual URL from upload
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update avatar');
      }
      
      const updatedProfile = await response.json();
      
      // Update profile and session
      setProfile(updatedProfile);
      
      // Update session
      await update({
        ...session,
        user: {
          ...session.user,
          avatar: updatedProfile.avatar,
        },
      });
      
      setSuccess('Avatar updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
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
        
        <div className="bg-dark-lighter rounded-lg overflow-hidden shadow-lg">
          {/* Avatar section */}
          <div className="p-6 flex flex-col items-center border-b border-gray-700">
            <div className="relative mb-4">
              <img
                src={profile?.avatar || '/assets/images/default-avatar.png'}
                alt={profile?.name || 'Profile'}
                className="w-24 h-24 rounded-full object-cover"
              />
              
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-primary hover:bg-primary-dark text-dark p-2 rounded-full cursor-pointer transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
              </label>
              
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            
            <h2 className="text-xl font-bold text-white mb-1">{profile?.name}</h2>
            <p className="text-gray-400">{profile?.email}</p>
          </div>
          
          {/* Profile form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-dark rounded border border-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-white"
                disabled={saving}
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <input
                type="text"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                placeholder="Hey there! I am using Chat App"
                maxLength={100}
                className="w-full px-4 py-2 bg-dark rounded border border-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-white"
                disabled={saving}
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.status.length}/100 characters
              </p>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrivate"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-700 rounded bg-dark"
                disabled={saving}
              />
              <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-300">
                Private account (only visible to contacts)
              </label>
            </div>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-primary hover:bg-primary-dark text-dark font-semibold rounded transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              
              <button
                type="button"
                onClick={handleLogout}
                className="px-6 py-2 bg-transparent hover:bg-gray-700 text-white border border-gray-700 rounded transition"
              >
                Logout
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}