import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Usar localStorage
import authReducer from './auth/authSlice';

import { combineReducers } from 'redux';

// Combine os reducers, caso tenha mais de um no futuro
const rootReducer = combineReducers({
  auth: authReducer,
});

// Configuração da persistência
const persistConfig = {
  key: 'root', // Chave no localStorage
  storage, // Usar localStorage para persistência
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuração da store
export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
