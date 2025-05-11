import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userChats: [],
    resivedUserList: [],
    allMessageRead: {}
};

const uniqueBy = (arr, key) => {
    const map = arr.reduce((m, item) => {
        if (!m.has(item[key])) {
            m.set(item[key], item);
        }
        return m;
    }, new Map());
    return Array.from(map.values());
};

const buildUserList = (chats) => {
    const users = new Set();
    const chat = [...chats].reverse();
    chat.forEach(({ senderid, resiverid }) => {
        users.add(senderid);
        users.add(resiverid);
    });
    return Array.from(users);
};

const buildMessageReadMap = (chats) => {
    const messageMap = {};
    chats.forEach(({ senderid, resiverid, seen, message }) => {
        if (!seen) {
            if (!messageMap[senderid]) {
                messageMap[senderid] = { count: 1, latestMessage: message };
            } else {
                messageMap[senderid].count += 1;
                messageMap[senderid].latestMessage = message;
            }
        } else {
            if (!messageMap[senderid]) {
                messageMap[senderid] = { count: 0, latestMessage: message };
            } else {
                messageMap[senderid].latestMessage = message;
            }
        }

        if (!seen) {
            if (!messageMap[resiverid]) {
                messageMap[resiverid] = { count: 1, latestMessage: message };
            } else {
                messageMap[resiverid].count += 1;
                messageMap[resiverid].latestMessage = message;
            }
        } else {
            if (!messageMap[resiverid]) {
                messageMap[resiverid] = { count: 0, latestMessage: message };
            } else {
                messageMap[resiverid].latestMessage = message;
            }
        }
    });
    return messageMap;
};

const inboxSlice = createSlice({
    name: "inbox",
    initialState,
    reducers: {
        addNewChats: (state, action) => {
            state.userChats = uniqueBy([...state.userChats, ...action.payload.userChats], '$id');
            state.resivedUserList = buildUserList(state.userChats);
            state.allMessageRead = buildMessageReadMap(state.userChats);
        },
        refreshChats: (state, action) => {
            state.userChats = uniqueBy(action.payload.userChats, '$id');
            state.resivedUserList = buildUserList(state.userChats);
            state.allMessageRead = buildMessageReadMap(state.userChats);
        },
    }
});

export const { addNewChats, refreshChats } = inboxSlice.actions;

export default inboxSlice.reducer;