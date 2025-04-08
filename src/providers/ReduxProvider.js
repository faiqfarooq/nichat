'use client';

import { Provider } from 'react-redux';
import { store } from '@/redux/store';

/**
 * Redux Provider Component
 * Provides Redux store to the application
 */
export function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}

export default ReduxProvider;
