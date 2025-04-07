import {configureStore} from '@reduxjs/toolkit'
import authSlice from './authSlice'
import loading from './LodingState'

const store = configureStore({
    reducer:{
        auth:authSlice,
        loading,
    }
})

export default store;