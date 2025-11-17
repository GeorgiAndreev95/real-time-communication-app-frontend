import { createSlice } from "@reduxjs/toolkit";
import type { ServerChannel, ServerMember, UserServer } from "../types";

type ServerState = {
    userServers: UserServer[];
    serverChannels: ServerChannel[];
    serverMembers: ServerMember[];
};

const initialState: ServerState = {
    userServers: [],
    serverChannels: [],
    serverMembers: [],
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
        setServerMembers: (state, action) => {
            state.serverMembers = action.payload;
        },
        removeUserServer: (state, action) => {
            state.userServers = state.userServers.filter(
                (s) => s.serverId !== action.payload
            );
        },
        updateServerChannel: (state, action) => {
            const updatedChannel = action.payload;
            const index = state.serverChannels.findIndex(
                (channel) => channel.id === updatedChannel.id
            );

            if (index !== -1) {
                state.serverChannels[index] = updatedChannel;
            }
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
    setServerMembers,
    removeUserServer,
    updateServerChannel,
    deleteServerChannel,
} = serverSlice.actions;

export default serverSlice.reducer;
