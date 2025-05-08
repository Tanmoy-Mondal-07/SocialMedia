import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import loading from './LodingState'
import postReducer from './postSlice'
import hasNotiStore from './hasNotiStore'
import inbox from './inboxSlice'

const store = configureStore({
    reducer: {
        auth: authSlice,
        posts: postReducer,
        loading,
        hasNotiStore,
        inbox
    }
})

export default store;