import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import loading from './LodingState'
import postReducer from './postSlice'

const store = configureStore({
    reducer: {
        auth: authSlice,
        posts: postReducer,
        loading,
    }
})

export default store;