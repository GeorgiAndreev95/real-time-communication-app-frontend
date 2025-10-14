import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import serverReducer from "./slices/serverSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        server: serverReducer,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
