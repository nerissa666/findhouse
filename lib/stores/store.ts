import { configureStore } from "@reduxjs/toolkit";
import cityReducer from "./slices/citySlice";
import fromReducer from "./slices/fromSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    city: cityReducer,
    from: fromReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
