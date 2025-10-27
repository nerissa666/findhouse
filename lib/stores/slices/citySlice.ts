import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectOption } from "@/app/types";

interface CityState {
  currentCity: SelectOption;
}

const initialState: CityState = {
  currentCity: {
    label: "北京",
    value: "AREA|88cff55c-aaa4-e2e0",
    coord: {
      longitude: "116.397428",
      latitude: "39.909230",
    },
  },
};

const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {
    setCurrentCity: (state, action: PayloadAction<SelectOption>) => {
      console.log("action.payload", action.payload);
      state.currentCity = action.payload;
    },
  },
});

export const { setCurrentCity } = citySlice.actions;
export default citySlice.reducer;
