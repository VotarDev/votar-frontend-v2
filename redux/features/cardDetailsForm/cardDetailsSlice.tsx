import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cardDetails: {
    nameOnCard: "",
    cardNumber: "",
    cardName: "",
    defaultForApps: false,
    defaultForGeneral: false,
    paymentOption: "",
  },
  addressDetails: {
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  },
};

const cardFormSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    updateCardDetails(state, action) {
      console.log("Updating Card Details:", action.payload);
      state.cardDetails = { ...state.cardDetails, ...action.payload };
    },
    updateAddressDetails(state, action) {
      state.addressDetails = { ...state.addressDetails, ...action.payload };
    },
    resetForm(state) {
      state.cardDetails = initialState.cardDetails;
      state.addressDetails = initialState.addressDetails;
    },
  },
});

export const { updateCardDetails, updateAddressDetails, resetForm } =
  cardFormSlice.actions;

export default cardFormSlice.reducer;
