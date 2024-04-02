import React from "react";

const CardHeader = () => {
  return (
    <div>
      <h1 className="text-3xl pt-10 pb-3">Manage Payment Cards</h1>
      <hr className="max-w-[40rem]"></hr>
      <p className="py-5">
        Votar uses secure, encrypted technology to store your payment cards. You
        can use the page
        <br />
        to manage the payment cards you have stored in our system. These cards
        can be used for checkout,
        <br />
        auto-renewals or topping up your account balance.
      </p>
    </div>
  );
};

export default CardHeader;
