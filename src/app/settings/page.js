"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useUserData from "@/hooks/useUserData";

export default function SettingsPage() {
  const { data: session, status: authStatus, update } = useSession();
  const { user: profile, loading } = useUserData();
  const router = useRouter();
  
  const [activeSection, setActiveSection] = useState("account");
  const [chatBackgroundColor, setChatBackgroundColor] = useState("#121212");
  const [savingPreference, setSavingPreference] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOTP] = useState("");
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loadingBlockedUsers, setLoadingBlockedUsers] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  // Check if user is authenticated
  if (authStatus === "unauthenticated") {
    redirect("/login");
  }

  // Handle email change
  const handleEmailChange = async (e) => {
    e.preventDefault();
    
    try {
      setSuccessMessage("Processing...");
      
      // Make API call to send verification email
      const response = await fetch('/api/auth/verify-email-change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newEmail }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to request email change');
      }
      
      const data = await response.json();
      
      setSuccessMessage("Verification code sent. Please check your inbox and enter the code below.");
      setShowOTPInput(true);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error requesting email change:", error);
      setErrorMessage(error.message || "Failed to request email change. Please try again.");
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };
  
  // Handle OTP verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    try {
      setSuccessMessage("Verifying...");
      
      // Validate OTP format
      if (!/^\d{6}$/.test(otp)) {
        throw new Error("Please enter a valid 6-digit code");
      }
      
      // Make API call to verify OTP
      const response = await fetch('/api/auth/verify-email-change', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify code');
      }
      
      setSuccessMessage("Email changed successfully!");
      setShowOTPInput(false);
      setOTP("");
      
      // Update session with new email
      await update({
        ...session,
        user: {
          ...session.user,
          email: data.email,
        },
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setErrorMessage(error.message || "Failed to verify code. Please try again.");
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      setSuccessMessage("Processing...");
      
      // Make API call to delete account
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete account');
      }
      
      // Sign out and redirect to home page
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error deleting account:", error);
      setErrorMessage("Failed to delete account. Please try again.");
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      
      setShowDeleteConfirm(false);
    }
  };

  // Fetch blocked users
  const fetchBlockedUsers = async () => {
    if (!session) return;
    
    try {
      setLoadingBlockedUsers(true);
      const response = await fetch('/api/users/blocked');
      
      if (response.ok) {
        const data = await response.json();
        setBlockedUsers(data.blockedUsers || []);
      } else {
        console.error("Failed to fetch blocked users");
      }
    } catch (error) {
      console.error("Error fetching blocked users:", error);
    } finally {
      setLoadingBlockedUsers(false);
    }
  };
  
  // Fetch contacts
  const fetchContacts = async () => {
    if (!session) return;
    
    try {
      setLoadingContacts(true);
      const response = await fetch('/api/users/contacts');
      
      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts || []);
      } else {
        console.error("Failed to fetch contacts");
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoadingContacts(false);
    }
  };
  
  // Handle unblocking a user
  const handleUnblockUser = async (userId) => {
    try {
      setSuccessMessage("Processing...");
      
      // Make API call to unblock user
      const response = await fetch(`/api/users/block?userId=${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to unblock user");
      }
      
      // Update blocked users list
      setBlockedUsers(blockedUsers.filter(user => user._id !== userId));
      
      setSuccessMessage("User unblocked successfully.");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error unblocking user:", error);
      setErrorMessage(error.message || "Failed to unblock user. Please try again.");
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  // Fetch user preferences and blocked users on component mount
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch('/api/users/preferences');
        if (response.ok) {
          const data = await response.json();
          if (data.preferences?.chatBackgroundColor) {
            setChatBackgroundColor(data.preferences.chatBackgroundColor);
          }
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };

    // Check for emailChanged query parameter
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('emailChanged') === 'true') {
      setSuccessMessage("Your email has been successfully changed.");
      
      // Update the URL to remove the query parameter
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    }

    if (session) {
      fetchPreferences();
      fetchBlockedUsers();
    }
  }, [session]);
  
  // Fetch blocked users and contacts when privacy section is activated
  useEffect(() => {
    if (activeSection === "privacy") {
      fetchBlockedUsers();
      fetchContacts();
    }
  }, [activeSection]);

  // Handle chat background color change
  const handleChatBackgroundChange = async (color) => {
    setChatBackgroundColor(color);
    setSavingPreference(true);
    
    try {
      // Save preference to database
      const response = await fetch('/api/users/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatBackgroundColor: color }),
      });
      
      if (response.ok) {
        setSuccessMessage("Chat background color updated successfully.");
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to update chat background color");
      }
    } catch (error) {
      console.error("Error updating chat background color:", error);
      setErrorMessage("Failed to save chat background color preference.");
    } finally {
      setSavingPreference(false);
      
      // Clear success/error message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
    }
  };

  // Handle chat history clear
  const handleClearChatHistory = async () => {
    try {
      setSuccessMessage("Processing...");
      
      // Make API call to clear chat history
      const response = await fetch('/api/chats/clear-history', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to clear chat history");
      }
      
      setSuccessMessage("Chat history cleared successfully.");
      setShowClearHistoryConfirm(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error clearing chat history:", error);
      setErrorMessage("Failed to clear chat history. Please try again.");
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  // Handle chat backup
  const handleChatBackup = async () => {
    try {
      setSuccessMessage("Creating backup...");
      
      // Make API call to create backup
      const response = await fetch('/api/chats/backup');
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create chat backup");
      }
      
      // Get backup data
      const backupData = await response.json();
      
      // Create a JSON file with the backup data
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a link element to download the file
      const link = document.createElement('a');
      link.href = url;
      link.download = `nichat_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      setSuccessMessage("Chat backup created and downloaded successfully.");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error creating chat backup:", error);
      setErrorMessage("Failed to create chat backup. Please try again.");
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  // Handle user invitation
  const handleInviteUser = async (e) => {
    e.preventDefault();
    
    try {
      setSuccessMessage("Sending invitation...");
      
      // Make API call to send invitation
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: inviteEmail }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send invitation");
      }
      
      setSuccessMessage(`Invitation sent to ${inviteEmail} successfully.`);
      setInviteEmail("");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error sending invitation:", error);
      setErrorMessage(error.message || "Failed to send invitation. Please try again.");
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
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
      <div className="md:hidden fixed left-4 z-10">
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
      <div className="pt-8 pb-2 px-4 text-center">
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-3xl mx-auto w-full p-6">
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded text-green-200">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded text-red-200">
            {errorMessage}
          </div>
        )}

        {/* Settings Card */}
        <div className="bg-dark-lighter rounded-lg overflow-hidden shadow-lg border border-gray-700/50">
          {/* Settings Navigation */}
          <div className="flex overflow-x-auto bg-dark-lighter border-b border-gray-700">
            <button
              onClick={() => setActiveSection("account")}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeSection === "account"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Account
              </div>
            </button>
            <button
              onClick={() => setActiveSection("privacy")}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeSection === "privacy"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Privacy
              </div>
            </button>
            <button
              onClick={() => setActiveSection("help")}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeSection === "help"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Help
              </div>
            </button>
            <button
              onClick={() => setActiveSection("chats")}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeSection === "chats"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Chats
              </div>
            </button>
            <button
              onClick={() => setActiveSection("invite")}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeSection === "invite"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                Invite
              </div>
            </button>
          </div>

          {/* Settings Content */}
          <div className="p-6">
            {/* Account Settings */}
            {activeSection === "account" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Account Settings</h2>
                
                {/* Email Information */}
                <div className="bg-dark p-4 rounded-lg border border-gray-700">
                  <h3 className="text-white font-medium mb-2">Email Address</h3>
                  <p className="text-gray-300 mb-2">{profile?.email}</p>
                  <p className="text-xs text-gray-500">This is the email address associated with your account.</p>
                </div>
                
                {/* Change Email */}
                <div className="bg-dark p-4 rounded-lg border border-gray-700">
                  <h3 className="text-white font-medium mb-3">Change Email Address</h3>
                  
                  {!showOTPInput ? (
                    <form onSubmit={handleEmailChange} className="space-y-4">
                      <div>
                        <label htmlFor="newEmail" className="block text-sm font-medium text-gray-400 mb-1">
                          New Email Address
                        </label>
                        <input
                          type="email"
                          id="newEmail"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="w-full px-4 py-2 bg-dark-light rounded-lg border border-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-white"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-dark font-medium rounded-lg hover:bg-primary-dark transition-colors"
                      >
                        Send Verification Code
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                      <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-400 mb-1">
                          Verification Code
                        </label>
                        <input
                          type="text"
                          id="otp"
                          value={otp}
                          onChange={(e) => setOTP(e.target.value)}
                          className="w-full px-4 py-2 bg-dark-light rounded-lg border border-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-white"
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                          required
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-primary text-dark font-medium rounded-lg hover:bg-primary-dark transition-colors"
                        >
                          Verify Code
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowOTPInput(false);
                            setOTP("");
                          }}
                          className="px-4 py-2 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Didn't receive the code?{" "}
                        <button
                          type="button"
                          onClick={handleEmailChange}
                          className="text-primary hover:underline"
                        >
                          Resend
                        </button>
                      </p>
                    </form>
                  )}
                </div>
                
                {/* Delete Account */}
                <div className="bg-dark p-4 rounded-lg border border-red-900/30">
                  <h3 className="text-red-400 font-medium mb-2">Delete Account</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    This action is permanent and cannot be undone. All your data will be permanently removed.
                  </p>
                  
                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      Delete Account
                    </button>
                  ) : (
                    <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/30">
                      <p className="text-red-300 font-medium mb-3">Are you sure you want to delete your account?</p>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleDeleteAccount}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Yes, Delete My Account
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeSection === "privacy" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Privacy Settings</h2>
                
                {/* Blocked Users */}
                <div className="bg-dark p-4 rounded-lg border border-gray-700">
                  <h3 className="text-white font-medium mb-3">Blocked Users</h3>
                  
                  {loadingBlockedUsers ? (
                    <div className="flex justify-center py-4">
                      <div className="spinner w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : blockedUsers.length > 0 ? (
                    <div className="space-y-3">
                      {blockedUsers.map((user) => (
                        <div key={user._id} className="flex items-center justify-between bg-dark-light p-3 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-700 mr-3">
                              {user.avatar && (
                                <img 
                                  src={user.avatar} 
                                  alt={user.name} 
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <p className="text-white font-medium">{user.name || "User"}</p>
                              <p className="text-gray-400 text-sm">{user.email || "Email not available"}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleUnblockUser(user._id)}
                            className="px-3 py-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                          >
                            Unblock
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">You haven't blocked any users.</p>
                  )}
                </div>
                
                {/* Contact List */}
                <div className="bg-dark p-4 rounded-lg border border-gray-700">
                  <h3 className="text-white font-medium mb-3">Contact List</h3>
                  
                  {loadingContacts ? (
                    <div className="flex justify-center py-4">
                      <div className="spinner w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : contacts.length > 0 ? (
                    <div className="space-y-3">
                      {contacts.map((contact) => (
                        <div key={contact._id} className="flex items-center justify-between bg-dark-light p-3 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-700 mr-3">
                              {contact.avatar && (
                                <img 
                                  src={contact.avatar} 
                                  alt={contact.name} 
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <p className="text-white font-medium">{contact.name || "Contact"}</p>
                              <p className="text-gray-400 text-sm">{contact.email || "Email not available"}</p>
                            </div>
                          </div>
                          <button className="px-3 py-1 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="1"></circle>
                              <circle cx="19" cy="12" r="1"></circle>
                              <circle cx="5" cy="12" r="1"></circle>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">You don't have any contacts yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* Help Settings */}
            {activeSection === "help" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Help & Support</h2>
                
                {/* Help Center */}
                <div className="bg-dark p-4 rounded-lg border border-gray-700">
                  <h3 className="text-white font-medium mb-2">Help Center</h3>
                  <p className="text-gray-400 mb-4">
                    Find answers to common questions and learn how to use all the features of nichat.
                  </p>
                  <Link 
                    href="/help-center" 
                    className="px-4 py-2 bg-primary text-dark font-medium rounded-lg hover:bg-primary-dark transition-colors inline-block"
                  >
                    Visit Help Center
                  </Link>
                </div>
                
                {/* Terms and Conditions */}
                <div className="bg-dark p-4 rounded-lg border border-gray-700">
                  <h3 className="text-white font-medium mb-2">Terms and Conditions</h3>
                  <p className="text-gray-400 mb-4">
                    Read our terms of service and privacy policy to understand how we handle your data.
                  </p>
                  <div className="space-y-2">
                    <Link 
                      href="/terms" 
                      className="px-4 py-2 bg-dark-light text-white font-medium rounded-lg hover:bg-gray-700 transition-colors inline-block mr-3"
                    >
                      Terms of Service
                    </Link>
                    <Link 
                      href="/privacy-policy" 
                      className="px-4 py-2 bg-dark-light text-white font-medium rounded-lg hover:bg-gray-700 transition-colors inline-block"
                    >
                      Privacy Policy
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Settings */}
            {activeSection === "chats" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Chat Settings</h2>
                
                {/* Chat Background Color */}
                <div className="bg-dark p-4 rounded-lg border border-gray-700">
                  <h3 className="text-white font-medium mb-3">Chat Background Color</h3>
                  <p className="text-gray-400 mb-4">
                    Choose a background color for your chat windows.
                  </p>
                  
                  <div className="grid grid-cols-5 gap-3 mb-4">
                    {["#121212", "#1a1a2e", "#16213e", "#1e2a3a", "#2c3333"].map((color) => (
                      <button
                        key={color}
                        onClick={() => handleChatBackgroundChange(color)}
                        className={`w-full aspect-square rounded-lg border-2 ${
                          chatBackgroundColor === color ? "border-primary" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Select ${color} as chat background color`}
                      />
                    ))}
                  </div>
                  
                  <div className="p-4 rounded-lg" style={{ backgroundColor: chatBackgroundColor }}>
                    <div className="flex items-start mb-3">
                      <div className="w-8 h-8 rounded-full bg-primary mr-2 flex-shrink-0"></div>
                      <div className="bg-dark-lighter p-2 rounded-lg rounded-tl-none max-w-[80%]">
                        <p className="text-white text-sm">This is how your chat will look like</p>
                      </div>
                    </div>
                    <div className="flex items-start justify-end">
                      <div className="bg-primary p-2 rounded-lg rounded-tr-none max-w-[80%]">
                        <p className="text-dark text-sm">With the selected background color</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Chat Backup */}
                <div className="bg-dark p-4 rounded-lg border border-gray-700">
                  <h3 className="text-white font-medium mb-2">Chat Backup</h3>
                  <p className="text-gray-400 mb-4">
                    Create a backup of all your chat history. You can restore this backup later if needed.
                  </p>
                  <button
                    onClick={handleChatBackup}
                    className="px-4 py-2 bg-primary text-dark font-medium rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Create Backup
                  </button>
                </div>
                
                {/* Clear Chat History */}
                <div className="bg-dark p-4 rounded-lg border border-gray-700">
                  <h3 className="text-white font-medium mb-2">Clear Chat History</h3>
                  <p className="text-gray-400 mb-4">
                    Delete all your chat history. This action cannot be undone.
                  </p>
                  
                  {!showClearHistoryConfirm ? (
                    <button
                      onClick={() => setShowClearHistoryConfirm(true)}
                      className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      Clear History
                    </button>
                  ) : (
                    <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/30">
                      <p className="text-red-300 font-medium mb-3">Are you sure you want to clear all chat history?</p>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleClearChatHistory}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Yes, Clear History
                        </button>
                        <button
                          onClick={() => setShowClearHistoryConfirm(false)}
                          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Invite Users */}
            {activeSection === "invite" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Invite New Users</h2>
                
                <div className="bg-dark p-4 rounded-lg border border-gray-700">
                  <h3 className="text-white font-medium mb-3">Invite a Friend</h3>
                  <p className="text-gray-400 mb-4">
                    Send an invitation to your friends to join nichat.
                  </p>
                  
                  <form onSubmit={handleInviteUser} className="space-y-4">
                    <div>
                      <label htmlFor="inviteEmail" className="block text-sm font-medium text-gray-400 mb-1">
                        Friend's Email Address
                      </label>
                      <input
                        type="email"
                        id="inviteEmail"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="w-full px-4 py-2 bg-dark-light rounded-lg border border-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-white"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-dark font-medium rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      Send Invitation
                    </button>
                  </form>
                </div>
                
                <div className="bg-dark p-4 rounded-lg border border-gray-700">
                  <h3 className="text-white font-medium mb-3">Share Invitation Link</h3>
                  <p className="text-gray-400 mb-4">
                    Share this link with anyone you want to invite to nichat.
                  </p>
                  
                  <div className="flex">
                    <input
                      type="text"
                      value="https://nichat.app/join/user123"
                      readOnly
                      className="flex-1 px-4 py-2 bg-dark-light rounded-l-lg border border-gray-700 focus:outline-none text-gray-300"
                    />
                    <button
                      className="px-4 py-2 bg-primary text-dark font-medium rounded-r-lg hover:bg-primary-dark transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText("https://nichat.app/join/user123");
                        setSuccessMessage("Invitation link copied to clipboard!");
                        setTimeout(() => setSuccessMessage(""), 3000);
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
