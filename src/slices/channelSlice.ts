import { createSlice } from "@reduxjs/toolkit";
import type { Message } from "../types";

type ChannelState = {
    channelMessages: Message[];
};

const initialState: ChannelState = {
    channelMessages: [],
};

export const channelSlice = createSlice({
    name: "channel",
    initialState,
    reducers: {
        setChannelMessages: (state, action) => {
            state.channelMessages = action.payload;
        },
        addChannelMessage: (state, action) => {
            state.channelMessages.push(action.payload);
        },
        editChannelMessage: (state, action) => {
            const index = state.channelMessages.findIndex(
                (msg) => msg.id === action.payload.id
            );
            if (index !== -1) {
                state.channelMessages[index] = {
                    ...state.channelMessages[index],
                    ...action.payload,
                };
            }
        },
        deleteChannelMessage: (state, action) => {
            state.channelMessages = state.channelMessages.filter(
                (msg) => msg.id !== action.payload
            );
        },
    },
});

export const {
    setChannelMessages,
    addChannelMessage,
    editChannelMessage,
    deleteChannelMessage,
} = channelSlice.actions;

export default channelSlice.reducer;
