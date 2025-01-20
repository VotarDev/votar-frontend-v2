import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cardDetails: {
    nameOnCard: "",
    cardNumber: "",
    cardName: "",
    expireDate: "",
    cvv: "",
    defaultForApps: false,
    defaultForGeneral: false,
    paymentOption: "",
    cardType: "",
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
