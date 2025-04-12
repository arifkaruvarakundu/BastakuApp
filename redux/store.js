import AsyncStorage from '@react-native-async-storage/async-storage'; // Correct AsyncStorage import
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import authReducer from './authSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage, // Use AsyncStorage here
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedReducer, // Use persistedReducer for auth
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store); // Persist store
export default store;

