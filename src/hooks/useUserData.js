'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { 
  fetchUserData, 
  selectUser, 
  selectUserStatus, 
  selectUserError,
  selectUserAvatar
} from '@/redux/slices/userSlice';

/**
 * Custom hook to access user data from Redux
 * Automatically fetches user data if not already in the store
 * @returns {Object} User data and related state
 */
export function useUserData() {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  
  const userData = useSelector(selectUser);
  const status = useSelector(selectUserStatus);
  const error = useSelector(selectUserError);
  const avatar = useSelector(selectUserAvatar);
  
  const loading = status === 'loading';
  const userId = session?.user?.id;
  
  // Fetch user data if not already in the store
  useEffect(() => {
    if (userId && !userData && status === 'idle') {
      dispatch(fetchUserData(userId));
    }
  }, [dispatch, userId, userData, status]);
  
  return {
    user: userData,
    loading,
    error,
    avatar,
    userId,
    isAuthenticated: !!session,
  };
}

export default useUserData;
