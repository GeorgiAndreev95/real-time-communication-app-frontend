import { createSlice } from "@reduxjs/toolkit";
import type { ServerChannel, UserServer } from "../types";

type ServerState = {
    userServers: UserServer[];
    serverChannels: ServerChannel[];
};

const initialState: ServerState = {
    userServers: [],
    serverChannels: [],
};

export const serverSlice = createSlice({
    name: "server",
    initialState,
    reducers: {
        setUserServers: (state, action) => {
            state.userServers = action.payload;
        },
        setServerChannels: (state, action) => {
            state.serverChannels = action.payload;
        },
        removeUserServer: (state, action) => {
            state.userServers = state.userServers.filter(
                (s) => s.serverId !== action.payload
            );
        },
        deleteServerChannel: (state, action) => {
            state.serverChannels = state.serverChannels.filter(
                (channel) => channel.id !== action.payload
            );
        },
    },
});

export const {
    setUserServers,
    setServerChannels,
    removeUserServer,
    deleteServerChannel,
} = serverSlice.actions;

export default serverSlice.reducer;
