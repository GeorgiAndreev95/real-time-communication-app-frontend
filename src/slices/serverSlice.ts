import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userServers: [],
};

export const serverSlice = createSlice({
    name: "server",
    initialState,
    reducers: {
        setUserServers: (state, action) => {
            state.userServers = action.payload;
        },
    },
});

export const { setUserServers } = serverSlice.actions;

export default serverSlice.reducer;
