import { createSlice } from '@reduxjs/toolkit'

const loadingSlice = createSlice({
    name: 'loading',
    initialState: { active: false },
    reducers: {
        showLoading: (state) => { state.active = true },
        hideLoading: (state) => { state.active = false }
    }
})

export const { showLoading, hideLoading } = loadingSlice.actions
export default loadingSlice.reducer
