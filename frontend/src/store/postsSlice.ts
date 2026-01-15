import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Post } from '../types.ts';

type PostsState = {
  items: Post[];
};

const initialState: PostsState = {
  items: [],
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<Post[]>) {
      // Remplace la liste des posts (ex: après un fetch /posts).
      state.items = action.payload;
    },
    clearPosts(state) {
      // Utile si on veut nettoyer au logout.
      state.items = [];
    },
  },
});

export const { setPosts, clearPosts } = postsSlice.actions;
export default postsSlice.reducer;
