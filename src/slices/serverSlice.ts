import { createSlice } from "@reduxjs/toolkit";

import type { UserServer } from "../types";

type ServerSlice = {
    userServers: UserServer[];
    selectedChannels: {
        [serverId: number]: number;
    };
};

const initialState: ServerSlice = {
    userServers: [],
    selectedChannels: {},
};

export const serverSlice = createSlice({
    name: "server",
    initialState,
    reducers: {
        setUserServers: (state, action) => {
            state.userServers = action.payload;
        },
        setSelectedChannels: (state, action) => {
            const { serverId, channelId } = action.payload;
            state.selectedChannels[serverId] = channelId;
        },
    },
});

export const { setUserServers, setSelectedChannels } = serverSlice.actions;

export default serverSlice.reducer;
