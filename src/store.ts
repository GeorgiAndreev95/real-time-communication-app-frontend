import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import serverReducer from "./slices/serverSlice";
import channelReducer from "./slices/channelSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        server: serverReducer,
        channel: channelReducer,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
