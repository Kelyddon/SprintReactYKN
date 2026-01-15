import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import postsReducer from './postsSlice';

// Store Redux Toolkit = "single source of truth" pour l'état global.
// On y branche les reducers (slices) user + posts.
export const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer,
  },
});

// Types utilitaires pour avoir des hooks Redux typés en TypeScript.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
