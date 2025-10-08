import { createSlice } from "@reduxjs/toolkit";

const initialToken = localStorage.getItem("userToken") || null;

const initialState = {
    token: initialToken,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
    },
});

export const { setToken } = authSlice.actions;

export default authSlice.reducer;
