import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FromState {
  from: string;
}

const initialState: FromState = {
  from: "/",
};

const fromSlice = createSlice({
  name: "from",
  initialState,
  reducers: {
    setFrom: (state, action: PayloadAction<string>) => {
      state.from = action.payload;
    },
  },
});

export const { setFrom } = fromSlice.actions;
export default fromSlice.reducer;
