import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import loading from './LodingState'
import postReducer from './postSlice'
import hasNotiStore from './hasNotiStore'

const store = configureStore({
    reducer: {
        auth: authSlice,
        posts: postReducer,
        loading,
        hasNotiStore,
    }
})

export default store;