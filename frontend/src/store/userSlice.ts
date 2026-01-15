import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types.ts';

type UserState = {
  user: User | null;
};

function loadInitialUser(): User | null {
  try {
    // On hydrate le state au démarrage depuis le localStorage
    // (pratique pour garder l'utilisateur connecté au refresh).
    const stored = localStorage.getItem('authUser');
    return stored ? (JSON.parse(stored) as User) : null;
  } catch {
    return null;
  }
}

const initialState: UserState = {
  user: loadInitialUser(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      // Met à jour le state + persiste dans le localStorage.
      state.user = action.payload;
      try {
        if (action.payload) localStorage.setItem('authUser', JSON.stringify(action.payload));
        else localStorage.removeItem('authUser');
      } catch {
        // ignore
      }
    },
    clearUser(state) {
      // Déconnexion : vide le state + localStorage.
      state.user = null;
      try {
        localStorage.removeItem('authUser');
      } catch {
        // ignore
      }
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
