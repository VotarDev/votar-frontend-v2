import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VotarCreditState {
  credit: number;
}

const initialState: VotarCreditState = {
  credit: 0,
};

const votarCreditSlice = createSlice({
  name: "votarCredit",
  initialState,
  reducers: {
    setVotarCredit: (state, action: PayloadAction<number>) => {
      state.credit = action.payload;
      localStorage.setItem("votarCredit", JSON.stringify(action.payload));
    },
    loadVotarCreditFromStorage: (state) => {
      const storedCredit = localStorage.getItem("votarCredit");
      if (storedCredit) {
        state.credit = JSON.parse(storedCredit);
      }
    },
  },
});

export const { setVotarCredit, loadVotarCreditFromStorage } =
  votarCreditSlice.actions;
export default votarCreditSlice.reducer;
