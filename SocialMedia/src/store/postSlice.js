import { createSlice } from '@reduxjs/toolkit';

const postSlice = createSlice({
    name: 'posts',
    initialState: {
      data: [],
      page: 0,
      hasMore: true,
      users: {} 
    },
    reducers: {
      setPosts: (state, action) => {
        state.data = [...state.data, ...action.payload];
      },
      resetPosts: (state) => {
        state.data = [];
        state.page = 0;
        state.hasMore = true;
        state.users = {};
      },
      incrementPage: (state) => {
        state.page += 1;
      },
      setHasMore: (state, action) => {
        state.hasMore = action.payload;
      },
      setUser: (state, action) => {
        const { userId, userData } = action.payload;
        state.users[userId] = userData;
      }
    }
  });
  
  export const { setPosts, resetPosts, incrementPage, setHasMore, setUser } = postSlice.actions;
  export default postSlice.reducer;  