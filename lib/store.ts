import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
// 定义一个示例slice
interface CounterState {
  value: number;
}
interface RootState {
  counter: CounterState;
}
const initialState: CounterState = {
  value: 0,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

const { increment, decrement, incrementByAmount } = counterSlice.actions;

// 创建store
const store = configureStore({
  reducer: (state: RootState | undefined, action) => {
    return {
      counter: counterSlice.reducer(state?.counter, action),
    };
  },
});

export { store, increment, decrement, incrementByAmount };
export type { RootState };
