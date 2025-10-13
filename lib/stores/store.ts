import { configureStore } from "@reduxjs/toolkit";
import cityReducer from "./slices/citySlice";
import fromReducer from "./slices/fromSlice";

export const store = configureStore({
  reducer: {
    city: cityReducer,
    from: fromReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
