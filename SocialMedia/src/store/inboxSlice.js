import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userChats: [],
    resivedUserList: [],
    allMessageRead: []
}

const inboxSlice = createSlice({
    name: "inbox",
    initialState,
    reducers: {
        addNewChats: (state, action) => {
            state.userChats = [...state.userChats, ...action.payload.userChats];

            let tempArr = []
            state.userChats.map(({ senderid, resiverid }) => {
                if (!state.resivedUserList.includes(senderid)) tempArr.push(senderid)
                if (!state.resivedUserList.includes(resiverid)) tempArr.push(resiverid)
            })
            state.resivedUserList = tempArr

            let allMessageReadTemp = {}
            function incrementCount(senderid) {
                allMessageReadTemp[senderid] = (allMessageReadTemp[senderid] || 0) + 1;
            }
            state.userChats.map(({ seen, senderid }) => {
                if (!seen) {
                    incrementCount(senderid)
                }
            })
            state.allMessageRead = allMessageReadTemp

            // console.log(state.allMessageRead);
        },

        refreshChats: (state, action) => {
            state.userChats = action.payload.userChats;

            let tempArr = []
            state.userChats.map(({ senderid, resiverid }) => {
                if (!state.resivedUserList.includes(senderid)) tempArr.push(senderid)
                if (!state.resivedUserList.includes(resiverid)) tempArr.push(resiverid)
            })
            state.resivedUserList = tempArr

            let allMessageReadTemp = {}
            function incrementCount(senderid) {
                allMessageReadTemp[senderid] = (allMessageReadTemp[senderid] || 0) + 1;
            }
            state.userChats.map(({ seen, senderid }) => {
                if (!seen) {
                    incrementCount(senderid)
                }
            })
            state.allMessageRead = allMessageReadTemp

            // console.log(state.allMessageRead);
        },
    }
})

export const { addNewChats,refreshChats } = inboxSlice.actions;

export default inboxSlice.reducer;