// src/redux/postSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  cursor: null,
  hasMore: true,
  users: {},
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.data = action.payload;
    },
    appendPosts: (state, action) => {
      state.data = [...state.data, ...action.payload];
    },
    setCursor: (state, action) => {
      state.cursor = action.payload;
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    setUser: (state, action) => {
      const { userId, userData } = action.payload;
      state.users[userId] = userData;
    },
  },
});

export const { setPosts, appendPosts, setCursor, setHasMore, setUser } = postSlice.actions;
export default postSlice.reducer;