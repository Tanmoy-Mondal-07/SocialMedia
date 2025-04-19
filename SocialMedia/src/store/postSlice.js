import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  cursor: null,
  hasMore: true,
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
  },
});

export const { setPosts, appendPosts, setCursor, setHasMore } = postSlice.actions;
export default postSlice.reducer;