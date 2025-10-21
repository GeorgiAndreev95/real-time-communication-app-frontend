import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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
    },
});

export const { setUserServers, setServerChannels } = serverSlice.actions;

export default serverSlice.reducer;
