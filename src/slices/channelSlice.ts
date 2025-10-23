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
    },
});

export const { setChannelMessages, addChannelMessage } = channelSlice.actions;

export default channelSlice.reducer;
