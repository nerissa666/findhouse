import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectOption } from "@/app/types";

interface CityState {
  currentCity: SelectOption;
}

const initialState: CityState = {
  currentCity: {
    label: "北京",
    value: "AREA|88cff55c-aaa4-e2e0",
  },
};

const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {
    setCurrentCity: (state, action: PayloadAction<SelectOption>) => {
      state.currentCity = action.payload;
    },
  },
});

export const { setCurrentCity } = citySlice.actions;
export default citySlice.reducer;
