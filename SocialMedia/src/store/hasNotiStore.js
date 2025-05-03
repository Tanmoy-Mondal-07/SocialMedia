import { createSlice } from '@reduxjs/toolkit'

const hasNotiStore = createSlice({
    name: 'hasNotification',
    initialState: { active: false },
    reducers: {
        haveNotification: (state) => { state.active = true },
        dontHaveNotification: (state) => { state.active = false }
    }
})

export const { haveNotification, dontHaveNotification } = hasNotiStore.actions
export default hasNotiStore.reducer
