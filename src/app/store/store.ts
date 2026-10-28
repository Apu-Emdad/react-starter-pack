import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/es/storage';
import authReducer, {
  clearSession,
  setSession,
} from '@/features/auth/store/authSlice';
import { configureInterceptor } from '@/shared/api/interceptor';

const rootReducer = combineReducers({ auth: authReducer });

/** Saves the session (user and access token) in localStorage, so a page reload keeps it. */
const persistedReducer = persistReducer(
  { key: 'root', storage, whitelist: ['auth'] },
  rootReducer,
);

export type RootState = ReturnType<typeof rootReducer>;

/** Store without localStorage, for tests. */
export const makeStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({ reducer: rootReducer, preloadedState });
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];

configureInterceptor({
  getToken: () => store.getState().auth.accessToken,
  onSession: (payload) => store.dispatch(setSession(payload)),
  onLogout: () => store.dispatch(clearSession()),
});
