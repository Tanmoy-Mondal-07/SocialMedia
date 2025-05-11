import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userChats: [],
    resivedUserList: [],
    allMessageRead: {}
};

const buildUserList = (chats) => {
    const users = new Set();
    chats.forEach(({ senderid,resiverid }) => {
        users.add(senderid);
        users.add(resiverid);
    });
    return Array.from(users);
};

const buildMessageReadMap = (chats) => {
    const messageMap = {};
    chats.forEach(({ senderid, resiverid, seen, message }) => {
        const increment = seen ? 0 : 1;

        [senderid, resiverid].forEach(userId => {
            if (!messageMap[userId]) {
                messageMap[userId] = { count: increment, latestMessage: message };
            } else {
                messageMap[userId].count += userId === senderid ? increment : 0;
                messageMap[userId].latestMessage = message;
            }
        });
    });
    return messageMap;
};

const inboxSlice = createSlice({
    name: "inbox",
    initialState,
    reducers: {
        addNewChats: (state, action) => {
            state.userChats = [...state.userChats, ...action.payload.userChats];
            state.resivedUserList = buildUserList(state.userChats);
            // console.log(state.resivedUserList);
            state.allMessageRead = buildMessageReadMap(state.userChats);
        },
        refreshChats: (state, action) => {
            state.userChats = action.payload.userChats;
            state.resivedUserList = buildUserList(state.userChats);
            // console.log(state.resivedUserList);
            state.allMessageRead = buildMessageReadMap(state.userChats);
        },
    }
});

export const { addNewChats, refreshChats } = inboxSlice.actions;

export default inboxSlice.reducer;
