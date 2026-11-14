/** Where the voter or organiser started buying credits (saved before checkout). */
export const getPaymentReturnUrl = () =>
  (typeof window !== "undefined" &&
    localStorage.getItem("payment_return_url")) ||
  "/";

/** Leaves checkout without paying: back to where the purchase started. */
export const cancelPayment = () => {
  const returnUrl = getPaymentReturnUrl();
  localStorage.removeItem("payment_amount");
  localStorage.removeItem("payment_return_url");
  localStorage.removeItem("election_id");
  localStorage.removeItem("payment_auth_context");
  window.location.assign(returnUrl);
};
