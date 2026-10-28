import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { clearSession } from '@/features/auth/store/authSlice';
import { refreshSession } from '@/shared/api/interceptor';
import { QueryProvider } from './providers/QueryProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { router } from './router';
import { persistor, store } from './store/store';

/** Runs after the saved session loads. Without a saved token, the refresh cookie (if any) restores it. */
const restoreSession = () => {
  if (store.getState().auth.accessToken) return;
  refreshSession().catch(() => store.dispatch(clearSession()));
};

export const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} onBeforeLift={restoreSession}>
        <QueryProvider>
          <ThemeProvider>
            <RouterProvider router={router} />
          </ThemeProvider>
        </QueryProvider>
      </PersistGate>
    </Provider>
  );
};
