"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import Avatar from "@/components/ui/Avatar";
import { useDispatch } from "react-redux";
import { updateUserAvatar, updateUserProfile } from "@/redux/slices/userSlice";
import useUserData from "@/hooks/useUserData";
import PendingRequests from "@/components/profile/PendingRequests";
import FollowersList from "@/components/profile/FollowersList";
import FollowingList from "@/components/profile/FollowingList";
import ContactsList from "@/components/profile/ContactsList";

export default function ProfilePage() {
  const { data: session, status: authStatus, update } = useSession();
  const { user: profile, loading, error: reduxError } = useUserData();

  const dispatch = useDispatch();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    isPrivate: false,
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("contacts");

  // Check if user is authenticated
  if (authStatus === "unauthenticated") {
    redirect("/login");
  }

  // Initialize form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        status: profile.status || "",
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
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submit using Redux
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

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

        setSuccess("Profile updated successfully");

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.message || "Failed to update profile");
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
      setError("");

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

        setSuccess("Avatar updated successfully");

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      setError(error.message || "Failed to update avatar");
    } finally {
      setSaving(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
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
      {/* Back button for mobile */}
      <div className="md:hidden fixed  left-4 z-10">
        <Link
          href="/chat"
          className="p-2 bg-dark-lighter rounded-full text-gray-400 hover:text-white"
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
      </div>

      {/* Page title */}
      <div className="pt-20 pb-2 px-4 text-center">
        <h1 className="text-2xl font-semibold text-white">Your Profile</h1>
      </div>

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

        {/* Profile Card */}
        <div className="bg-dark-lighter rounded-lg overflow-hidden shadow-lg border border-gray-700/50 relative">
          {/* Cover Photo/Banner */}
          <div className="h-40 bg-gradient-to-r from-primary/40 via-purple-500/30 to-secondary/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-lighter/80"></div>
            
            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full bg-white/20"
                  style={{
                    width: `${Math.random() * 8 + 2}px`,
                    height: `${Math.random() * 8 + 2}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.5 + 0.3,
                    animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                    animationDelay: `${Math.random() * 10}s`
                  }}
                />
              ))}
            </div>
          </div>
          {/* Avatar section */}
          <div className="px-6 pb-6 flex flex-col items-center">
            <div className="relative -mt-20 mb-4 group">
              <div className="relative border-4 border-dark-lighter shadow-lg shadow-primary/20 rounded-full transform transition-all duration-300 group-hover:scale-105">
                <Avatar src={profile?.avatar} name={profile?.name} size="3xl" />
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
                className="absolute bottom-0 right-0 bg-primary hover:bg-primary-dark text-dark p-2 rounded-full cursor-pointer transition-all transform hover:scale-110 shadow-lg opacity-0 group-hover:opacity-100"
                disabled={saving}
                title="Change profile picture"
              >
                {saving ? (
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>
                )}
              </button>
            </div>

            <h2 className="text-3xl font-bold text-white mb-1 mt-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {profile?.name}
            </h2>
            <p className="text-gray-400 flex items-center">
              <svg
                className="w-4 h-4 mr-1 text-primary"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              {profile?.email}
            </p>

            <div className="flex items-center mt-2 space-x-2">
              {profile?.isOnline && (
                <div className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Online
                </div>
              )}

              {profile?.isPrivate && (
                <div className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                  </svg>
                  Private Account
                </div>
              )}
            </div>

            {profile?.status && (
              <div className="mt-3 text-gray-300 text-center max-w-md">
                <svg
                  className="w-4 h-4 inline-block mr-1 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z" />
                </svg>
                "{profile.status}"
              </div>
            )}
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-3 divide-x divide-gray-700 border-t border-b border-gray-700 mt-4 bg-dark-lighter/50">
            <div className="p-4 text-center hover:bg-dark-lighter/80 transition-colors">
              <p className="text-2xl font-bold text-white">
                {profile?.contacts?.length || 0}
              </p>
              <p className="text-sm text-gray-400">Contacts</p>
            </div>
            <div className="p-4 text-center hover:bg-dark-lighter/80 transition-colors">
              <p className="text-2xl font-bold text-white">
                {profile?.lastSeen
                  ? new Date(profile.lastSeen).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-400">Last Active</p>
            </div>
            <div className="p-4 text-center hover:bg-dark-lighter/80 transition-colors">
              <p className="text-2xl font-bold text-white">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-400">Joined</p>
            </div>
          </div>

          {/* Profile form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
              Edit Profile
            </h3>
            <div className="relative">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
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
                  className="w-full pl-10 px-4 py-3 bg-dark rounded-lg border border-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-white transition-all duration-200"
                  disabled={saving}
                />
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Status
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
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
                  className="w-full pl-10 px-4 py-3 bg-dark rounded-lg border border-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-white transition-all duration-200"
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
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, status: "" }))
                    }
                    className="text-xs text-primary hover:text-primary-light"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center p-4 bg-dark/50 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors">
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
                <label
                  htmlFor="isPrivate"
                  className="font-medium text-sm text-white"
                >
                  Private account
                </label>
                <p className="text-xs text-gray-400 mt-0.5">
                  Only your contacts will be able to see your profile and
                  message you
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-dark font-semibold rounded-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-primary/30"
              >
                {saving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-dark"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="px-6 py-3 bg-transparent hover:bg-gray-700 text-white border border-gray-700 rounded-lg transition-all duration-300 flex items-center justify-center hover:border-gray-500"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          </form>
        </div>

        {/* Social Connections Tabs */}
        <div className="mt-8 bg-dark-lighter rounded-lg overflow-hidden shadow-xl border border-gray-700/50 transform transition-all duration-300 hover:shadow-primary/5">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700 overflow-x-auto bg-gradient-to-r from-dark-lighter to-dark-lighter/80">
            <button
              onClick={() => setActiveTab("contacts")}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === "contacts"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Contacts
            </button>
            <button
              onClick={() => setActiveTab("followers")}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === "followers"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Followers
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === "following"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Following
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`px-6 py-3 font-medium text-sm transition-colors flex items-center ${
                activeTab === "requests"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Pending Requests
              {profile?.pendingRequests?.length > 0 && (
                <span className="ml-2 bg-primary text-dark text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {profile.pendingRequests.length}
                </span>
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 animate-fadeIn">
            {activeTab === "contacts" && <ContactsList />}
            {activeTab === "followers" && <FollowersList />}
            {activeTab === "following" && <FollowingList />}
            {activeTab === "requests" && <PendingRequests />}
          </div>
        </div>
      </main>
    </div>
  );
}
