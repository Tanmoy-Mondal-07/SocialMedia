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

            let tempArr = [];
            state.userChats.forEach(({ senderid, resiverid }) => {
                // check against tempArr, not the old list
                if (!tempArr.includes(senderid)) tempArr.push(senderid);
                if (!tempArr.includes(resiverid)) tempArr.push(resiverid);
            });
            // assign the reversed array back
            state.resivedUserList = tempArr.reverse()

            let allMessageReadTemp = {};
            function recordUnreadMessage({ senderid, message, seen, resiverid }) {
                if (seen) {
                    if (!allMessageReadTemp[senderid]) {
                        allMessageReadTemp[senderid] = {
                            count: 0,
                            latestMessage: message
                        };
                        allMessageReadTemp[resiverid] = {
                            count: 0,
                            latestMessage: message
                        };
                    } else {
                        allMessageReadTemp[senderid].count += 0;
                        allMessageReadTemp[senderid].latestMessage = message;
                        allMessageReadTemp[resiverid].latestMessage = message;
                    }
                } else {
                    if (!allMessageReadTemp[senderid]) {
                        allMessageReadTemp[senderid] = {
                            count: 1,
                            latestMessage: message
                        };
                        allMessageReadTemp[resiverid] = {
                            count: 1,
                            latestMessage: message
                        };
                    } else {
                        allMessageReadTemp[senderid].count += 1;
                        allMessageReadTemp[senderid].latestMessage = message;
                        allMessageReadTemp[resiverid].latestMessage = message;
                    }
                }
            }
            state.userChats.forEach(({ seen, senderid, message, resiverid }) => {
                recordUnreadMessage({ senderid, message, seen, resiverid });
            });
            state.allMessageRead = allMessageReadTemp
        },

        refreshChats: (state, action) => {
            state.userChats = action.payload.userChats;

            let tempArr = [];
            state.userChats.forEach(({ senderid, resiverid }) => {
                // check against tempArr, not the old list
                if (!tempArr.includes(senderid)) tempArr.push(senderid);
                if (!tempArr.includes(resiverid)) tempArr.push(resiverid);
            });
            // assign the reversed array back
            state.resivedUserList = tempArr.reverse()

            let allMessageReadTemp = {};
            function recordUnreadMessage({ senderid, message, seen, resiverid }) {
                if (seen) {
                    if (!allMessageReadTemp[senderid]) {
                        allMessageReadTemp[senderid] = {
                            count: 0,
                            latestMessage: message
                        };
                        allMessageReadTemp[resiverid] = {
                            count: 0,
                            latestMessage: message
                        };
                    } else {
                        allMessageReadTemp[senderid].count += 0;
                        allMessageReadTemp[senderid].latestMessage = message;
                        allMessageReadTemp[resiverid].latestMessage = message;
                    }
                } else {
                    if (!allMessageReadTemp[senderid]) {
                        allMessageReadTemp[senderid] = {
                            count: 1,
                            latestMessage: message
                        };
                        allMessageReadTemp[resiverid] = {
                            count: 1,
                            latestMessage: message
                        };
                    } else {
                        allMessageReadTemp[senderid].count += 1;
                        allMessageReadTemp[senderid].latestMessage = message;
                        allMessageReadTemp[resiverid].latestMessage = message;
                    }
                }
            }
            state.userChats.forEach(({ seen, senderid, message, resiverid }) => {
                recordUnreadMessage({ senderid, message, seen, resiverid });
            });
            state.allMessageRead = allMessageReadTemp
        },
    }
})

export const { addNewChats, refreshChats } = inboxSlice.actions;

export default inboxSlice.reducer;